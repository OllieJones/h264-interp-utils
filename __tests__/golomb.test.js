import { test, expect } from '@jest/globals'
import { Bitstream } from '../index.js'

test('write, then read, exp - Golomb', () => {
  const b = new Bitstream(2048)
  for (let i = 0; i < 100; i++) {
    b.put_ue_v(i)
  }
  b.ptr = 0
  for (let i = 0; i < 100; i++) {
    const v = b.ue_v()
    expect(v).toEqual(i)
  }
})

test('write, then read, exp - Golomb, forcing buffer extension', () => {
  const b = new Bitstream(128)
  for (let i = 0; i < 100; i++) {
    b.put_ue_v(i)
  }
  b.ptr = 0
  for (let i = 0; i < 100; i++) {
    const v = b.ue_v()
    expect(v).toEqual(i)
  }
})
test('write, then read, signed exp - Golomb', () => {
  const b = new Bitstream(4096)
  for (let i = 0; i < 100; i++) {
    b.put_se_v(-i)
    b.put_se_v(i)
  }
  b.ptr = 0
  for (let i = 0; i < 100; i++) {
    const n = b.se_v()
    /* negative zero !!! */
    expect(n === -i).toBeTruthy()
    const p = b.se_v()
    expect(p).toEqual(i)
  }
})

test('write, then read, signed exp - Golomb', () => {
  const b = new Bitstream(4096)
  for (let i = 0; i < 100; i++) {
    b.put_se_v(-i)
    b.put_se_v(i)
    b.put_ue_v(i)
  }
  b.ptr = 0
  for (let i = 0; i < 100; i++) {
    const n = b.se_v()
    /* negative zero !!! */
    expect(n === -i).toBeTruthy()
    const p = b.se_v()
    expect(p).toEqual(i)
    const x = b.ue_v()
    expect(x).toEqual(i)
  }
})
