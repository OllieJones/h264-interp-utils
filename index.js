/* eslint-disable camelcase,curly */

export const profileNames = {
  66: 'BASELINE',
  77: 'MAIN',
  88: 'EXTENDED',
  100: 'FREXT_HP',
  110: 'FREXT_Hi10P',
  122: 'FREXT_Hi422',
  244: 'FREXT_Hi444',
  44: 'FREXT_CAVLC444'
}

export const chromaFormatValues = {
  0: 'YUV400',
  1: 'YUV420',
  2: 'YUV422',
  3: 'YUV444'
}

export class Slice {
  constructor (slice, avcc) {
    /* we won't parse out much of this, so use subarray */
    const bitstream = new Bitstream(slice.subarray(0, 10))

    const forbidden_zero_bit = bitstream.u_1()
    if (forbidden_zero_bit) throw new Error('NALU error: invalid NALU header')
    this.nal_ref_id = bitstream.u_2()
    this.nal_unit_type = bitstream.u(5)
    if (this.nal_unit_type !== 1 && this.nal_unit_type !== 5)
      throw new Error('Slice error: not slice_layer_without_partitioning')
    this.first_mb_in_slice = bitstream.ue_v()
    this.slice_type = bitstream.ue_v()
    this.pic_parameter_set_id = bitstream.ue_v()
    if (avcc && avcc.ppsDecoded[this.pic_parameter_set_id]) {
      const pps = avcc.ppsDecoded[this.pic_parameter_set_id]
      if (pps.separate_colour_plane_flag) {
        this.colour_plane_id = bitstream.u_2()
      }
      const seq_parameter_set_id = pps.seq_parameter_set_id
      if (avcc && avcc.spsDecoded[seq_parameter_set_id]) {
        const sps = avcc.spsDecoded[seq_parameter_set_id]
        this.frame_num = bitstream.u(sps.log2_max_frame_num_minus4 + 4)
      }
    }
  }
}

export class SPS {
  constructor (SPS) {
    const bitstream = new Bitstream(SPS)
    this.bitstream = bitstream
    this.buffer = bitstream.buffer

    const forbidden_zero_bit = bitstream.u_1()
    if (forbidden_zero_bit) throw new Error('NALU error: invalid NALU header')
    this.nal_ref_id = bitstream.u_2()
    this.nal_unit_type = bitstream.u(5)
    if (this.nal_unit_type !== 7) throw new Error('SPS error: not SPS')

    this.profile_idc = bitstream.u_8()
    if (profileNames[this.profile_idc]) {
      this.profileName = profileNames[this.profile_idc]
    } else {
      throw new Error('SPS error: invalid profile_idc')
    }

    this.constraint_set0_flag = bitstream.u_1()
    this.constraint_set1_flag = bitstream.u_1()
    this.constraint_set2_flag = bitstream.u_1()
    this.constraint_set3_flag = bitstream.u_1()
    this.constraint_set4_flag = bitstream.u_1()
    this.constraint_set5_flag = bitstream.u_1()
    const reserved_zero_2bits = bitstream.u_2()
    if (reserved_zero_2bits !== 0)
      throw new Error('SPS error: reserved_zero_2bits must be zero')

    this.level_idc = bitstream.u_8()

    this.seq_parameter_set_id = bitstream.ue_v()
    if (this.seq_parameter_set_id > 31)
      throw new Error('SPS error: seq_parameter_set_id must be 31 or less')

    this.has_no_chroma_format_idc =
      (this.profile_idc === 66 || this.profile_idc === 77 || this.profile_idc === 88)

    if (!this.has_no_chroma_format_idc) {
      this.chroma_format_idc = bitstream.ue_v()
      if (this.bit_depth_luma_minus8 > 3)
        throw new Error('SPS error: chroma_format_idc must be 3 or less')
      if (this.chroma_format_idc === 3) { /* 3 = YUV444 */
        this.separate_colour_plane_flag = bitstream.u_1()
        this.chromaArrayType = this.separate_colour_plane_flag ? 0 : this.chroma_format_idc
      }
      this.bit_depth_luma_minus8 = bitstream.ue_v()
      if (this.bit_depth_luma_minus8 > 6)
        throw new Error('SPS error: bit_depth_luma_minus8 must be 6 or less')
      this.bitDepthLuma = this.bit_depth_luma_minus8 + 8
      this.bit_depth_chroma_minus8 = bitstream.ue_v()
      if (this.bit_depth_chroma_minus8 > 6)
        throw new Error('SPS error: bit_depth_chroma_minus8 must be 6 or less')
      this.lossless_qpprime_flag = bitstream.u_1()
      this.bitDepthChroma = this.bit_depth_chroma_minus8 + 8
      this.seq_scaling_matrix_present_flag = bitstream.u_1()
      if (this.seq_scaling_matrix_present_flag) {
        const n_ScalingList = (this.chroma_format_idc !== 3) ? 8 : 12
        this.seq_scaling_list_present_flag = []
        this.seq_scaling_list = []
        for (let i = 0; i < n_ScalingList; i++) {
          const seqScalingListPresentFlag = bitstream.u_1()
          this.seq_scaling_list_present_flag.push(seqScalingListPresentFlag)
          if (seqScalingListPresentFlag) {
            const sizeOfScalingList = i < 6 ? 16 : 64
            let nextScale = 8
            let lastScale = 8
            const delta_scale = []
            for (let j = 0; j < sizeOfScalingList; j++) {
              if (nextScale !== 0) {
                const deltaScale = bitstream.se_v()
                delta_scale.push(deltaScale)
                nextScale = (lastScale + delta_scale + 256) % 256
              }
              lastScale = (nextScale === 0) ? lastScale : nextScale
              this.seq_scaling_list.push(delta_scale)
            }
          }
        }
      }
    }

    this.log2_max_frame_num_minus4 = bitstream.ue_v()
    if (this.log2_max_frame_num_minus4 > 12)
      throw new Error('SPS error: log2_max_frame_num_minus4 must be 12 or less')
    this.maxFrameNum = 1 << (this.log2_max_frame_num_minus4 + 4)

    this.pic_order_cnt_type = bitstream.ue_v()
    if (this.pic_order_cnt_type > 2)
      throw new Error('SPS error: pic_order_cnt_type must be 2 or less')

    let expectedDeltaPerPicOrderCntCycle = 0
    switch (this.pic_order_cnt_type) {
      case 0:
        this.log2_max_pic_order_cnt_lsb_minus4 = bitstream.ue_v()
        if (this.log2_max_pic_order_cnt_lsb_minus4 > 12)
          throw new Error('SPS error: log2_max_pic_order_cnt_lsb_minus4 must be 12 or less')
        this.maxPicOrderCntLsb = 1 << (this.log2_max_pic_order_cnt_lsb_minus4 + 4)
        break
      case 1:
        this.delta_pic_order_always_zero_flag = bitstream.u_1()
        this.offset_for_non_ref_pic = bitstream.se_v()
        this.offset_for_top_to_bottom_field = bitstream.se_v()
        this.num_ref_frames_in_pic_order_cnt_cycle = bitstream.ue_v()
        this.offset_for_ref_frame = []
        for (let i = 0; i < this.num_ref_frames_in_pic_order_cnt_cycle; i++) {
          const offsetForRefFrame = bitstream.se_v()
          this.offset_for_ref_frame.push(offsetForRefFrame)
          // eslint-disable-next-line no-unused-vars
          expectedDeltaPerPicOrderCntCycle += offsetForRefFrame
        }
        break
      case 2:
        /* there is nothing for case 2 */
        break
    }

    this.max_num_ref_frames = bitstream.ue_v()
    this.gaps_in_frame_num_value_allowed_flag = bitstream.u_1()
    this.pic_width_in_mbs_minus_1 = bitstream.ue_v()
    this.picWidth = (this.pic_width_in_mbs_minus_1 + 1) << 4
    this.pic_height_in_map_units_minus_1 = bitstream.ue_v()
    this.frame_mbs_only_flag = bitstream.u_1()
    this.interlaced = !this.frame_mbs_only_flag
    if (this.frame_mbs_only_flag === 0) { /* 1 if frames rather than fields (no interlacing) */
      this.mb_adaptive_frame_field_flag = bitstream.u_1()
    }
    this.picHeight = ((2 - this.frame_mbs_only_flag) * (this.pic_height_in_map_units_minus_1 + 1)) << 4

    this.direct_8x8_inference_flag = bitstream.u_1()
    this.frame_cropping_flag = bitstream.u_1()
    if (this.frame_cropping_flag) {
      this.frame_cropping_rect_left_offset = bitstream.ue_v()
      this.frame_cropping_rect_right_offset = bitstream.ue_v()
      this.frame_cropping_rect_top_offset = bitstream.ue_v()
      this.frame_cropping_rect_bottom_offset = bitstream.ue_v()
      this.cropRect = {
        x: this.frame_cropping_rect_left_offset,
        y: this.frame_cropping_rect_top_offset,
        width: this.picWidth - (this.frame_cropping_rect_left_offset + this.frame_cropping_rect_right_offset),
        height: this.picHeight - (this.frame_cropping_rect_top_offset + this.frame_cropping_rect_bottom_offset)
      }
    } else {
      this.cropRect = {
        x: 0,
        y: 0,
        width: this.picWidth,
        height: this.picHeight
      }
    }
    this.vui_parameters_present_flag = bitstream.u_1()
    if (this.vui_parameters_present_flag) {
      this.aspect_ratio_info_present_flag = bitstream.u_1()
      if (this.aspect_ratio_info_present_flag) {
        this.aspect_ratio_idc = bitstream.u_8()
        if (this.aspect_ratio_idc) {
          this.sar_width = bitstream.u(16)
          this.sar_height = bitstream.u(16)
        }
      }

      this.overscan_info_present_flag = bitstream.u_1()
      if (this.overscan_info_present_flag)
        this.overscan_appropriate_flag = bitstream.u_1()
      this.video_signal_type_present_flag = bitstream.u_1()
      if (this.video_signal_type_present_flag) {
        this.video_format = bitstream.u(3)
        this.video_full_range_flag = bitstream.u_1()
        this.color_description_present_flag = bitstream.u_1()
        if (this.color_description_present_flag) {
          this.color_primaries = bitstream.u_8()
          this.transfer_characteristics = bitstream.u_8()
          this.matrix_coefficients = bitstream.u_8()
        }
      }
      this.chroma_loc_info_present_flag = bitstream.u_1()
      if (this.chroma_loc_info_present_flag) {
        this.chroma_sample_loc_type_top_field = bitstream.ue_v()
        this.chroma_sample_loc_type_bottom_field = bitstream.ue_v()
      }
      this.timing_info_present_flag = bitstream.u_1()
      if (this.timing_info_present_flag) {
        this.num_units_in_tick = bitstream.u(32)
        this.time_scale = bitstream.u(32)
        this.fixed_frame_rate_flag = bitstream.u_1()
        if (this.num_units_in_tick > 0) {
          this.framesPerSecond = this.time_scale / this.num_units_in_tick
        }
      }
      this.nal_hrd_parameters_present_flag = bitstream.u_1()
    }
    this.success = true
  }

  get stream () {
    return this.bitstream.stream
  }

  get profile_compatibility () {
    let v = this.constraint_set0_flag << 7
    v |= this.constraint_set1_flag << 6
    v |= this.constraint_set2_flag << 5
    v |= this.constraint_set3_flag << 4
    v |= this.constraint_set4_flag << 3
    v |= this.constraint_set5_flag << 1
    return v
  }

  /**
   * getter for the MIME type encoded in this avcC
   * @returns {string}
   */
  get MIME () {
    const f = []
    f.push('avc1.')
    f.push(AvcC.byte2hex(this.profile_idc).toUpperCase())
    f.push(AvcC.byte2hex(this.profile_compatibility).toUpperCase())
    f.push(AvcC.byte2hex(this.level_idc).toUpperCase())
    return f.join('')
  }
}

export class PPS {
  constructor (NALU) {
    const bitstream = new Bitstream(NALU)

    const forbidden_zero_bit = bitstream.u_1()
    if (forbidden_zero_bit) throw new Error('NALU error: invalid NALU header')
    this.nal_ref_id = bitstream.u_2()
    this.nal_unit_type = bitstream.u(5)
    if (this.nal_unit_type !== 8) throw new Error('PPS error: not PPS')
    this.pic_parameter_set_id = bitstream.ue_v()
    this.seq_parameter_set_id = bitstream.ue_v()
    this.entropy_coding_mode_flag = bitstream.u_1()
    this.entropyCodingMode = this.entropy_coding_mode_flag ? 'CABAC' : 'CAVLC'
    this.bottom_field_pic_order_in_frame_present_flag = bitstream.u_1()
    this.num_slice_groups_minus1 = bitstream.ue_v()
    this.numSliceGroups = this.num_slice_groups_minus1 + 1
    if (this.num_slice_groups_minus1 > 0) {
      this.slice_group_map_type = bitstream.ue_v()
      switch (this.slice_group_map_type) {
        case 0:
          this.run_length_minus1 = []
          for (let i = 0; i <= this.num_slice_groups_minus1; i++) {
            this.run_length_minus1.push(bitstream.ue_v())
          }
          break
        case 1: /* there is no case 1 */
          break
        case 2:
          this.top_left = []
          this.bottom_right = []
          for (let i = 0; i <= this.num_slice_groups_minus1; i++) {
            const topLeft = bitstream.ue_v()
            const bottomRight = bitstream.ue_v()
            if (topLeft > bottomRight)
              throw new Error('PPS error: bottom_right less than top_left when slice_group_map is 2')
            this.top_left.push(topLeft)
            this.bottom_right.push(bottomRight)
          }
          break
        case 3:
        case 4:
        case 5:
          if (this.num_slice_groups_minus1 !== 1)
            throw new Error('PPS error: num_slice_groups_minus1 must be 1 when slice_group_map is 3,4,5')
          this.slice_group_change_direction_flag = bitstream.u_1()
          this.slice_group_change_rate_minus1 = bitstream.ue_v()
          break
        case 6:
          if (this.num_slice_groups_minus1 + 1 > 4) {
            this.numberBitsPerSliceGroupId = 3
          } else if (this.num_slice_groups_minus1 + 1 > 2) {
            this.numberBitsPerSliceGroupId = 2
          } else {
            this.numberBitsPerSliceGroupId = 1
          }
          this.pic_size_in_map_units_minus1 = bitstream.ue_v()
          this.slice_group_id = []
          for (let i = 0; i <= this.pic_size_in_map_units_minus1; i++) {
            const sliceGroupId = bitstream.u(this.numberBitsPerSliceGroupId)
            if (sliceGroupId > this.num_slice_groups_minus1)
              throw new Error('PPS error: slice_group_id must not be greater than num_slice_groups_minus1 when slice_group_map is 6')
            this.slice_group_id.push(sliceGroupId)
          }
          break
      }
    }
    this.num_ref_idx_l0_active_minus1 = bitstream.ue_v()
    if (this.num_ref_idx_l0_active_minus1 > 31)
      throw new Error('PPS error: num_ref_idx_l0_active_minus1 may not be greater than 31')
    this.num_ref_idx_l1_active_minus1 = bitstream.ue_v()
    if (this.num_ref_idx_l1_active_minus1 > 31)
      throw new Error('PPS error: num_ref_idx_l1_active_minus1 may not be greater than 31')
    this.weighted_pred_flag = bitstream.u_1()
    this.weighted_bipred_idc = bitstream.u_2()
    this.pic_init_qp_minus26 = bitstream.se_v()
    if (this.pic_init_qp_minus26 > 25)
      throw new Error('PPS error: pic_init_qp_minus26 may not be greater than 25')
    this.pic_init_qs_minus26 = bitstream.se_v()
    if (this.pic_init_qs_minus26 > 25)
      throw new Error('PPS error: pic_init_qs_minus26 may not be greater than 25')
    this.deblocking_filter_control_present_flag = bitstream.u_1()
    this.constrained_intra_pred_flag = bitstream.u_1()
    this.redundant_pic_cnt_present_flag = bitstream.u_1()

    this.success = true
  }
}

/**
 * Tools for handling H.264 bitstream issues.
 */
export class Bitstream {
  /**
   * Construct a bitstream
   * @param stream  Buffer containing the stream, or length in bits
   */
  constructor (stream) {
    this.ptr = 0
    if (typeof stream === 'number') {
      this.buffer = new Uint8Array((stream + 7) >> 3)
      this.originalByteLength = this.buffer.byteLength
      this.max = stream
    } else if (typeof stream === 'undefined') {
      this.buffer = new Uint8Array(8192)
      this.originalByteLength = this.buffer.byteLength
      this.max = 8192 << 3
    } else {
      const buf = new Uint8Array(stream, 0, stream.byteLength)
      this.originalByteLength = buf.byteLength
      this.deemulated = this.hasEmulationPrevention(buf)
      this.buffer = this.deemulated ? this.deemulate(buf) : stream
      this.max = (this.buffer.byteLength << 3)
    }
  }

  /**
   * utility  / debugging function to examine next 16 bits of stream
   * @returns {string} Remaining unconsumed bits in the stream
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
        bits.forEach(bit => { bitstring += (bit === 0) ? '0' : '1' })
        bitstrings.push(bitstring)
        bits.length = 0
        nibble = 0
      }
    }
    return bitstrings.join(' ') + ' ' + hexstrings.join('')
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

  get stream () {
    return this.deemulated ? this.reemulate(this.buffer) : this.buffer
  }

  /**
   * add emulation prevention bytes
   * @param {Uint8Array} buf
   * @returns {Uint8Array}
   */
  reemulate (buf) {
    const size = Math.floor(this.originalByteLength * 1.2)
    const stream = new Uint8Array(size)
    const len = buf.byteLength - 1
    let q = 0
    let p = 0
    stream[p++] = buf[q++]
    stream[p++] = buf[q++]
    while (q < len) {
      if (buf[q - 2] === 0 && buf[q - 1] === 0 && buf[q] <= 3) {
        stream[p++] = 3
        stream[p++] = buf[q++]
      }
      stream[p++] = buf[q++]
    }
    stream[p++] = buf[q++]
    return stream.subarray(0, p)
  }

  hasEmulationPrevention (stream) {
    /* maybe no need to remove emulation protection? scan for 00 00 */
    for (let i = 1; i < stream.byteLength; i++) {
      if (stream[i - 1] === 0 && stream[i] === 0) {
        return true
      }
    }
    return false
  }
  /**
   * remove the emulation prevention bytes
   * @param {Uint8Array} stream
   * @returns {Uint8Array}
   */
  deemulate (stream) {
    const buf = new Uint8Array(stream.byteLength)
    let p = 0
    let q = 0
    const len = stream.byteLength - 1
    buf[q++] = stream[p++]
    buf[q++] = stream[p++]
    /* remove emulation prevention:  00 00 03 00  means 00 00 00, 00 00 03 01 means 00 00 01 */
    while (p < len) {
      if (stream[p - 2] === 0 && stream[p - 1] === 0 && stream[p] === 3 && stream[p] <= 3) p++
      else buf[q++] = stream[p++]
    }
    buf[q++] = stream[p++]
    return buf.subarray(0, q)
  }

  copyBits (from, ptr, count) {
    this.deemulated = from.deemulated
    if (this.ptr + count > this.max) {
      /* reallocate, exponential length growth */
      const newSize = Math.floor((this.max + count) * 1.25)
      const newBuf = new Uint8Array((newSize + 7) >>> 3)
      this.max = newSize
      newBuf.set(this.buffer)
    }
    const savedFromPtr = from.ptr
    from.ptr = ptr
    for (let i = 0; i < count; i++) {
      /* TODO slow */
      const b = from.u_1()
      this.put_1(b)
    }
    from.ptr = savedFromPtr
  }

  /**
   * put one bit
   */
  put_1 (b) {
    if (this.ptr + 1 > this.max) throw new Error('NALUStream error: bitstream exhausted')
    const p = (this.ptr >> 3)
    const o = 0x07 - (this.ptr & 0x07)
    const val = b << o
    const mask = ~(1 << o)
    this.buffer[p] = (this.buffer[p] & mask) | val
    this.ptr++
    return val
  }

  /**
   * get one bit
   * @returns {number}
   */
  u_1 () {
    if (this.ptr + 1 > this.max)
      throw new Error('NALUStream error: bitstream exhausted')
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
    if (this.ptr + n >= this.max) throw new Error('NALUStream error: bitstream exhausted')
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
    if (this.ptr + 8 >= this.max) throw new Error('NALUStream error: bitstream exhausted')
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
export class AvcC {
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
    /* instance props */
    this.strict = true
    this.sps = []
    this.pps = []
    this.spsDecoded = {}
    this.ppsDecoded = {}
    this.configurationVersion = 1
    this.profileIndication = 0xff
    this.profileCompatibility = 0xff
    this.avcLevelIndication = 0xff
    this.boxSizeMinusOne = 3
    this.cacheAvcC = null
    this.extradata = null

    if (typeof options.strict === 'boolean') this.strict = options.strict
    if (typeof options.strictLength === 'boolean') this.strictLength = options.strictLength
    /* construct avcC from NALU stream */
    let stream
    if (options.bitstream || options.naluStream) {
      stream = options.naluStream ? options.naluStream : new NALUStream(options.bitstream, options)
      this.boxSizeMinusOne = stream.boxSizeMinusOne
      for (const nalu of stream) {
        let pps
        let sps
        switch (nalu[0] & 0x1f) {
          case 7:
            sps = this.unpackSps(nalu)
            this.spsDecoded[sps.seq_parameter_set_id] = sps
            this.sps.push(nalu)
            break
          case 8:
            pps = this.unpackPps(nalu)
            this.ppsDecoded[pps.pic_parameter_set_id] = pps
            this.pps.push(nalu)
            break
        }
        if (this.pps.length > 0 && this.sps.length > 0) return
      }
      if (this.strict) throw new Error('avcC error: bitstream must contain both SPS and PPS')
    } else if (options.sps && options.pps) {
      /* construct avcC from sps and pps */
      const sps = this.unpackSps(options.sps)
      this.sps.push(options.sps)
      this.spsDecoded[sps.seq_parameter_set_id] = sps
      const pps = this.unpackPps(options.pps)
      this.pps.push(options.pps)
      this.ppsDecoded[pps.pic_parameter_set_id] = pps
    } else if (options.avcC) {
      /* construct it from avcC stream */
      this.cacheAvcC = options.avcC
      this.parseAvcC(options.avcC)
    }
    if (profileNames[this.profileIndication]) {
      this.profileName = profileNames[this.profileIndication]
    } else {
      throw new Error('avcC error: invalid profileIndication')
    }
  }

  /**
   * getter for the avcC object
   * @returns {Uint8Array}
   */
  get avcC () {
    this.cacheAvcC = this.packAvcC()
    return this.cacheAvcC
  }

  /**
   * setter for the avcC object
   * @param {Uint8Array} avcC
   */
  set avcC (avcC) {
    this.cacheAvcC = avcC
    this.parseAvcC(this.cacheAvcC)
  }

  get hex () {
    return NALUStream.array2hex(this.cacheAvcC)
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

  /**
   * put NALU data (sps or pps) into output buffer
   * @param {Uint8Array} buf buffer
   * @param p {integer} pointer to buf
   * @param nalus {array}  sps[] or pps[]
   * @param mask {integer} mask for setting bits in nalu-count field
   * @returns {integer} updated pointer.
   */
  static appendNALUs (buf, p, nalus, mask) {
    const setBits = ~mask
    if (this.strict && (nalus.length <= 0 || nalus.length > mask))
      throw new Error('avcC error: too many or not enough NALUs: ' + nalus.length)
    buf[p++] = (setBits | (nalus.length & mask))
    for (let nalui = 0; nalui < nalus.length; nalui++) {
      const nalu = nalus[nalui]
      const len = nalu.byteLength
      if (this.strict && (len <= 0 || len > 0xffff))
        throw new Error('avcC error: NALU has wrong length: ' + len)
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

  parseAvcC (inbuff) {
    const buf = new Uint8Array(inbuff, 0, inbuff.byteLength)
    const buflen = buf.byteLength
    if (buflen < 10) throw new Error('avcC error: object too short')
    let ptr = 0
    this.configurationVersion = buf[ptr++]
    if (this.strict && this.configurationVersion !== 1)
      throw new Error(`avcC error: configuration version must be 1: ${this.configurationVersion}`)
    this.profileIndication = buf[ptr++]
    this.profileCompatibility = buf[ptr++]
    this.avcLevelIndication = buf[ptr++]
    this.boxSizeMinusOne = buf[ptr++] & 3
    let nalen = buf[ptr++] & 0x1f
    ptr = this.captureNALUs(buf, ptr, nalen, this.sps)
    nalen = buf[ptr++]
    ptr = this.captureNALUs(buf, ptr, nalen, this.pps)
    if (ptr < buflen) this.extradata = buf.subarray(ptr, buflen)
    return inbuff
  }

  captureNALUs (buf, ptr, count, nalus) {
    nalus.length = 0
    if (this.strict && count <= 0)
      throw new Error('avcC error: at least one NALU is required')
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

  unpackSps (spsData) {
    const sps = new SPS(spsData)
    this.profileIndication = sps.profile_idc
    this.profileCompatibility = sps.profile_compatibility
    this.avcLevelIndication = sps.level_idc
    if (sps.cropRect) this.cropRect = sps.cropRect
    if (sps.picWidth) this.picWidth = sps.picWidth
    if (sps.picHeight) this.picHeight = sps.picHeight
    if (sps.framesPerSecond) this.framesPerSecond = sps.framesPerSecond
    return sps
  }

  unpackPps (ppsData) {
    const pps = new PPS(ppsData)
    this.interlaced = pps.interlaced
    this.entropyCodingMode = pps.entropyCodingMode
    return pps
  }

  /**
   * pack the avcC atom bitstream from the information in the class
   * @returns {Uint8Array}
   */
  packAvcC () {
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
      throw new Error('avcC error: bad boxSizeMinusOne value: ' + this.boxSizeMinusOne)
    buf[p++] = (0xfc | (0x03 & this.boxSizeMinusOne))
    p = AvcC.appendNALUs(buf, p, this.sps, 0x1f)
    p = AvcC.appendNALUs(buf, p, this.pps, 0xff)
    if (p < length) buf.set(this.extradata, p)
    return buf
  }
}

/**
 * process buffers full of NALU streams
 */
export class NALUStream {
  /**
   * Construct a NALUStream from a buffer, figuring out what kind of stream it
   * is when the options are omitted.
   * @param {Uint8Array} buf buffer with a sequence of one or more NALUs
   * @param options strict, boxSize, boxSizeMinusOne, type='packet' or 'annexB',
   */
  constructor (buf, options) {
    this.validTypes = new Set(['packet', 'annexB', 'unknown'])
    this.strict = false
    this.type = null
    this.buf = null
    this.boxSize = null
    this.cursor = 0
    this.nextPacket = undefined

    if (options) {
      if (typeof options.strict === 'boolean') this.strict = Boolean(options.strict)
      if (options.boxSizeMinusOne) this.boxSize = options.boxSizeMinusOne + 1
      if (options.boxSize) this.boxSize = options.boxSize
      if (options.type) this.type = options.type
      if (this.type && !this.validTypes.has(this.type))
        throw new Error('NALUStream error: type must be packet or annexB')
    }

    if (this.strict & this.boxSize && (this.boxSize < 2 || this.boxSize > 6))
      throw new Error('NALUStream error: invalid boxSize')

    /* don't copy this.buf from input, just project it */
    this.buf = new Uint8Array(buf, 0, buf.length)

    if (!this.type || !this.boxSize) {
      const { type, boxSize } = this.getType(4)
      this.type = type
      this.boxSize = boxSize
    }
    this.nextPacket = this.type === 'packet'
      ? this.nextLengthCountedPacket
      : this.nextAnnexBPacket
  }

  get boxSizeMinusOne () {
    return this.boxSize - 1
  }

  /**
   * getter for number of NALUs in the stream
   * @returns {number}
   */
  get packetCount () {
    return this.iterate()
  }

  /**
   * Returns an array of NALUs
   * NOTE WELL: this yields subarrays of the NALUs in the stream, not copies.
   * so changing the NALU contents also changes the stream. Beware.
   * @returns {[]}
   */
  get packets () {
    const pkts = []
    this.iterate((buf, first, last) => {
      const pkt = buf.subarray(first, last)
      pkts.push(pkt)
    })
    return pkts
  }

  /**
   * read an n-byte unsigned number
   * @param buff
   * @param ptr
   * @param boxSize
   * @returns {number}
   */
  static readUIntNBE (buff, ptr, boxSize) {
    if (!boxSize) throw new Error('readUIntNBE error: need a boxsize')
    let result = 0 | 0
    for (let i = ptr; i < ptr + boxSize; i++) {
      result = ((result << 8) | buff[i])
    }
    return result
  }

  static array2hex (array) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(array, 0, array.byteLength), x => ('00' + x.toString(16)).slice(-2)).join(' ')
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
        if (this.type === 'unknown' ||
          this.boxSize < 1 ||
          delim.n < 0)
          return { value: undefined, done: true }
        delim = this.nextPacket(this.buf, delim.n, this.boxSize)
        while (true) {
          if (delim.e > delim.s) {
            const pkt = this.buf.subarray(delim.s, delim.e)
            return { value: pkt, done: false }
          }
          if (delim.n < 0) break
          delim = this.nextPacket(this.buf, delim.n, this.boxSize)
        }
        return { value: undefined, done: true }
      }
    }
  }

  /**
   * Iterator allowing
   *      for (const n of stream.nalus()) {
   *        const {rawNalu, nalu} = n
   *       }
   * Yields, space-efficiently, the elements of the stream
   * NOTE WELL: this yields subarrays of the NALUs in the stream, not copies.
   * so changing the NALU contents also changes the stream. Beware.
   * @returns {{next: next}}
   */
  nalus () {
    return {
      [Symbol.iterator]: () => {
        let delim = { n: 0, s: 0, e: 0 }
        return {
          next: () => {
            if (this.type === 'unknown' ||
              this.boxSize < 1 ||
              delim.n < 0)
              return { value: undefined, done: true }
            delim = this.nextPacket(this.buf, delim.n, this.boxSize)
            while (true) {
              if (delim.e > delim.s) {
                const nalu = this.buf.subarray(delim.s, delim.e)
                const rawNalu = this.buf.subarray(delim.s - this.boxSize, delim.e)
                return { value: { nalu, rawNalu }, done: false }
              }
              if (delim.n < 0) break
              delim = this.nextPacket(this.buf, delim.n, this.boxSize)
            }
            return { value: undefined, done: true }
          }
        }
      }
    }
  }

  /**
   * Convert an annexB stream to a packet stream in place, overwriting the buffer
   * @returns {NALUStream}
   */
  convertToPacket () {
    if (this.type === 'packet') return this
    /* change 00 00 00 01 delimiters to packet lengths */
    if (this.type === 'annexB' && this.boxSize === 4) {
      this.iterate((buff, first, last) => {
        let p = first - 4
        if (p < 0) throw new Error('NALUStream error: Unexpected packet format')
        const len = last - first
        buff[p++] = 0xff & (len >> 24)
        buff[p++] = 0xff & (len >> 16)
        buff[p++] = 0xff & (len >> 8)
        buff[p++] = 0xff & len
      })
    } else if (this.type === 'annexB' && this.boxSize === 3) {
      /* change 00 00 01 delimiters to packet lengths */
      this.iterate((buff, first, last) => {
        let p = first - 3
        if (p < 0) throw new Error('Unexpected packet format')
        const len = last - first
        if (this.strict && (0xff & (len >> 24) !== 0))
          throw new Error('NALUStream error: Packet too long to store length when boxLenMinusOne is 2')
        buff[p++] = 0xff & (len >> 16)
        buff[p++] = 0xff & (len >> 8)
        buff[p++] = 0xff & len
      })
    }
    this.type = 'packet'
    this.nextPacket = this.nextLengthCountedPacket

    return this
  }

  iterate (callback) {
    if (this.type === 'unknown') return 0
    if (this.boxSize < 1) return 0
    let packetCount = 0
    let delim = this.nextPacket(this.buf, 0, this.boxSize)
    while (true) {
      if (delim.e > delim.s) {
        packetCount++
        if (typeof callback === 'function') callback(this.buf, delim.s, delim.e)
      }
      if (delim.n < 0) break
      delim = this.nextPacket(this.buf, delim.n, this.boxSize)
    }
    return packetCount
  }

  /**
   * iterator helper for delimited streams either 00 00 01  or 00 00 00 01
   * @param buf
   * @param p
   * @returns {{s: *, e: *, n: *}|{s: *, e: *, n: number}|{s: *, e: ((string: (string | NodeJS.ArrayBufferView | ArrayBuffer | SharedArrayBuffer), encoding?: BufferEncoding) => number) | number, n: number}}
   */
  nextAnnexBPacket (buf, p) {
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
  nextLengthCountedPacket (buf, p, boxSize) {
    const buflen = buf.byteLength
    if (p < buflen) {
      const plength = NALUStream.readUIntNBE(buf, p, boxSize)
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
  getType (scanLimit) {
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
      let delim = this.nextLengthCountedPacket(this.buf, 0, boxSize)
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
        delim = this.nextLengthCountedPacket(this.buf, delim.n, boxSize)
      }
      if (packetCount > 0) {
        return { type: 'packet', boxSize: boxSize }
      }
    }
    if (this.strict) throw new Error('NALUStream error: cannot determine stream type or box size')
    return { type: 'unknown', boxSize: -1 }
  }
}
