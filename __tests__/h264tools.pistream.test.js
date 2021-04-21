import { expect, test } from '@jest/globals'
import { AvcC, Bitstream, NALUStream, SPS, PPS, Slice } from '../index'

const fs = require('fs')
const path = require('path')

const filename = path.join(__dirname, '/__data__/video-cif-250.h264')
const buf = fs.readFileSync(filename, null)

const iframeSliceTypes = new Set([2, 4, 7, 9])

test('parse raspivid --inline --spstimings', () => {
  const s = new NALUStream(buf)
  let sps
  let pps

  for (const naluBitstream of s) {
    const naluType = naluBitstream[0] & 0x1f
    let item
    switch (naluType) {
      case 7: /* sps */
        item = new SPS(naluBitstream)
        expect(item.framesPerSecond).toEqual(60)
        expect(item.picWidth).toEqual(352)
        expect(item.picHeight).toEqual(288)
        sps = naluBitstream
        break
      case 8: /* pps */
        item = new PPS(naluBitstream)
        pps = naluBitstream
        break
    }
    if (sps && pps) {
      const avcC = new AvcC({ sps, pps })
      expect(avcC.picWidth).toEqual(352)
      expect(avcC.picHeight).toEqual(288)
      expect(avcC.MIME).toEqual('avc1.640028')
      sps = undefined
      pps = undefined
    }
  }
})

test('parse raspivid --inline --spstimings look at slices', () => {
  const s = new NALUStream(buf)
  let sps
  let spsDecoded
  let pps
  let ppsDecoded
  let avcC

  for (const naluBitstream of s) {
    const naluType = naluBitstream[0] & 0x1f
    let item
    switch (naluType) {
      case 7: /* sps */
        item = new SPS(naluBitstream)
        expect(item.framesPerSecond).toEqual(60)
        expect(item.picWidth).toEqual(352)
        expect(item.picHeight).toEqual(288)
        sps = naluBitstream
        spsDecoded = item
        break
      case 8: /* pps */
        item = new PPS(naluBitstream)
        pps = naluBitstream
        ppsDecoded = item
        break
      case 1: /* non-I-frame slice */
      case 5: /* I-frame slice */
        item = new Slice(naluBitstream, avcC)
        expect(item.nal_unit_type).toEqual(naluType)
        expect(item.first_mb_in_slice).toBeDefined()
        expect(item.frame_num).toBeDefined()
        if (naluType === 5) {
          const sliceTypeOK = iframeSliceTypes.has(item.slice_type)
          expect(sliceTypeOK).toBeTruthy()
        }
        expect(item.frame_num).toBeGreaterThanOrEqual(0)
        expect(item.frame_num).toBeLessThanOrEqual(100)
        break
    }
    if (sps && pps) {
      avcC = new AvcC({ sps, pps })
      expect(avcC.picWidth).toEqual(spsDecoded.picWidth)
      expect(avcC.picHeight).toEqual(spsDecoded.picHeight)
      expect(avcC.MIME).toEqual('avc1.640028')
      sps = undefined
      pps = undefined
    }
  }
})

test('emulation', () => {
  const s = new NALUStream(buf)

  for (const naluBitstream of s) {
    const bitstream = new Bitstream(naluBitstream)
    expect(bitstream.stream).toEqual(naluBitstream)
  }
})
