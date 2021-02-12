# h264-bitstream-utils [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

H.264 bitstreams are tricky to handle. This Javascript package helps.

It handles the creation and parsing of H.264's codec-private data. This codec-private data is 
stored in `'avcC'` atoms in MPEG-4 streams, and 
in [`Tracks/Track/CodecPrivate` elements](https://www.matroska.org/technical/elements.html#codecprivate-element) 
in some [Matroska streams](https://www.matroska.org/technical/elements.html) (aka webm or EBML files). 
It is sometimes necessary to re-create this codec-private data from elements in a
compressed video bitstream.

It handles the parsing of sequences of H.264 Network Access Layer Units (NALUs), formatted either in packet-transport or 
streaming Annex B format.

It offers functions for reading H.264's variable-length Exponential Golomb codes from its bitstream.
With those functions it offers 

It handles the parsing of SPS and PPS NALUs

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save h264-bitstream-utils
```

Installation with other package managers works similarly.

## Usage

Start by including the module in your program.

```js
const h264Interp = require('h264-interp-utils')
```

### Bitstream

The Bitstream object allows its user to retrieve data bit-by-bit from arrays of data.
It's used to parse NALUs, and supports the H.264 variable-length
exponential Golomb coding for 
signed and unsigned integers.

```js
const bitstream = new h264Interp.Bitstream(array)
const aBit = bitstream.u_1()
const nextBit = bitstream.u_1()
const twoBits = bitstream.u_2()
const fiveBits = bitstream.u(5)
const aByte = bitstream.u_8()

/* variable-length integers */
const unsignedInt = bitstream.ue_v()
const signedInt = bitstream.se_v()
```

You may retrieve the number of remaining bits in your array with `const bitCount = bitstream.remaining`.
Likewise, you may retrieve the number of bits already consumed with `const bitsUsed = bitstream.consumed`.

For debugging convenience, `bitstream.peek16` shows, in a text string, the next 16 bits.

#### NALUStream

NALUStream accepts a buffer containing a sequence of NALUs.
They may be in

* packet format, separated by 4, 3, or 2-byte NALU lengths
* AnnexB stream format, separated by four-byte `00 00 00 01` or three byte `00 00 01` delimiters.

NALUStream's constructor takes an array and an options object.
The options object many contain any of these properties:

* `type`, if present, has the value `'packet'` or `'annexB'`.
Use it to declare the format of your sequence of NALUs. 
If you omit `type`, 
NALUStream attempts to determine the format by examining the first few NALUs.
Try to avoid attempting that whenever possible.

* `boxSize`, if present, can have values 4,3, or 2 for `'packet'` streams, and 4 or 3 for `'annexB'` streams.
If you omit `boxSize` NALUStream attempts to determine the boxSize by examining the first few NALUs.
Try to avoid attempting that whenever possible.

* `boxSizeMinusOne` can be provided in place of `boxSize` for compatibility with `'avcC'` atoms.

* `strict`, if true, makes NALUStream throw more errors when it detects anomalous data.


Constructing a NALUStream might look like this. It's wise to catch errors thrown by the constructor.

```js
try {
const nalus = new h264Interp.NALUStream(array, {type:'annexB', boxSize: 4, strict: true})
} catch (error) {
  console.error(error)
}
```

You may iterate over the NALUs in a NALUStream like this:

```js
for (const nalu of nalus) {                           
  /* handle each NALU */
}
```
or (somewhat less efficiently) like this:

```js
const naluArray = nalus.packets
for (let i= 0; i < naluArray.length; i++) {
  /* handle each naluArray[i] */
}
```

Some decoders (for example the VideoDecoder in WebCodecs) require their NALUs in
packet format. You can convert a NALUStream to packet format like this. Notice that it
changes the contents of the array passed in the constructor.

```js
decoder.decode(nalus.convertToPacket())
```

NALUStream objects have `type`, `boxSize`, and `boxSizeMinusOne` properties. 
If you use the constructor to guess what sort of array you gave it, 
you can retrieve its guesses with those properties.

They have the `packetCount` property indicating how many NALUs are in the array.

#### SPS

SPS accepts a Stream Parameter Set NALU, and offers properties describing it.
To construct an SPS object, give it an array containing a NALU. 
(It throws an error when you give it a NALU that's not an SPS, or that's garbled
in a way that makes it impossible to decode.)

```js
const sps = new h264Interp.SPS(nalu)
```

Some of its useful properties are:

* `MIME`: the MIME type of the video stream, a value like `'avc1.640029'`.
* `profileName`: a human-readable value like `'BASELINE'` or `'EXTENDED'` indicating the codec profile.
* `profile_idc`: the profile indicator. 66 means baseline, 77 means main, and 88 means extended.
* `profile_compatibility`: the constraints.
* `level_idc`: the level indicator for the codec level.
* `picWidth`, `picHeight`: the width and height of the pictures in the video stream.
* `cropRect`: a rectangle object with `x`, `y`, `width`, `height`. In the cases where the
pictures in the video stream have margins without imagery in them, the `cropRect` defines
the useful area. 

Because H.264 streams have sizes that are multiples of 16x16 macroblocks,
it can be necessary to crop the pictures when rendering them.

It has what can only be described as a mess of properties defined by the H.264 standard
and needed by the H.264 decoder to make sense of the stream.

#### PPS

PPS accepts a Picture Parameter Set NALU, and offers properties describing it.
To construct an PPS object, give it an array containing a NALU. 
(It throws an error when you give it a NALU that's not an PPS, or that's garbled
in a way that makes it impossible to decode.)

```js
const pps = new h264Interp.PPS(nalu)
```

Most PPS properties describe the format of the pictures in the video stream
in a format useful to the H.264 decoder.

Two of its more useful properties are:

* `entropy_coding_mode_flag`: 0 for CALVC Huffman-style entropy coding, and  1 for CABAC Arps-style arithmetic coding.
* `entropyCodingMode`: `'CAVLC'` or `'CABAC'`, a human-readable description of the entropy coding.

It has what can only be described as a mess of properties defined by the H.264 standard
and needed by the H.264 decoder to make sense of the stream.

#### AvcC

H.264 defines a set of codec-private data describing the data stream. Not all video data streams have a distinct
set of codec-private data: it's optional in Matroska / webm / .mkv video streams.

It contains, embedded in it, one or more SPS and PPS elements. It can be reconstructed by parsing an SPS and including a PPS.

The AvcC class parses and reconstructs the codec-private data.

A typical use case is, given arrays containing SPS and PPS NALUs, create an avcC object.

```js
const avcCObject = new h264Interp.AvcC({pps:ppsArray, sps:spsArray})
const mime = avcCObject.MIME
/* this is the binary array to put into the `'avcC'` atom. */
const codecPrivateDataArray = avCObject.avcC
```

Another typical use case is, given a key frame payload from a [Matroska SimpleBlock](https://www.matroska.org/technical/basics.html#simpleblock-structure), create the codec-private data.

```js
const avcCObject = new h264Interp.AvcC({bitstream: payload})
const mime = avcCObject.MIME
/* this is the binary array to put into the `'avcC'` atom. */
const codecPrivateDataArray = avCObject.avcC
```

## Still to do

* Better documentation
* Rework Bitstream and NALUStream to handle Javascript streams, not just arrays of data.


## Credits

* [Alex Izvorksi](https://github.com/aizvorski) for his [C++ h264bitstream](https://github.com/aizvorski/h264bitstream) code.

* Of course, the legions of people who created H.264. 