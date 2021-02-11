'use static'

/*
00051 //AVC Profile IDC definitions
00052 #define BASELINE         66
00053 #define MAIN             77
00054 #define EXTENDED         88
00055 #define FREXT_HP        100
00056 #define FREXT_Hi10P     110
00057 #define FREXT_Hi422     122
00058 #define FREXT_Hi444     244
00059 #define FREXT_CAVLC444   44
 */

// noinspection JSUnusedLocalSymbols,JSUnusedGlobalSymbols
/**
 * Tools for handling H.264 bitstream issues.
 */
class Bitstream {
  buffer = null
  ptr = 0
  max = 0

  /**
   * Construct a bitstream
   * @param stream  Buffer containing the stream
   * @param max  Length, in BITS, of stream  (optional)
   */
  constructor (stream, max) {
    this.buffer = new Uint8Array(stream, 0, stream.byteLength)
    this.ptr = 0
    this.max = max || (stream.byteLength << 3)
  }

  /**
   * utility  / debugging function to examine next 16 bits of stream
   * @returns {number} Remaining unconsumed bits in the stream
   * (Careful: getters cannot have side-effects like advancing a pointer)
   */
  get peek16 () {
    let n = 16
    let p = this.ptr
    if (n + p > this.remaining) n = this.remaining
    const bitstrings = []
    const hexstrings = []
    /* nibble accumulators */
    const bits = []
    let nibble = 0
    for (let i = 0; i < n; i++) {
      const q = (p >> 3)
      const o = 0x07 - (p & 0x07)
      const bit = (this.buffer[q] >> o) & 0x01
      nibble = (nibble << 1) | bit
      bits.push(bit)
      p++
      if (i === n - 1 || (i % 4) === 3) {
        hexstrings.push(nibble.toString(16))
        let bitstring = ''
        bits.map((bit) => bitstring += (bit === 0) ? '0' : '1')
        bitstrings.push(bitstring)
        bits.length = 0
        nibble = 0
      }
    }
    const result = bitstrings.join(' ') + ' ' + hexstrings.join('')
    return result
  }

  /**
   * number of bits remaining in the present stream
   * @returns {number}
   */
  get remaining () {
    return this.max - this.ptr
  }

  /**
   * number of bits already consumed in the present stream
   * @returns {number}
   */
  get consumed () {
    return this.ptr
  }

  /**
   * get one bit
   * @returns {number}
   */
  u_1 () {
    if (this.ptr + 1 >= this.max) throw new Error('bitstream exhausted')
    const p = (this.ptr >> 3)
    const o = 0x07 - (this.ptr & 0x07)
    const val = (this.buffer[p] >> o) & 0x01
    this.ptr++
    return val
  }

  /**
   * get two bits
   * @returns {number}
   */
  u_2 () {
    return (this.u_1() << 1) | (this.u_1())
  }

  /**
   * get three bits
   * @returns {number}
   */
  u_3 () {
    return (this.u_1() << 2) | (this.u_1() << 1) | (this.u_1())
  }

  /**
   * get n bits
   * @param n
   * @returns {number}
   */
  u (n) {
    if (this.ptr + n >= this.max) throw new Error('bitstream exhausted')
    let val = 0
    for (let i = 0; i < n; i++) {
      val = (val << 1) | this.u_1()
    }
    return val
  }

  /**
   * get one byte (as an unsigned number)
   * @returns {number}
   */
  u_8 () {
    if (this.ptr + 8 >= this.max) throw new Error('bitstream exhausted')
    if ((this.ptr & 0x07) === 0) {
      const val = this.buffer[(this.ptr >> 3)]
      this.ptr += 8
      return val
    } else return this.u(8)
  }

  /**
   * get an unsigned H.264-style variable-bit number
   * in exponential Golomb format
   * @returns {number}
   */
  ue_v () {
    let zeros = 0
    while (!this.u_1()) zeros++
    let val = 1 << zeros
    for (let i = zeros - 1; i >= 0; i--) {
      val |= (this.u_1() << i)
    }
    return val - 1
  }

  /**
   * get a signed h.264-style variable bit number
   * in exponential Golomb format
   * @returns {number}
   */
  se_v () {
    const codeword = this.ue_v()
    if (codeword & 0x01) {
      return 1 + (codeword >> 1)
    }
    return -(codeword >> 1)
  }
}

/**
 * Handle the parsing and creation of "avcC" atoms.
 */
class AvcC {
  strict = true
  sps = []
  pps = []
  configurationVersion = 1
  profileIndication = 0xff
  profileCompatibility = 0xff
  avcLevelIndication = 0xff
  boxSizeMinusOne = 3
  #avcC = null
  extradata = null

  /**
   * The options here:
   *    options.bitstream is a bunch of NALUs, the video payload from a webm key frame.
   *    options.NALUStream, a bitstream in a NALUStream object, read on.
   *    options.sps and options.pps   SPS and PPS NALUs from the H.264 bitstream.
   *    options.avcC. an existing avcC object.
   *    options.strict  if true, this throws more errors on unexpected data.
   * @param options
   */
  constructor (options) {
    if (typeof options.strict === 'boolean') this.strict = options.strict
    if (typeof options.strictLength === 'boolean') this.strictLength = options.strictLength
    /* construct avcC from NALU stream */
    let stream
    if (options.bitstream || options.naluStream) {
      stream = options.naluStream ? options.naluStream : new NALUStream(options.bitstream, options)
      this.boxSizeMinusOne = stream.boxSizeMinusOne
      let sps
      let pps
      for (const nalu of stream) {
        switch (nalu[0] & 0x1f) {
          case 7:
            this.#unpackSps(nalu)
            this.sps.push(nalu)
            break
          case 8:
            this.#unpackPps(nalu)
            this.pps.push(nalu)
            break
        }
        if (this.pps.length > 0 && this.sps.length > 0) return
      }
      if (this.strict) throw new Error('Bitstream needs both sps and pps')
    }
    /* construct avcC from sps and pps */
    else if (options.sps && options.pps) {
      this.#unpackSps(options.sps)
      this.#unpackPps(options.pps)
      this.sps.push(options.sps)
      this.pps.push(options.pps)

    }
    /* construct it from avcC stream */
    else if (options.avcC) {
      this.#avcC = options.avcC
      this.#parseAvcC(options.avcC)

    }
  }

  /**
   * setter for the avcC object
   * @param {Uint8Array} avcC
   */
  set avcC (avcC) {
    this.#avcC = avcC
    this.#parseAvcC(avcC)
  }

  /**
   * getter for the avcC object
   * @returns {Uint8Array}
   */
  get avcC () {
    this.#avcC = this.#packAvcC()
    return this.#avcC
  }

  get hex () {
    return NALUStream.array2hex(this.#avcC)
  }

  /**
   * getter for the MIME type encoded in this avcC
   * @returns {string}
   */
  get MIME () {
    const f = []
    f.push('avc1.')
    f.push(AvcC.byte2hex(this.profileIndication).toUpperCase())
    f.push(AvcC.byte2hex(this.profileCompatibility).toUpperCase())
    f.push(AvcC.byte2hex(this.avcLevelIndication).toUpperCase())
    return f.join('')
  }

  #parseAvcC (inbuff) {
    const buf = new Uint8Array(inbuff, 0, inbuff.byteLength)
    const buflen = buf.byteLength
    if (buflen < 10) throw new Error('avcC object too short')
    let ptr = 0
    this.configurationVersion = buf[ptr++]
    if (this.strict && this.configurationVersion !== 1)
      throw new Error(`configuration version must be 1: ${this.configurationVersion}`)
    this.profileIndication = buf[ptr++]
    this.profileCompatibility = buf[ptr++]
    this.avcLevelIndication = buf[ptr++]
    this.boxSizeMinusOne = buf[ptr++] & 3
    let nalen = buf[ptr++] & 0x1f
    ptr = this.#captureNALUs(buf, ptr, nalen, this.sps)
    nalen = buf[ptr++]
    ptr = this.#captureNALUs(buf, ptr, nalen, this.pps)
    if (ptr < buflen) this.extradata = buf.subarray(ptr, buflen)
    ptr = buflen
    return inbuff
  }

  #captureNALUs (buf, ptr, count, nalus) {
    nalus.length = 0
    if (this.strict && count <= 0)
      throw new Error(`at least one NALU is required`)
    try {
      for (let i = 0; i < count; i++) {
        const len = AvcC.readUInt16BE(buf, ptr)
        ptr += 2
        const nalu = buf.slice(ptr, ptr + len)
        nalus.push(nalu)
        ptr += len
      }
    } catch (ex) {
      throw new Error(ex)
    }
    return ptr

  }

  #unpackSps (sps) {
    let p = 0
    let b = sps[p++]
    const forbidden_zero_bit = Boolean(b & 0x80)
    const nal_ref_idc = (b & 0x60) >> 5
    const nal_unit_type = (b & 0x1f)
    if (this.strict) {
      if (nal_unit_type !== 7) throw new Error('NALU not SPS')
      if (forbidden_zero_bit) throw new Error('NALU forbidden_zero_bit is nonzero')
    }
    b = sps[p++]
    const profile_idc = b
    b = sps[p++]
    const profile_compatibility = b
    const constraint_set0_flag = Boolean(b & 0x80)
    const constraint_set1_flag = Boolean(b & 0x40)
    const constraint_set2_flag = Boolean(b & 0x20)
    const constraint_set3_flag = Boolean(b & 0x10)
    const constraint_set4_flag = Boolean(b & 0x08)
    const constraint_set5_flag = Boolean(b & 0x04)
    const reserved_zero_2bits = b & 0x03
    if (this.strict) {
      if (reserved_zero_2bits !== 0) throw new Error('reserved_zero_2bits is not zero')
    }
    b = sps[p++]
    const level_idc = b
    this.profileIndication = profile_idc
    this.profileCompatibility = profile_compatibility
    this.avcLevelIndication = level_idc

    /* TODO a whole mess of other variable-length-coded exp-Golomb stuff. */
    return sps
  }

  #unpackPps (pps) {
    let p = 0
    let b = 0
    b = pps[p++]
    const forbidden_zero_bit = Boolean(b & 0x80)
    const nal_ref_idc = (b & 0x60) >> 5
    const nal_unit_type = (b & 0x1f)
    if (this.strict) {
      if (nal_unit_type !== 8) throw new Error('NALU not PPS')
      if (forbidden_zero_bit) throw new Error('NALU forbidden_zero_bit is nonzero')
    }
    return pps
  }

  /**
   * pack the avcC atom bitstream from the information in the class
   * @returns {Uint8Array}
   */
  #packAvcC () {
    let length = 6
    for (let spsi = 0; spsi < this.sps.length; spsi++) length += 2 + this.sps[spsi].byteLength
    length += 1
    for (let ppsi = 0; ppsi < this.pps.length; ppsi++) length += 2 + this.pps[ppsi].byteLength
    if (this.extradata) length += this.extradata.byteLength
    const buf = new Uint8Array(length)
    let p = 0
    buf[p++] = this.configurationVersion
    buf[p++] = this.profileIndication
    buf[p++] = this.profileCompatibility
    buf[p++] = this.avcLevelIndication
    if (this.strict && (this.boxSizeMinusOne < 0 || this.boxSizeMinusOne > 3))
      throw new Error('bad boxSizeMinusOne value: ' + this.boxSizeMinusOne)
    buf[p++] = (0xfc | (0x03 & this.boxSizeMinusOne))
    p = AvcC.#appendNALUs(buf, p, this.sps, 0x1f)
    p = AvcC.#appendNALUs(buf, p, this.pps, 0xff)
    if (p < length) buf.set(this.extradata, p)
    return buf
  }

  /**
   * put NALU data (sps or pps) into output buffer
   * @param {Uint8Array} buf buffer
   * @param p {integer} pointer to buf
   * @param nalus {array}  sps[] or pps[]
   * @param mask {integer} mask for setting bits in nalu-count field
   * @returns {integer} updated pointer.
   */
  static #appendNALUs (buf, p, nalus, mask) {
    const setBits = ~mask
    if (this.strict && (nalus.length <= 0 || nalus.length > mask))
      throw new Error('too many or not enough NALUs: ' + nalus.length)
    buf[p++] = (setBits | (nalus.length & mask))
    for (let nalui = 0; nalui < nalus.length; nalui++) {
      const nalu = nalus[nalui]
      const len = nalu.byteLength
      if (this.strict && (len <= 0 || len > 0xffff))
        throw new Error('NALU has wrong length: ' + len)
      buf[p++] = 0xff & (len >> 8)
      buf[p++] = 0xff & len
      buf.set(nalu, p)
      p += len
    }
    return p
  }

  static readUInt16BE (buff, ptr) {
    return ((buff[ptr] << 8) & 0xff00) | ((buff[ptr + 1]) & 0x00ff) // jshint ignore:line
  }

  static readUInt32BE (buff, ptr) {
    let result = 0 | 0
    for (let i = ptr; i < ptr + 4; i++) {
      result = ((result << 8) | buff[i])
    }
    return result
  }

  static readUInt24BE (buff, ptr) {
    let result = 0 | 0
    for (let i = ptr; i < ptr + 3; i++) {
      result = ((result << 8) | buff[i])
    }
    return result
  }

  static byte2hex (val) {
    return ('00' + val.toString(16)).slice(-2)
  }

}

/**
 * process buffers full of NALU streams
 */
class NALUStream {
  static #validTypes = new Set(['packet', 'annexB', 'unknown'])
  strict = false
  type = null
  buf = null
  boxSize = null
  #cursor = 0
  #nextPacket = undefined

  /**
   * Construct a NALUStream from a buffer, figuring out what kind of stream it
   * is when the options are omitted.
   * @param {Uint8Array} buf buffer with a sequence of one or more NALUs
   * @param options strict, boxSize, boxSizeMinusOne, type='packet' or 'annexB',
   */
  constructor (buf, options) {
    if (options) {
      if (typeof options.strict === 'boolean') this.strict = Boolean(options.strict)
      if (options.boxSizeMinusOne) this.boxSize = options.boxSizeMinusOne + 1
      if (options.boxSize) this.boxSize = options.boxSize
      if (options.type) this.type = options.type
      if (this.type && !NALUStream.#validTypes.has(this.type))
        throw new Error('incorrect NALUStream type')
    }

    if (this.strict & this.boxSize && (this.boxSize < 1 || this.boxSize > 4))
      throw new Error('invalid boxSize')

    /* don't copy this.buf from input, just project it */
    this.buf = new Uint8Array(buf, 0, buf.length)

    if (!this.type || !this.boxSize) {
      const { type, boxSize } = this.#getType(4)
      this.type = type
      this.boxSize = boxSize
    }
    this.#nextPacket = this.type === 'packet'
      ? this.#nextLengthCountedPacket
      : this.#nextAnnexBPacket
  }

  get boxSizeMinusOne () {
    return this.boxSize - 1
  }

  /**
   * getter for number of NALUs in the stream
   * @returns {number}
   */
  get packetCount () {
    return this.#iterate()
  }

  /**
   * Iterator allowing
   *      for (const nalu of stream) { }
   * Yields, space-efficiently, the elements of the stream
   * NOTE WELL: this yields subarrays of the NALUs in the stream, not copies.
   * so changing the NALU contents also changes the stream. Beware.
   * @returns {{next: next}}
   */
  [Symbol.iterator] () {
    let delim = { n: 0, s: 0, e: 0 }
    return {
      next: () => {
        if (this.type === 'unknown'
          || this.boxSize < 1
          || delim.n < 0)
          return { value: undefined, done: true }
        delim = this.#nextPacket(this.buf, delim.n, this.boxSize)
        while (true) {
          if (delim.e > delim.s) {
            const pkt = this.buf.subarray(delim.s, delim.e)
            return { value: pkt, done: false }
          }
          if (delim.n < 0) break
          delim = this.#nextPacket(this.buf, delim.n, this.boxSize)
        }
        return { value: undefined, done: true }
      }
    }
  }

  /**
   * Returns an array of NALUs
   * NOTE WELL: this yields subarrays of the NALUs in the stream, not copies.
   * so changing the NALU contents also changes the stream. Beware.
   * @returns {[]}
   */
  get packets () {
    const pkts = []
    this.#iterate((buf, first, last) => {
      const pkt = buf.subarray(first, last)
      pkts.push(pkt)
    })
    return pkts
  }

  /**
   * Convert an annexB stream to a packet stream in place, overwriting the buffer
   * @returns {NALUStream}
   */
  convertToPacket () {
    if (this.type === 'packet') return this
    /* change 00 00 00 01 delimiters to packet lengths */
    if (this.type === 'annexB' && this.boxSize === 4) {
      this.#iterate((buff, first, last) => {
        let p = first - 4
        if (p < 0) throw new Error('Unexpected packet format')
        const len = last - first
        buff[p++] = 0xff & (len >> 24)
        buff[p++] = 0xff & (len >> 16)
        buff[p++] = 0xff & (len >> 8)
        buff[p++] = 0xff & len
      })
    }
    /* change 00 00 01 delimiters to packet lengths */
    else if (this.type === 'annexB' && this.boxSize === 3) {
      this.#iterate((buff, first, last) => {
        let p = first - 3
        if (p < 0) throw new Error('Unexpected packet format')
        const len = last - first
        if (this.strict && (0xff & (len >> 24) != 0))
          throw new Exception('Packet too long to store length when boxLenMinusOne is 2')
        buff[p++] = 0xff & (len >> 16)
        buff[p++] = 0xff & (len >> 8)
        buff[p++] = 0xff & len
      })
    }
    this.type = 'packet'
    this.#nextPacket = this.#nextLengthCountedPacket

    return this
  }

  #iterate (callback) {
    if (this.type === 'unknown') return 0
    if (this.boxSize < 1) return 0
    let packetCount = 0
    let delim = this.#nextPacket(this.buf, 0, this.boxSize)
    while (true) {
      if (delim.e > delim.s) {
        packetCount++
        if (typeof callback === 'function') callback(this.buf, delim.s, delim.e)
      }
      if (delim.n < 0) break
      delim = this.#nextPacket(this.buf, delim.n, this.boxSize)
    }
    return packetCount
  }

  /**
   * iterator helper for delimited streams either 00 00 01  or 00 00 00 01
   * @param buf
   * @param p
   * @returns {{s: *, e: *, n: *}|{s: *, e: *, n: number}|{s: *, e: ((string: (string | NodeJS.ArrayBufferView | ArrayBuffer | SharedArrayBuffer), encoding?: BufferEncoding) => number) | number, n: number}}
   */
  #nextAnnexBPacket (buf, p) {
    const buflen = buf.byteLength
    const start = p
    if (p === buflen) return { n: -1, s: start, e: p }
    while (p < buflen) {
      if (p + 2 > buflen) return { n: -1, s: start, e: buflen }
      if (buf[p] === 0 && buf[p + 1] === 0) {
        const d = buf[p + 2]
        if (d === 1) {
          /* 00 00 01 found */
          return { n: p + 3, s: start, e: p }
        } else if (d === 0) {
          if (p + 3 > buflen) return { n: -1, s: start, e: buflen }
          const e = buf[p + 3]
          if (e === 1) {
            /* 00 00 00 01 found */
            return { n: p + 4, s: start, e: p }
          }
        }
      }
      p++
    }
    return { n: -1, s: start, e: p }
  }

  /**
   * iterator helper for length-counted data
   * @param buf
   * @param p
   * @param boxSize
   * @returns {{s: *, e: *, n: *}|{s: number, e: number, message: string, n: number}}
   */
  #nextLengthCountedPacket (buf, p, boxSize) {
    const buflen = buf.byteLength
    if (p < buflen) {
      let plength = NALUStream.readUIntNBE(buf, p, boxSize)
      if (plength < 2 || plength > buflen + boxSize) {
        return { n: -2, s: 0, e: 0, message: 'bad length' }
      }
      return { n: p + boxSize + plength, s: p + boxSize, e: p + boxSize + plength }
    }
    return { n: -1, s: 0, e: 0, message: 'end of buffer' }
  }

  /**
   * figure out type of data stream
   * @returns {{boxSize: number, type: string}}
   */
  #getType (scanLimit) {
    if (this.type && this.boxSize) return { type: this.type, boxSize: this.boxSize }
    /* start with a delimiter? */
    if (!this.type || this.type === 'annexB') {
      if (this.buf[0] === 0 && this.buf[1] === 0 && this.buf[2] === 1) {
        return { type: 'annexB', boxSize: 3 }
      } else if (this.buf[0] === 0 && this.buf[1] === 0 && this.buf[2] === 0 && this.buf[3] === 1) {
        return { type: 'annexB', boxSize: 4 }
      }
    }
    /* possibly packet stream with lengths */
    /* try various boxSize values */
    for (let boxSize = 4; boxSize >= 1; boxSize--) {
      let packetCount = 0
      if (this.buf.length <= boxSize) {
        packetCount = -1
        break
      }
      let delim = this.#nextLengthCountedPacket(this.buf, 0, boxSize)
      while (true) {
        if (delim.n < -1) {
          packetCount = -1
          break
        }
        if (delim.e - delim.s) {
          packetCount++
          if (scanLimit && packetCount >= scanLimit) break
        }
        if (delim.n < 0) break
        delim = this.#nextLengthCountedPacket(this.buf, delim.n, boxSize)
      }
      if (packetCount > 0) {
        return { type: 'packet', boxSize: boxSize }
      }
    }
    if (this.strict) throw new Error('Cannot determine stream type or box size')
    return { type: 'unknown', boxSize: -1 }
  }

  /**
   * read an n-byte unsigned number
   * @param buff
   * @param ptr
   * @param boxSize
   * @returns {number}
   */
  static readUIntNBE (buff, ptr, boxSize) {
    if (!boxSize) throw new Error('need a boxsize')
    let result = 0 | 0
    for (let i = ptr; i < ptr + boxSize; i++) {
      result = ((result << 8) | buff[i])
    }
    return result
  }

  static array2hex (array) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(array, 0, array.byteLength), x => ('00' + x.toString(16)).slice(-2)).join(' ')
  }

}

if (typeof module !== 'undefined') module.exports = { Bitstream, AvcC, NALUStream }
