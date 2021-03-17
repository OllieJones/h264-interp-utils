export function makeArray (str) {
  if (typeof str !== 'string') str = str.join(' ')
  return new Uint8Array(str.match(/[\da-f]{2} */gi).map(s => parseInt(s, 16)))
}

export const avccConfigs = []
let cfg

/* this has much extradata */

cfg = {
  mime: 'avc1.640029',
  avcC: makeArray(`01 64 00 29 
ff e1 00 34 27 64 00 29 
ac 3e c0 78 02 27 e5 c0 
72 00 00 27 1a 00 07 53 
01 c0 c0 00 0f bc 52 00 
00 e4 e1 d0 39 71 81 80 
00 1f 5b d4 00 01 c9 c3 
a0 72 e1 cb 08 84 51 60 
01 00 81 28 ea 80 4b ce 
55 31 cc 30 5d 26 28 d1 
24 86 87 83 a1 c0 d0 4e 
12 14 2c 0a c0 da 02 fc 
ad 35 e9 e8 50 b7 48 c7 
78 a1 41 00 88 b1 72 10 
54 49 ca 30 50 e2 04 44 
8b 20 a4 d8 a0 81 82 70 
90 80 98 48 54 1d c4 29 
0a 43 16 42 15 a2 01 90 
0c ae 83 40 f8 1e 86 f0 
33 00 b6 01 70 02 ac 05 
98 1d 61 a0 78 02 a8 40 
0a 90 20 87 40 47 00 bc 
01 05 06 e0 36 40 4b 81 
18 05 90 2e 07 20 3e 00 
87 ff 85 b0 fd f8 f8 00 
00 00 01 a8 6d 76 63 43 
01 80 00 29 ff 02 00 34 
27 64 00 29 ac 3e c0 78 
02 27 e5 c0 72 00 00 27 
1a 00 07 53 01 c0 c0 00 
0f bc 52 00 00 e4 e1 d0 
39 71 81 80 00 1f 5b d4 
00 01 c9 c3 a0 72 e1 cb 
08 84 51 60 00 60 2f 80 
00 29 4b 0f b0 1e 00 89 
f9 70 1c 80 00 09 c6 80 
01 d4 c0 72 00 00 09 89 
68 00 00 45 5b ad 03 97 
18 80 00 02 60 45 00 00 
08 a3 e3 a0 72 e1 cb 08 
84 51 6a 96 b9 4c 2a 58 
55 00 00 13 8d 00 03 a9 
80 e2 40 00 05 7b cf 00 
00 13 f0 c2 81 cb 8c 04 
00 00 57 62 08 00 00 4f 
70 65 03 97 0a 80 02 00 
81 28 ea 80 4b ce 55 31 
cc 30 5d 26 28 d1 24 86 
87 83 a1 c0 d0 4e 12 14 
2c 0a c0 da 02 fc ad 35 
e9 e8 50 b7 48 c7 78 a1 
41 00 88 b1 72 10 54 49 
ca 30 50 e2 04 44 8b 20 
a4 d8 a0 81 82 70 90 80 
98 48 54 1d c4 29 0a 43 
16 42 15 a2 01 90 0c ae 
83 40 f8 1e 86 f0 33 00 
b6 01 70 02 ac 05 98 1d 
61 a0 78 02 a8 40 0a 90 
20 87 40 47 00 bc 01 05 
06 e0 36 40 4b 81 18 05 
90 2e 07 20 3e 00 87 ff 
85 b0 00 80 28 4a ad f3 
95 4c 73 0c 17 49 8a 34 
49 21 a1 e0 e8 70 34 13 
84 85 0b 02 b0 36 80 bf 
2b 4d 7a 7a 14 2d d2 31 
de 28 50 40 22 2c 5c 84 
15 12 72 8c 14 38 81 11 
22 c8 29 36 28 20 60 9c 
24 20 26 12 15 07 71 0a 
42 90 c5 90 85 68 80 64 
03 2b a0 d0 3e 07 a1 bc 
0c c0 2d 80 5c 00 ab 01 
66 07 58 68 1e 00 aa 10 
02 a4 08 21 d0 11 c0 2f 
00 41 41 b8 0d 90 12 e0 
46 01 64 0b 81 c8 0f 80 
21 ff e1 6c`),
  sps: makeArray('27 64 00 29 ac 3e c0 78 02 27 e5 c0 72 00 00 27 1a 00 07 53 \n01 c0 c0 00 0f bc 52 00 00 e4 e1 d0 39 71 81 80 00 1f 5b d4 00 01 c9 c3 a0 72 e1 cb 08 84 51 60'),
  pps: makeArray('28 ea 80 4b ce 55 31 cc 30 5d 26 28 d1 24 86 87 83 a1 c0 d0 4e 12 14 2c 0a c0 da 02 fc ad 35 e9 e8 50 b7 48 c7 78 a1 41 00 88 b1 72 10 54 49 ca 30 50 e2 04 44 8b 20 a4 d8 a0 81 82 70 90 80 98 48 54 1d c4 29 0a 43 16 42 15 a2 01 90 0c ae 83 40 f8 1e 86 f0 33 00 b6 01 70 02 ac 05 98 1d 61 a0 78 02 a8 40 0a 90 20 87 40 47 00 bc 01 05 06 e0 36 40 4b 81 18 05 90 2e 07 20 3e 00 87 ff 85 b0'),
  entropyCodingMode: 'CABAC'
}
avccConfigs.push(cfg)

cfg = {
  /* this one has extradata data, 'fd f8 f8 00', at the end of the avcC atom. */
  mime: 'avc1.640028',
  avcC: makeArray('01 64 00 28 ff e1 00 2e 67 64 00 28 ac 2c a4 01 e0 08 9f 97 ff 00 01 00 01 52 02 02 02 80 00 01 f4 80 00 75 30 73 30 00 13 12 c0 00 0e 4e 1d f8 c7 07 68 58 b4 48 01 00 05 68 eb 73 52 50 fd f8 f8 00'),
  sps: makeArray('67 64 00 28 ac 2c a4 01 e0 08 9f 97 ff 00 01 00 01 52 02 02 02 80 00 01 f4 80 00 75 30 73 30 00 13 12 c0 00 0e 4e 1d f8 c7 07 68 58 b4 48'),
  pps: makeArray('68 eb 73 52 50'),
  entropyCodingMode: 'CABAC'
}
avccConfigs.push(cfg)

cfg = {
  mime: 'avc1.42C01E',
  avcC: makeArray('01 42 c0 1e ff e1 00 17 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8 01 00 04 68 ce 38 80'),
  sps: makeArray('67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8'),
  pps: makeArray('68 ce 38 80'),
  entropyCodingMode: 'CAVLC'
}
avccConfigs.push(cfg)
cfg = {
  mime: 'avc1.640029',
  avcC: makeArray('01 64 00 29 ff e1 00 18 67 64 00 29 ac 2b 70 50 1e d8 08 80 00 00 03 00 80 00 00 1e 46 d0 e1 97 01 00 04 68 ee 3c b0'),
  sps: makeArray('67 64 00 29 ac 2b 70 50 1e d8 08 80 00 00 03 00 80 00 00 1e 46 d0 e1 97'),
  pps: makeArray('68 ee 3c b0'),
  entropyCodingMode: 'CABAC'
}
avccConfigs.push(cfg)

/* from https://kodi.wiki/view/Samples */
cfg = {
  /* this needs to parse the sps to get necessary data for the avcC */
  mime: 'avc1.640029',
  sps: makeArray('67 64 00 29 ac c8 50 1e 00 89 f9 70 16 a0 20 20 28 00 00 1f 48 00 05 dc 04 78 c1 8c b0'),
  pps: makeArray('68 e9 38 23 3c 8f'),
  entropyCodingMode: 'CABAC'
}
avccConfigs.push(cfg)
