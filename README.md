# h264-bitstream-utils [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

H.264 bitstreams are tricky to handle. This Javascript package helps.

It handles the creation and parsing of H.264's codec-private data. This codec-private data is 
stored in `'avcC'` atoms in MPEG-4 streams, and 
in [`Tracks/Track/CodecPrivate` elements](https://www.matroska.org/technical/elements.html#codecprivate-element) 
in some [Matroska streams](https://www.matroska.org/technical/elements.html) (aka webm or EBML files). 
It is sometimes necessary to re-create this codec-private data from elements in a
compressed video bitstream.

It handles the parsing of sequences of H.264 Network Access Layer Units, formatted either in packet-transport or 
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

tk