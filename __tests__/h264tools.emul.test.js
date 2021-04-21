import { test, expect } from '@jest/globals'

const h264tools = require('../index.js')

const nalu = new Uint8Array([
  1, 2,
  0, 0, 3, /* emulation preventer */
  0, 4,
  0, 0, 3, /* emulation preventer */
  0, 5,
  11, 12, 13,
  14, 15,
  0, 0])

const deemNalu = new Uint8Array([
  1, 2,
  0, 0, /* emulation preventer */
  0, 4,
  0, 0, /* emulation preventer */
  0, 5,
  11, 12, 13,
  14, 15,
  0, 0])

const nalu2 = new Uint8Array([
  39, 100, 0, 40, 172, 43, 64, 176, 75, 66,
  0, 0, 3, 0,
  2,
  0, 0, 3, 0,
  121, 193, 64, 7,
  161,
  0, 0, 190,
  188, 222, 247, 0, 241, 34, 106
])
const deemNalu2 = new Uint8Array([
  39, 100, 0, 40, 172, 43, 64, 176, 75, 66,
  0, 0, 0,
  2,
  0, 0, 0,
  121, 193, 64, 7,
  161,
  0, 0, 190,
  188, 222, 247, 0, 241, 34, 106
])

test('emulation prevention bytes removal and replacement 1', () => {
  const s = new h264tools.Bitstream(nalu)
  expect(s.buffer).toEqual(deemNalu)
  const x = s.stream
  expect(x).toEqual(nalu)
  expect(x.byteLength).toEqual(nalu.byteLength)
})

test('emulation prevention bytes removal and replacement 2', () => {
  const s = new h264tools.Bitstream(nalu2)
  expect(s.buffer).toEqual(deemNalu2)
  const x = s.stream
  expect(x).toEqual(nalu2)
  expect(x.byteLength).toEqual(nalu2.byteLength)
})

test('emulation prevention bytes removal and replacement 3', () => {
  /* without correct emulation handling this SPS won't parse correctly */
  const s = new h264tools.SPS(nalu2)
  expect(s.seq_parameter_set_id).toEqual(0)
  expect(s.picWidth).toEqual(352)
  expect(s.picHeight).toEqual(288)
  expect(s.framesPerSecond).toEqual(60)
  expect(s.buffer).toEqual(deemNalu2)
  expect(s.stream).toEqual(nalu2)
})
