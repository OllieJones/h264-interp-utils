import { expect, test } from '@jest/globals'
import { AvcC, NALUStream, PPS, Slice, SPS } from '../index'

const fs = require('fs')
const path = require('path')

const filename1 = path.join(__dirname, '/__data__/video-qcif-100.h264')
/* this file does not go into the repo, too big. */
const filename2 = path.join(__dirname, '/__big_data__/video-1088p.h264')

const iframeSliceTypes = new Set([2, 4, 7, 9])

test('parse long raspivid and look for pps data', () => {
  if (fs.existsSync(filename2)) {
    const buf = fs.readFileSync(filename2, null)
    const s = new NALUStream(buf)
    let iFrameCount = 0
    let pFrameCount = 0
    let frameCount = 0
    const nalusByType = new Map()
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
          expect(sps).toBeUndefined()
          item = new SPS(naluBitstream)
          sps = naluBitstream
          break
        case 8: /* pps */
          expect(pps).toBeUndefined()
          item = new PPS(naluBitstream)
          pps = naluBitstream
          break
        case 5: /* i frame slice */
          expect(avcC).toBeDefined()
          item = new Slice(naluBitstream, avcC)
          expect(item.pic_parameter_set_id).toEqual(0)
          expect(item.frame_num).toBeDefined()
          expect(iframeSliceTypes.has(item.slice_type)).toBeTruthy()
          iFrameCount++
          frameCount++
          break
        case 1: /* p frame slice */
          expect(avcC).toBeDefined()
          item = new Slice(naluBitstream, avcC)
          expect(item.pic_parameter_set_id).toEqual(0)
          expect(item.frame_num).toBeDefined()
          pFrameCount++
          frameCount++
          break
      }
      if (!avcC && sps && pps) {
        avcC = new AvcC({ sps, pps })
        expect(avcC.picWidth).toEqual(1920)
        expect(avcC.picHeight).toEqual(1088)
        expect(avcC.MIME).toEqual('avc1.640028')
      }
    }
    expect(iFrameCount).toEqual(2)
    expect(pFrameCount).toEqual(83)
    expect(frameCount).toEqual(85)
    /* double check no unexpected nalu types */
    const expected = new Map([[1, 83], [5, 2], [7, 1], [8, 1]])
    expect(nalusByType).toEqual(expected)
  }
})

test('parse qcif raspivid and look for pps data', () => {
  if (fs.existsSync(filename1)) {
    const buf = fs.readFileSync(filename1, null)
    const s = new NALUStream(buf)
    let iFrameCount = 0
    let pFrameCount = 0
    let frameCount = 0
    const nalusByType = new Map()
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
          expect(sps).toBeUndefined()
          item = new SPS(naluBitstream)
          sps = naluBitstream
          break
        case 8: /* pps */
          expect(pps).toBeUndefined()
          item = new PPS(naluBitstream)
          pps = naluBitstream
          break
        case 5: /* i frame slice */
          expect(avcC).toBeDefined()
          item = new Slice(naluBitstream, avcC)
          expect(item.pic_parameter_set_id).toEqual(0)
          expect(item.frame_num).toBeDefined()
          expect(iframeSliceTypes.has(item.slice_type)).toBeTruthy()
          iFrameCount++
          frameCount++
          break
        case 1: /* p frame slice */
          expect(avcC).toBeDefined()
          item = new Slice(naluBitstream, avcC)
          expect(item.pic_parameter_set_id).toEqual(0)
          expect(item.frame_num).toBeDefined()
          pFrameCount++
          frameCount++
          break
      }
      if (!avcC && sps && pps) {
        avcC = new AvcC({ sps, pps })
        expect(avcC.picWidth).toEqual(176)
        expect(avcC.picHeight).toEqual(144)
        expect(avcC.MIME).toEqual('avc1.640028')
      }
    }
    expect(iFrameCount).toEqual(5)
    expect(pFrameCount).toEqual(281)
    expect(frameCount).toEqual(286)
    /* double check no unexpected nalu types */
    const expected = new Map([[1, 281], [5, 5], [7, 1], [8, 1]])
    expect(nalusByType).toEqual(expected)
  }
})
