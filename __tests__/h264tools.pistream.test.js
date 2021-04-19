'use strict'

const fs = require('fs')
const path = require('path')
const h264tools = require('../index.js')

test('parse raspivid --inline --spstimings', () => {

  const filename = path.join(__dirname, '/__data__/video-cif-250.h264')
  const buf = fs.readFileSync(filename, null)
  const s = new h264tools.NALUStream(buf)
  let sps
  let pps

  for (const naluBitstream of s) {
    const naluType = naluBitstream[0] & 0x1f
    let item
    switch (naluType) {
      case 7:
        item = new h264tools.SPS(naluBitstream)
        expect(item.framesPerSecond).toEqual(60)
        expect(item.picWidth).toEqual(352)
        expect(item.picHeight).toEqual(288)
        sps = naluBitstream
        break
      case 8:
        item = new h264tools.PPS(naluBitstream)
        pps = naluBitstream
        break
    }
    if (sps && pps) {
      const avcC = new h264tools.AvcC( {sps, pps} )
      expect (avcC.picWidth) .toEqual(352)
      expect (avcC.picHeight) .toEqual(288)
      expect (avcC.MIME).toEqual('avc1.640028')
      sps = undefined
      pps = undefined
    }

  }
})
