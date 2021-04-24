import { expect, test } from '@jest/globals'
import { AvcC, NALUStream, PPS, Slice, SPS } from '../index'

const fs = require('fs')
const path = require('path')

const filename1 = path.join(__dirname, '/__data__/chrome-qcif.h264')
const outdir = path.join(__dirname, '/__big_data__')
const outfile = path.join(outdir, '/tests.log')

const fileStream = fs.createWriteStream(outfile)
test('capture some reasonable test vectors', () => {
  if (fs.existsSync(outdir) && fs.existsSync(filename1)) {
    const buf = fs.readFileSync(filename1, null)
    const s = new NALUStream(buf)
    let sliceCount = 0
    let sps
    let pps
    let avcC
    const naluLengths = {}
    for (const naluBitstream of s) {
      let item
      const lineitem = []
      const bucket = naluBitstream.byteLength & ~0x0f
      if (!naluLengths[bucket]) naluLengths[bucket] = 0
      naluLengths[bucket]++
      const naluType = naluBitstream[0] & 0x1f
      switch (naluType) {
        case 7: /* sps */
          item = new SPS(naluBitstream)
          sps = naluBitstream
          lineitem.push('t: "SPS"')
          lineitem.push('s:' + item.seq_parameter_set_id)
          lineitem.push('p:null')
          break
        case 8: /* pps */
          item = new PPS(naluBitstream)
          pps = naluBitstream
          lineitem.push('t: "PPS"')
          lineitem.push('s:' + item.seq_parameter_set_id)
          lineitem.push('p:' + item.pic_parameter_set_id)
          break
        case 5: /* i frame slice */
        case 1: /* p frame slice */
          item = new Slice(naluBitstream)
          lineitem.push(naluType === 5 ? 't: "ISL"' : 't: "PSL"')
          lineitem.push('s:null')
          lineitem.push('p:' + item.pic_parameter_set_id)
          sliceCount++
          break
      }
      if (!avcC && sps && pps) {
        avcC = new AvcC({ sps, pps })
        expect(avcC.picWidth).toEqual(176)
        expect(avcC.picHeight).toEqual(144)
        expect(avcC.MIME).toEqual('avc1.42C00C')
        sps = undefined
        pps = undefined
      }
      lineitem.unshift('l:' + naluBitstream.byteLength.toString().padStart(4, ' '))
      lineitem.push('d:[' + buf2hex(naluBitstream) + ']')
      const line = '{' + lineitem.join(',') + '},\n'
      fileStream.write(line)
    }
    expect(sliceCount).toEqual(2444)
  }
})

function buf2hex (buffer) { // buffer is an ArrayBuffer
  return [...new Uint8Array(buffer)]
    .map(x => '0x' + x.toString(16).padStart(2, '0')).join(',')
}
