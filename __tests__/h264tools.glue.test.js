import { test, expect } from '@jest/globals'
const h264tools = require('../index.js')

function makeArray (str) {
  if (typeof str !== 'string') str = str.join(' ')
  return new Uint8Array(str.match(/[\da-f]{2} */gi).map(s => parseInt(s, 16)))
}

const bitstream = makeArray('00 00 00 01 09 10   00 00 00 01 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8  00 00 00 01 68 ce 38 80  00 00 00 01 06 05 2f 02 f8 61 50 fc 70 41 72 b7 32 48 f3 a7 2a 3d 34 4d 69 63 72 6f 73 6f 66 74 20 48 2e 32 36 34 20 45 6e 63 6f 64 65 72 20 56 31 2e 35 2e 33 00 80  00 00 00 01 06 05 e8 cb b2 13 92 98 73 43 da a8 a6 c7 42 98 35 6c f5 73 72 63 3a 33 20 68 3a 34 38 30 20 77 3a 36 34 30 20 66 70 73 3a 33 30 2e 30 30 30 20 70 66 3a 36 36 20 6c 76 6c 3a 38 20 62 3a 30 20 62 71 70 3a 33 20 67 6f 70 3a 36 30 20 69 64 72 3a 36 30 20 73 6c 63 3a 35 20 63 6d 70 3a 30 20 72 63 3a 31 20 71 70 3a 32 36 20 72 61 74 65 3a 32 35 30 30 30 30 20 70 65 61 6b 3a 30 20 62 75 66 66 3a 39 33 37 35 30 20 72 65 66 3a 31 20 73 72 63 68 3a 33 32 20 61 73 72 63 68 3a 31 20 73 75 62 70 3a 31 20 70 61 72 3a 36 20 33 20 33 20 72 6e 64 3a 30 20 63 61 62 61 63 3a 30 20 6c 70 3a 30 20 63 74 6e 74 3a 30 20 61 75 64 3a 31 20 6c 61 74 3a 31 20 77 72 6b 3a 31 20 76 75 69 3a 31 20 6c 79 72 3a 31 20 3c 3c 00 80')
const mime = 'avc1.42C01E'
const avcCSample = makeArray('01 42 c0 1e ff e1 00 17 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8 01 00 04 68 ce 38 80')

test('Make avcC from some appropriate NALUs', () => {
  const avcC = new h264tools.AvcC({ bitstream: bitstream })
  expect(avcC.MIME).toEqual(mime)
  expect(avcC.avcC).toEqual(avcCSample)
})

test('Make avcC from some appropriate NALUs, declaring the stream type', () => {
  const avcC = new h264tools.AvcC({ bitstream: bitstream, boxSize: 4, type: 'annexB', strict: true })
  expect(avcC.MIME).toEqual(mime)
  expect(avcC.avcC).toEqual(avcCSample)
})

test('Make avcC from some appropriate NALUs, declaring the stream type, using three-byte delimiters', () => {
  const axb3 = makeArray('00 00 01 09 10 00 00 01 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8 00 00 01 68 ce 38 80 00 00 01 06 05 2f 02 f8 61 50 fc 70 41 72 b7 32 48 f3 a7 2a 3d 34 4d 69 63 72 6f 73 6f 66 74 20 48 2e 32 36 34 20 45 6e 63 6f 64 65 72 20 56 31 2e 35 2e 33 00 80 00 00 01 06 05 e8 cb b2 13 92 98 73 43 da a8 a6 c7 42 98 35 6c f5 73 72 63 3a 33 20 68 3a 34 38 30 20 77 3a 36 34 30 20 66 70 73 3a 33 30 2e 30 30 30 20 70 66 3a 36 36 20 6c 76 6c 3a 38 20 62 3a 30 20 62 71 70 3a 33 20 67 6f 70 3a 36 30 20 69 64 72 3a 36 30 20 73 6c 63 3a 35 20 63 6d 70 3a 30 20 72 63 3a 31 20 71 70 3a 32 36 20 72 61 74 65 3a 32 35 30 30 30 30 20 70 65 61 6b 3a 30 20 62 75 66 66 3a 39 33 37 35 30 20 72 65 66 3a 31 20 73 72 63 68 3a 33 32 20 61 73 72 63 68 3a 31 20 73 75 62 70 3a 31 20 70 61 72 3a 36 20 33 20 33 20 72 6e 64 3a 30 20 63 61 62 61 63 3a 30 20 6c 70 3a 30 20 63 74 6e 74 3a 30 20 61 75 64 3a 31 20 6c 61 74 3a 31 20 77 72 6b 3a 31 20 76 75 69 3a 31 20 6c 79 72 3a 31 20 3c 3c 00 80')

  const avcC = new h264tools.AvcC({ bitstream: bitstream, boxSize: 3, type: 'annexB', strict: true })
  expect(avcC.MIME).toEqual(mime)
  expect(avcC.boxSizeMinusOne).toEqual(2)
  const sample = new h264tools.AvcC({ avcC: avcCSample })
  sample.boxSizeMinusOne = 2
  expect(avcC.avcC).toEqual(sample.avcC)
})

test('Make avcC from NALUs in a NALUStream', () => {
  const stream = new h264tools.NALUStream(bitstream)
  const avcC = new h264tools.AvcC({ naluStream: stream })
  expect(avcC.MIME).toEqual(mime)
  expect(avcC.avcC).toEqual(avcCSample)
})

test('Make avcC from NALUs in a NALUStream, declaring the stream type', () => {
  const stream = new h264tools.NALUStream(bitstream, { boxSize: 4, type: 'annexB', strict: true })
  const avcC = new h264tools.AvcC({ naluStream: stream })

  expect(avcC.MIME).toEqual(mime)
  expect(avcC.avcC).toEqual(avcCSample)
})

test('Make avcC from NALUs in a NALUStream, declaring the stream type, using three-byte delimiters', () => {
  const axb3 = makeArray('00 00 01 09 10 00 00 01 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8 00 00 01 68 ce 38 80 00 00 01 06 05 2f 02 f8 61 50 fc 70 41 72 b7 32 48 f3 a7 2a 3d 34 4d 69 63 72 6f 73 6f 66 74 20 48 2e 32 36 34 20 45 6e 63 6f 64 65 72 20 56 31 2e 35 2e 33 00 80 00 00 01 06 05 e8 cb b2 13 92 98 73 43 da a8 a6 c7 42 98 35 6c f5 73 72 63 3a 33 20 68 3a 34 38 30 20 77 3a 36 34 30 20 66 70 73 3a 33 30 2e 30 30 30 20 70 66 3a 36 36 20 6c 76 6c 3a 38 20 62 3a 30 20 62 71 70 3a 33 20 67 6f 70 3a 36 30 20 69 64 72 3a 36 30 20 73 6c 63 3a 35 20 63 6d 70 3a 30 20 72 63 3a 31 20 71 70 3a 32 36 20 72 61 74 65 3a 32 35 30 30 30 30 20 70 65 61 6b 3a 30 20 62 75 66 66 3a 39 33 37 35 30 20 72 65 66 3a 31 20 73 72 63 68 3a 33 32 20 61 73 72 63 68 3a 31 20 73 75 62 70 3a 31 20 70 61 72 3a 36 20 33 20 33 20 72 6e 64 3a 30 20 63 61 62 61 63 3a 30 20 6c 70 3a 30 20 63 74 6e 74 3a 30 20 61 75 64 3a 31 20 6c 61 74 3a 31 20 77 72 6b 3a 31 20 76 75 69 3a 31 20 6c 79 72 3a 31 20 3c 3c 00 80')

  const stream = new h264tools.NALUStream(axb3, { type: 'annexB', strict: true })
  const avcC = new h264tools.AvcC({ naluStream: stream })
  expect(avcC.MIME).toEqual(mime)
  expect(avcC.boxSizeMinusOne).toEqual(2)
  const sample = new h264tools.AvcC({ avcC: avcCSample })
  sample.boxSizeMinusOne = 2
  expect(avcC.avcC).toEqual(sample.avcC)
})
