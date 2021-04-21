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

test('copy bits from one to another', () => {
  const source = new h264tools.Bitstream(nalu)
  const target = new h264tools.Bitstream(source.remaining)
  target.copyBits(source, 0, source.remaining)

  expect(source.buffer).toEqual(deemNalu)
  expect(target.buffer).toEqual(deemNalu)
  const sourceS = source.stream
  expect(sourceS).toEqual(nalu)
  const targetS = target.stream
  expect(targetS).toEqual(nalu)
})

test('copy bits from one to another, multiple chunks', () => {
  const source = new h264tools.Bitstream(nalu2)
  const target = new h264tools.Bitstream(source.remaining)

  const breakpoint = Math.floor(source.remaining / 2)
  target.copyBits(source, 0, breakpoint)
  target.copyBits(source, breakpoint, source.remaining - breakpoint)

  expect(source.buffer).toEqual(deemNalu2)
  expect(target.buffer).toEqual(deemNalu2)
  const sourceS = source.stream
  expect(sourceS).toEqual(nalu2)
  const targetS = target.stream
  expect(targetS).toEqual(nalu2)
})
