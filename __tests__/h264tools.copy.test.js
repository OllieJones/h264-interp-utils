import { expect, test } from '@jest/globals'

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

test('insert and retrieve by eight bits', () => {
  const target = new h264tools.RawBitstream(1024)
  target.put_u8(0x33)
  target.put_u(0xff, 1)
  target.put_u(0x34, 8)
  target.put_u(0xff, 2)
  target.put_u8(0x35)
  target.put_u(0xff, 3)
  target.put_u(0x36, 8)
  target.put_ue_v(129)

  target.put_u(0xff, 4)
  target.put_u(0x37, 8)

  target.put_u(0xff, 5)
  target.put_u(0x38, 8)

  target.put_u(0xff, 6)
  target.put_u8(0x39)

  target.put_u(0xff, 7)
  target.put_u(0x3a, 8)

  target.put_u(0xff, 8)

  target.seek(0)
  expect(target.u(8)).toEqual(0x33)
  target.u_1()
  expect(target.u(8)).toEqual(0x34)
  target.u_2()
  expect(target.u(8)).toEqual(0x35)
  target.u_3()
  expect(target.u(8)).toEqual(0x36)
  expect(target.ue_v()).toEqual(129)
  target.u(4)
  expect(target.u(8)).toEqual(0x37)
  target.u(5)
  expect(target.u(8)).toEqual(0x38)
  target.u(6)
  expect(target.u(8)).toEqual(0x39)
  target.u(7)
  expect(target.u(8)).toEqual(0x3a)
  expect(target.u(8)).toEqual(0xff)
})
test('insert, copy segmented, retrieve by eight bits', () => {
  const source = new h264tools.RawBitstream(1024)
  source.put_u8(0x33)
  source.put_u(0xff, 1)
  source.put_u(0x34, 8)
  source.put_u(0xff, 2)
  source.put_u8(0x35)
  source.put_u(0xff, 3)
  source.put_u(0x36, 8)
  source.put_ue_v(129)
  source.put_u(0xff, 4)
  source.put_u(0x37, 8)

  source.put_u(0xff, 5)
  source.put_u(0x38, 8)

  source.put_u(0xff, 6)
  source.put_u8(0x39)

  source.put_u(0xff, 7)
  source.put_u(0x3a, 8)

  source.put_u(0xff, 8)
  const sourceLen = source.put_complete()

  const copy = new h264tools.RawBitstream(sourceLen)
  copy.copyBits(source, 0, 3)
  copy.copyBits(source, 3, sourceLen - 3)
  copy.seek(0)
  expect(copy.u(8)).toEqual(0x33)
  copy.u_1()
  expect(copy.u(8)).toEqual(0x34)
  copy.u_2()
  expect(copy.u(8)).toEqual(0x35)
  copy.u_3()
  expect(copy.u(8)).toEqual(0x36)
  expect(copy.ue_v()).toEqual(129)
  copy.u(4)
  expect(copy.u(8)).toEqual(0x37)
  copy.u(5)
  expect(copy.u(8)).toEqual(0x38)
  copy.u(6)
  expect(copy.u(8)).toEqual(0x39)
  copy.u(7)
  expect(copy.u(8)).toEqual(0x3a)
  expect(copy.u(8)).toEqual(0xff)
})
test('insert, copy removing some values, retrieve by eight bits', () => {
  const source = new h264tools.RawBitstream(1024)
  source.put_u8(0x33)
  source.put_u(0xff, 1)
  source.put_u(0x34, 8)
  source.put_u(0xff, 2)
  source.put_u8(0x35)

  const removeStart = source.ptr
  source.put_u(0xff, 3)
  source.put_u(0x36, 8)
  source.put_ue_v(129)

  const removeEnd = source.ptr
  source.put_u(0xff, 4)
  source.put_u(0x37, 8)

  source.put_u(0xff, 5)
  source.put_u(0x38, 8)

  source.put_u(0xff, 6)
  source.put_u8(0x39)

  source.put_u(0xff, 7)
  source.put_u(0x3a, 8)

  source.put_u(0xff, 8)

  const copy = new h264tools.RawBitstream(1024)
  copy.copyBits(source, 0, 1)
  copy.copyBits(source, 1, removeStart - 1)
  copy.copyBits(source, removeEnd, source.ptr - removeEnd)
  copy.seek(0)
  expect(copy.u(8)).toEqual(0x33)
  copy.u_1()
  expect(copy.u(8)).toEqual(0x34)
  copy.u_2()
  expect(copy.u(8)).toEqual(0x35)

  // removed
  // copy.u_3()
  // expect(copy.u(8)).toEqual(0x36)
  // expect(copy.ue_v()).toEqual(129)

  copy.u(4)
  expect(copy.u(8)).toEqual(0x37)
  copy.u(5)
  expect(copy.u(8)).toEqual(0x38)
  copy.u(6)
  expect(copy.u(8)).toEqual(0x39)
  copy.u(7)
  expect(copy.u(8)).toEqual(0x3a)
  expect(copy.u(8)).toEqual(0xff)
})

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
