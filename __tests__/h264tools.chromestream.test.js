import { expect, test } from '@jest/globals'
import { AvcC, NALUStream, PPS, Slice, SPS } from '../index'

const fs = require('fs')
const path = require('path')

const filename1 = path.join(__dirname, '/__data__/chrome-qcif.h264')

const iframeSliceTypes = new Set([2, 4, 7, 9])

test('parse chrome qcif', () => {
  if (fs.existsSync(filename1)) {
    const buf = fs.readFileSync(filename1, null)
    const s = new NALUStream(buf)
    let iFrameCount = 0
    let pFrameCount = 0
    let frameCount = 0
    let sliceCount = 0
    const nalusByType = new Map()
    const ppsIdLengths = new Map()
    let sps
    let pps
    let avcC
    for (const naluBitstream of s) {
      const naluType = naluBitstream[0] & 0x1f
      if (!nalusByType.has(naluType)) nalusByType.set(naluType, 0)
      nalusByType.set(naluType, nalusByType.get(naluType) + 1)
      let item
      switch (naluType) {
        case 7: /* sps */
          item = new SPS(naluBitstream)
          sps = naluBitstream
          break
        case 8: /* pps */
          item = new PPS(naluBitstream)
          pps = naluBitstream
          break
        case 5: /* i frame slice */
          expect(avcC).toBeDefined()
          item = new Slice(naluBitstream, avcC)
          if (item.first_mb_in_slice === 0) {
            iFrameCount++
            frameCount++
          }
          break
        case 1: /* p frame slice */
          expect(avcC).toBeDefined()
          item = new Slice(naluBitstream, avcC)
          if (item.first_mb_in_slice === 0) {
            pFrameCount++
            frameCount++
          }
          break
      }
      switch (naluType) {
        case 5: /* i frame slice */
        case 1: /* p frame slice */
          expect(avcC).toBeDefined()
          item = new Slice(naluBitstream, avcC)
          if (!ppsIdLengths.has(item.ppsIdLen)) ppsIdLengths.set(item.ppsIdLen, 0)
          ppsIdLengths.set(item.ppsIdLen, ppsIdLengths.get(item.ppsIdLen) + 1)
          expect(item.ppsIdLen).toBeGreaterThan(0)
          if (item.pic_parameter_set_id !== 0) {
            expect(item.ppsIdLen).toBeGreaterThanOrEqual(3)
          }
          if (typeof item.frame_num !== 'number') {
            console.log(item)
          }
          expect(item.frame_num).toBeDefined()
          sliceCount++
          break
      }
      if (sps && pps) {
        avcC = new AvcC({ sps, pps })
        expect(avcC.picWidth).toEqual(176)
        expect(avcC.picHeight).toEqual(144)
        expect(avcC.MIME).toEqual('avc1.42C00C')
        sps = undefined
        pps = undefined
      }
    }
    expect(iFrameCount).toEqual(7)
    expect(pFrameCount).toEqual(604)
    expect(frameCount).toEqual(611)
    expect(sliceCount).toEqual(2444)
    const ppsIdCount = Array.from(ppsIdLengths.values()).reduce((a, c) => { return (a += c) })
    expect(ppsIdCount).toEqual(sliceCount)
    /* double check no unexpected nalu types */
    const expected = new Map([[1, 2416], [5, 28], [7, 7], [8, 7]])
    expect(nalusByType).toEqual(expected)
  }
})

test('zero ppsids in chrome stream', () => {
  if (fs.existsSync(filename1)) {
    const buf = fs.readFileSync(filename1, null)
    const s = new NALUStream(buf)
    let sliceCount = 0
    let sps
    let pps
    let avcC
    for (const naluBitstream of s) {
      const naluType = naluBitstream[0] & 0x1f
      let item
      let fixedBitstream
      let fixed
      switch (naluType) {
        case 7: /* sps */
          item = new SPS(naluBitstream)
          sps = naluBitstream
          break
        case 8: /* pps */
          item = new PPS(naluBitstream)
          pps = naluBitstream
          break
        case 5: /* i frame slice */
        case 1: /* p frame slice */
          expect(avcC).toBeDefined()
          item = new Slice(naluBitstream, avcC, { all: 1 })
          if (item.pic_parameter_set_id !== 0) {
            expect(item.ppsIdLen).toBeGreaterThanOrEqual(3)
          }
          fixedBitstream = item.setPPSId(0)
          fixed = new Slice(fixedBitstream, avcC, { all: 1 })
          expect(fixed.ppsIdLen).toEqual(1)
          expect(fixed.frame_num).toBeDefined()
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
    }
    expect(sliceCount).toEqual(2444)
  }
})

