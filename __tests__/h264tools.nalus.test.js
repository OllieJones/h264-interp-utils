'use strict'

const h264tools = require('../index.js')

function makeArray (str) {
  if (typeof str !== 'string') str = str.join(' ')
  return new Uint8Array(str.match(/[\da-f]{2} */gi).map(s => parseInt(s, 16)))
}

/* avc1.42C01E baseline, then avc1.640029 high, (then avc1.4D401E main)  */


const bit1 = makeArray('00 00 00 33 06 05 2f 02 f8 61 50 fc 70 41 72 b7 32 48 f3 a7 2a 3d 34 4d 69 63 72 6f 73 6f 66 74 20 48 2e 32 36 34 20 45 6e 63 6f 64 65 72 20 56 31 2e 35 2e 33 00 80 00 00 00 f0 06 05 ec cb b2 13 92 98 73 43 da a8 a6 c7 42 98 35 6c f5 73 72 63 3a 33 20 68 3a 34 38 30 20 77 3a 36 34 30 20 66 70 73 3a 33 30 2e 30 30 30 20 70 66 3a 36 36 20 6c 76 6c 3a 38 20 62 3a 30 20 62 71 70 3a 33 20 67 6f 70 3a 36 30 20 69 64 72 3a 36 30 20 73 6c 63 3a 35 20 63 6d 70 3a 30 20 72 63 3a 31 20 71 70 3a 32 36 20 72 61 74 65 3a 31 30 30 30 30 30 30 30 20 70 65 61 6b 3a 30 20 62 75 66 66 3a 33 37 35 30 30 30 30 20 72 65 66 3a 31 20 73 72 63 68 3a 33 32 20 61 73 72 63 68 3a 31 20 73 75 62 70 3a 31 20 70 61 72 3a 36 20 33 20 33 20 72 6e 64 3a 30 20 63 61 62 61 63 3a 30 20 6c 70 3a 30 20 63 74 6e 74 3a 30 20 61 75 64 3a 31 20 6c 61 74 3a 31 20 77 72 6b 3a 31 20 76 75 69 3a 31 20 6c 79 72 3a 31 20 3c 3c 00 80 00 00 04 fa 65 88 80 4f ff fe 1e 8a 00 02 04 1e fb ef be fb ef be fb ef be fb ef be fb ef be ff f0 4f 05 e1 48 00 e7 c4 02 07 fc 1c be af 46 e8 2e 00 f8 ef f0 07 ca 4b ce e6 1a 16 f5 34 e4 f1 74 53 a8 cb 66 c1 81 05 42 5e d1 27 3c 2f e8 7c 4b 0f a9 00 5c 30 24 e0 62 25 81 c9 61 28 5b 45 78 cd 93 9e f7 f2 02 ac 04 74 e3 cd ac 9c a8 fc 09 64 13 f0 9e f9 bb 90 03 2c 8e 11 54 db fb cc 8f d7 b0 17 e8 c1 0b 51 0a fe 17 be f5 49 2c 84 e2 a1 92 4d fc d7 62 62 fd d8 16 e1 20 2b 58 4d 2b fc ec 1b 6c df bf 80 20 98 40 fb 80 89 c7 80 64 5b 54 db 78 e7 30 31 b3 1a 97 2a 0a a4 16 f4 0f 0f 3e 5e 07 88 00 47 88 82 5b af b6 e3 12 74 b9 7d ff 70 de 49 e7 b0 26 cc 3f fd af 0e 44 c9 c2 c4 db 1f ff 62 cc e0 db 9b 06 7e fc 06 17 ef be fb ef be fb ef be fb ef be fa eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ff 84 ac e1 c6 70 02 4b e4 62 aa 3e f8 00 3c c8 76 c1 eb a6 98 0c 19 fe c6 c2 01 6a 22 ad 79 2e 3d 73 00 aa 17 28 c2 27 aa f3 85 cf 82 f0 d6 a4 37 d2 6d af d2 63 59 1c 56 a7 47 ce 02 1b 69 9f 8f 7e 7f 8a 03 53 86 d7 07 1f 20 f8 1a 50 bd ae 2f cf 84 da 7e 02 63 04 c9 a2 53 a4 39 d1 90 3c 18 89 47 53 64 e5 9a 40 95 64 33 b3 36 04 83 ff 9b 6f c2 bf 84 ee 04 2e d9 1d 84 bf 35 e8 5f 9a af 6e 2b 7b df ff 04 68 d0 7a 84 6f c0 2d 7c 0e 45 b3 d6 35 50 ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae be c1 c1 ed 93 b1 5c 00 7f c4 8c 75 19 4c 7e 1a ce b3 06 3a 20 dd 82 35 fc 78 f6 74 bd 40 03 8a cd e8 59 d7 2d f1 81 35 72 b1 0e 7d e0 78 17 1d 97 c8 7c 7a 5c da 58 1e 02 e6 1a bb 5f 1e 12 b0 2e 51 3e 6d 14 d6 39 6a 62 17 fe 3f dc de fc 50 8a d6 c1 df ea 01 7a d1 80 13 fc 65 8e a6 5b 5f ee 18 5d 1d 90 f8 e3 c0 de 53 21 05 98 be a3 d2 24 2a 47 4b 4b 1f f9 5a 01 af f0 25 e7 b2 78 52 f1 f5 c5 16 01 c1 98 87 29 1e 39 51 ff ff 6f 1b b7 ec d8 fb 54 cf e1 e8 97 15 e0 c0 4c 7a 61 d6 65 94 76 5a 36 2a ff 70 04 80 b8 26 6c 73 f7 c0 19 16 8f 5b cb df 81 7f fe c2 7c dc c1 d0 24 4a f4 e6 60 f6 bb 85 ca d3 81 f2 df 6b f8 80 21 e3 52 cf bf 7d 96 4f b0 30 4a e3 4f df d5 eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba ff ff 87 0a 78 04 8f d7 b4 3d 10 8d 4f 18 d8 f5 ac 1a 20 d0 75 76 a2 1a ce 24 3d c1 db e2 20 90 2a d7 be 71 24 37 42 3c 79 59 94 c3 ab 75 05 19 1f 20 96 67 37 f3 df 46 bc 4b e7 99 fc de 18 80 36 d6 7a fd f3 9c fb 5f 3e 8e 7a ff 22 a6 72 70 f3 fe ec 0e d6 b0 5b 78 00 6f 56 de 85 3f 7f fe 12 e9 56 f5 79 c4 4d 11 0e e9 55 87 e1 d8 bc 22 a4 0d 50 c3 98 f4 ff 5f 2f ff ae d5 50 75 d0 a6 a7 fa be ab ad 4b 5b 14 39 03 96 93 71 41 19 55 3f cc 95 a0 e5 6e b9 de 94 9d 80 c1 ba 7c 12 e2 a7 52 1b da 8b cc 80 aa 8f a1 82 81 9b 5a b7 06 9e ed f2 8f e1 3d 3d 42 20 f3 fa e7 67 df de 2b 22 30 7b 40 ef fc 1a 63 6d 7f d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 ff 38 ff 48 53 01 a3 69 cc b6 b4 38 00 49 be 21 65 3a 90 8e ee 01 23 38 66 43 84 6a a8 ea bd 70 05 df 3c 90 ac a8 77 77 ba 1a 80 2e 23 31 a6 c3 fc d8 b5 a4 08 ea 6f 18 49 03 48 c1 4f c2 57 6a 78 01 f5 9e 3a ff df ae 38 04 1f f5 95 c6 bf 02 a2 12 43 8a 56 37 b9 f0 23 f1 82 16 a2 69 09 41 e7 00 8b d6 94 7b 9f 99 6d b7 5d 42 e1 14 49 53 da 3b cb 50 23 fb 82 12 e2 56 2a b3 65 9a 0b 8f 73 aa 3e 04 b2 04 fc 27 be 5c 1d 8a 49 e3 77 df a1 05 02 93 7b c4 06 9e bc 81 0f b1 6c 56 3c ef 5b 5a f2 61 9e e1 52 ff f7 f8 50 59 70 1e 51 15 c0 6d 85 ac 71 ca c7 df 7f b4 d9 6d f9 eb f5 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 7f c7 fe f0 43 c0 08 cc 41 f9 84 5b 80 d8 d1 6c 1d 8a d0 0b 1f bf 00 fe f8 cd 56 48 86 fc 66 97 ee e0 cc 9e 02 04 b7 8b 70 d8 02 ec 33 db cc c2 41 7f 58 2b 30 dc e8 d0 09 c4 5f e0 22 90 06 96 d1 fb 59 df 07 cc 19 2a 30 b1 e7 0a 0c fd 50 68 f5 b6 67 1c 10 fe 45 14 ee 98 2e f1 a8 ec 22 10 ef 28 af f1 37 01 09 f5 c9 ef 7e 38 04 2f db 3b 9a fc 0f f1 c1 ae 8c 85 0c 50 9a 9b f0 67 fc 66 17 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 78 00 00 04 04 65 01 e2 22 01 3f ff f8 7a 28 00 08 10 7b ef be fb ef be fb ef be fb ef be fb ef be ff f8 f9 3b 1c 66 01 12 b7 63 c8 78 24 30 ef 31 4f 7e 70 12 2e 5c 78 00 2f a9 61 96 54 61 8b fd ac 29 b9 5f 08 a0 f5 54 ff 65 47 41 12 b8 ea 5f 45 f1 90 e2 88 d4 44 75 0a a1 a5 e1 43 42 07 37 8b af 1c 01 09 f4 cf e7 bf 05 38 12 4f 91 96 63 e5 02 bc 6c 6c 8c 31 00 01 38 a6 32 07 5f a0 fc 0f e0 a3 67 29 61 25 7f 05 90 dd 22 83 43 53 2a 84 6c 11 e8 ce 14 03 bd 47 08 8f 71 a7 c8 8f 82 58 3f 70 77 16 89 e6 10 d2 7d 60 c2 d8 e7 b3 eb b1 de fc 3f 09 59 03 02 b2 53 e7 80 86 87 34 77 19 5d 01 65 bb e9 47 92 c6 5a f5 c9 66 0a 01 e1 c9 df 7d f7 df 7d f7 df 7d f7 df 7d f5 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 f0 a5 f8 e1 ad e5 08 76 10 a1 e9 2c e1 2e ea 46 17 76 25 9e 09 ab 46 0c 87 41 13 f7 df f8 00 8a 76 78 40 f8 14 f1 f6 6a fd bf 3e 10 b2 e0 6a 22 ff 60 6d 84 96 38 e6 63 ef b6 b0 59 8c 54 9c 88 6e 03 82 18 93 98 d8 f4 e2 61 c8 2f fb f0 0f 37 c9 c0 05 ba 1c 5a 78 00 05 2d 01 c1 51 26 bf 23 7a 32 83 ff ea a1 ef f9 1c f6 93 37 b5 98 28 25 93 c9 d0 ed ff 79 ec 6d 78 05 c4 87 70 96 de fe cd ad e6 44 92 93 b1 be 95 2b a3 39 fd 7d 03 fa fd 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 7c e3 f8 fe f0 60 08 68 c4 a2 a7 6f 7d f7 00 43 7d 31 3c d7 e4 20 f5 e2 46 3c 2f cf f0 00 cc 56 78 8f 12 8c d5 d1 e9 20 58 98 01 a3 f0 7e 19 c0 0d aa c0 da 8d d4 1e 10 7c b2 d1 ae 7e 07 26 42 28 b8 9a f3 30 2f a2 0c 2e 13 7f 6b 8f f5 1a dc 31 80 01 19 14 c2 61 7b a8 0d f4 1e 2e 93 03 a8 d3 fd fe 2b 0f 45 13 d8 9f c8 17 50 0d 2d 17 35 dd f0 39 06 c4 0a 7f 13 5e 38 0b 2e c7 41 df 81 e0 21 3a 9f fe 43 f0 64 26 2a 3f b1 7f 92 26 00 9e 40 89 e2 55 c7 00 87 fd 67 73 df 81 f8 45 05 24 0f 84 a5 9e b8 0c c0 81 0f 35 8c 6e 1b be a8 37 c6 1f 84 e0 7c db d4 14 cf da 7e 74 0b 5a c4 39 d9 0f fd ff 0c 19 6e 6f df d5 eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba ff ff e1 04 38 02 b2 1a e2 3c 7a 38 f1 37 47 b9 3d 6a c7 41 1e 27 00 0b f5 02 9e 43 83 86 69 f4 00 25 b7 8d 88 9d 07 7f da d0 3c 92 f2 10 00 76 86 0a b6 d5 5f 79 6e 85 57 41 5d 2b be 2d 16 36 b2 ce 99 20 0c d7 fe 80 6a 17 c5 d7 c8 b0 b8 a7 0b ab 05 95 39 a6 0e da 60 06 81 f8 98 7e 04 bc 7a 27 b3 17 0f d5 61 cb f6 a3 bb 7e 7e 09 2d 17 9b 04 36 be a3 25 87 1d 9d db 03 cc 3e d6 b6 7f 35 57 d3 33 8e 11 29 7f fe 45 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 77 e8 a2 a3 ff e1 28 09 d2 ec 6d 94 90 2c 23 5e f6 0a a5 f0 6b ef fb 06 0f d1 aa 1f cf 5f 20 98 d1 2e 1f 75 d7 81 42 63 b5 33 29 e5 5b 00 2f 20 45 d3 ef 2f 60 04 ed 15 d1 d8 ef 2c ce 5f e0 1c 3d c3 92 a4 c0 8d c7 25 bb 2f df 5e ef 9b 73 7e a5 ff d4 0a ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae bf ff f2 78 21 c0 15 cc c5 15 f8 00 7b b6 04 90 00 60 0b b3 eb 70 9c ff 0c a6 ad 17 df ff f8 56 18 cd 31 b4 75 da 1d 29 8c 99 df 90 d2 56 1f 22 fc ae 80 65 8b ea 5e 43 d3 7e 03 e1 da 89 15 f8 cc 03 0b eb 3f 06 16 d4 b7 fe b7 0f 04 10 82 43 b2 b2 47 3b c0 15 4f 30 0f 3e 63 08 c6 96 72 6b 39 89 f9 51 45 07 b9 55 dd a5 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 e0 00 00 04 74 65 00 f0 88 80 4f ff fe 1e 8a 00 02 04 1e fb ef be fb ef be fb ef be fb ef be fb ef fe 23 ed be 32 00 3a 86 6f 46 59 2a 68 fa c3 b8 23 f2 2c 76 fc 5f be ff 80 06 15 c9 59 b2 4d 80 c8 00 fc a0 33 6c 3b a6 36 ce fc 09 6b 99 8a 28 fb 5d 4c 69 ad db af ff da 68 45 dc 6a 0d d9 01 f6 2a ba af c2 17 c0 7f c3 3d c0 71 0e 5e 17 60 e1 28 48 99 71 e4 92 19 7f 27 e9 c1 20 31 62 c5 7b 1a f0 00 0e 0e 3f 1c 74 b8 af ee 06 80 3a ab 50 27 66 6a 75 19 9e 1c 9f 92 8d f8 f0 03 17 52 19 e1 90 03 1d 2b 3f 13 90 87 e6 47 bf e6 c5 40 c3 ad 1a 82 54 33 4f 39 e8 18 a9 50 cf 06 2d 52 dc fe a1 fc 10 41 d5 e3 71 10 b7 d6 9f 7f 6c 9a 0d 2e 17 98 95 03 7a be fb ef be fb ef be fb ef be fb ef ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb eb d6 39 13 dd 63 20 f3 48 76 2f 8f fc 75 ab 7c b4 6b 3f 59 ff 00 0c 22 68 49 39 5c 8c e0 06 15 5b d3 fa cf 7b a2 cd e1 02 23 64 5d 68 03 23 87 2b 61 bf a0 78 24 4c fd 59 f9 4f b0 55 30 2e 53 eb 3a d2 42 ea a8 51 50 cb d5 55 95 55 62 7b 6f 0f 85 76 6e 1f 7f 34 fa 91 a7 8f 8f d5 0b 0c 9b cf 63 ff 74 96 5d a1 ea bf 90 78 3d f6 14 b9 bb fe e6 05 78 ad d3 b3 f5 be e5 1a 6b df 80 cb 59 5f 69 ad 05 71 68 15 bb 32 6b 92 8f 7b 70 59 96 49 c4 8e ce 79 03 6e 78 6f 2e 1f c4 12 01 85 ff 04 11 d4 62 ee 96 f8 f7 fd 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 7b 30 48 05 92 21 a2 dc 1e 7a c1 f7 62 73 e9 45 40 fd 9c 97 91 8d 14 91 cc 71 d1 12 60 71 40 e0 8a 83 6e 9e a4 0f 16 99 80 00 80 03 59 ff af 82 58 c3 8e 90 d4 c2 9b ae 1a 7a c5 6c 98 e2 ff f7 86 ee 41 aa 18 f1 ec 75 04 d0 39 7e 76 1a 70 0d 1b 4e 64 cd 69 10 d9 6c 38 2a e9 5b 69 9f 06 91 78 4f 3c 10 02 97 80 50 41 b7 79 e7 30 a5 b9 80 c5 30 ba 02 41 64 1f 80 f5 4c 0f cf 04 71 2f 5f dd 91 72 2e 91 b3 fd ba 00 9d 25 8e 76 38 89 f1 a9 0c ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae bf f8 7d a9 0a 60 08 48 83 54 31 63 d0 47 15 a3 40 0c 32 96 ef d3 2a 19 4a 18 87 2d 41 4b 62 54 79 84 2f f9 7a eb 56 6e 96 b8 6e 41 62 82 04 6c da ff 02 90 0d 2d 17 b4 85 73 66 1b 52 09 1e c1 e5 e1 bf 9c 05 17 63 a0 af c7 00 41 b2 89 4e 90 fc 88 0d b0 56 2f ff 9a 47 02 59 02 7e 12 eb 9b 90 49 92 1e 81 e9 0f cf 02 1e c7 58 f0 7a 5e 54 7b 98 a6 bb ff a3 80 07 3f 91 21 bd 46 52 71 f4 00 ec 1b 87 e1 8c 0b a5 f0 8f 7d f0 ce 00 6d 56 01 35 1b ab 0f 02 1f ad e8 f7 3f 00 8f 23 6a f9 4f e0 3e e8 0e 00 46 c7 0f 6a ce 4c 84 a1 f2 5f 8e c9 8c d1 dc 7e 0e d5 bd 50 61 69 f7 c1 fd 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 7f cf fc 8a 14 cc 8d 7c ff 8e ff 00 02 7a 21 4a 0a d1 09 2e fc c0 05 1c 4b e2 c4 10 97 39 52 c7 d0 22 04 af cf fb 51 de ef 7d 6b 7a 33 15 f6 74 c1 5a ff 81 bf f8 22 dc 4a 82 ff 3c 38 46 c6 14 9e 6d 78 3c 01 54 69 6d 1f 3a 87 48 cd 99 fe 1e 8c a5 96 cd 26 e8 c3 3f 2d f8 21 cc 75 60 de af ff 82 a4 aa 04 96 e7 2a 75 cd b9 20 14 20 1b 50 a8 f2 17 e6 3e 2b 6a 6b 6f ce 06 c1 86 4c 4e 39 28 7a f5 2b 35 67 96 fe 6d 69 ff 3f c2 7f 3f 97 8a 48 f8 b2 06 0b f8 18 ee 91 ad 4c 6f f7 ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb af f6 81 7e 78 52 3a 2c b6 13 1c 99 f6 27 0d 51 74 d2 02 c9 40 b2 f6 0e 0f 1e 93 07 04 be 7d 2b fd 80 d7 27 89 48 27 36 0b ff 5a b4 d8 25 eb c9 47 6c fd 7f f8 53 e3 13 df 7e df e0 01 ff c4 2c e3 eb 18 b1 a0 7f 66 f8 4f 63 5d 0e 90 bc c7 6f f8 c2 f3 44 40 d0 80 3b 68 4c e5 6d 06 50 e6 d0 06 88 86 81 9f e9 bc 8d c6 63 e6 bb 85 2d 89 a0 a7 fc fc 0a ba eb ae ba eb ae ba eb ae ba eb ae ba f0 00 00 04 69 65 00 5a 22 20 13 ff ff 87 a2 80 00 81 07 be fb ef be fb ef be fb ef be fb ef be ff e2 fb 40 c7 bf 00 15 d0 51 6a 82 8a 24 54 df 6c 00 3a c4 49 45 5b 10 b1 f1 96 08 b2 da 14 d7 3b a4 19 41 aa f1 fe 6a 00 d3 b9 0d 09 a1 98 06 0d 33 b8 84 a0 bd e8 90 c7 85 69 df 2f da 1f e1 7f 69 a6 b6 b4 f0 71 aa e6 a2 7a 1f 70 99 18 74 c4 0a 96 2e d0 01 d2 64 3b 3b 10 15 97 de 07 5e 6a f8 7d f7 88 00 74 ff 09 15 14 62 02 d8 37 d1 89 be 9f da 0f c0 c5 b1 5d 1c 9d 10 4f d4 36 d9 ea 79 7f fe 54 c0 df ef f9 da 5d 1a 6e 9e fb fc 7f f0 f6 d4 92 ac 32 61 ff d7 e0 ff 27 7d f7 df 7d f7 df 7d f7 df 7d f7 df 7d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 d2 26 aa 37 27 15 ad e0 6d da ce 0a 16 b3 ff 67 f0 3b 5a ae 55 66 63 df 85 40 90 aa 1b 9e 1c 60 1e 57 aa 6f 5f cf 57 c0 00 82 c8 11 38 5b dd a0 00 88 b7 12 98 fa 27 a9 04 be 14 e0 34 13 ac 86 30 da 94 4c 44 b5 b3 90 4c bb a0 6a 22 c7 9f 81 c1 90 01 a4 b1 f8 6a 25 f7 85 0f f3 93 fb ba 1d 9b 11 65 4e 3d 90 ff 41 ee d3 9d 53 e2 71 1f 8d c3 da 13 db 86 11 28 4b fa f4 ba f9 81 38 25 29 ef 4e b4 99 2c d1 9b bd 3c 3c 71 5d ff e0 78 8d 2d ba a2 f3 1d ff b7 cc a9 68 cc 15 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 ff ff 08 42 9e 00 18 5e 4a de 96 bb cc c5 95 79 df f0 24 99 15 17 1f 17 0d 2c 0c db 81 d1 67 c1 e0 9a 09 f5 1a 9e 71 26 80 45 d9 36 5a 3c 75 c9 17 db c0 81 7f 86 7d 34 0a 4e 98 3f 0e af ff c6 70 35 50 1b 50 dc 83 c2 0f 96 f4 69 0f c0 f9 90 8a 2e 25 f9 78 17 c8 30 f8 4e f5 48 7d db 5f 17 0a 09 20 36 f1 02 09 ca af b4 1e 29 48 ee 9c 07 a5 d9 b8 c2 31 cf fd 6d 70 b8 b7 1f 4e 67 0f cc 6b a7 63 0b 79 15 f8 00 2f e3 01 c2 26 be 7a 58 80 27 98 64 f1 2a e3 80 43 fd b9 1c d7 e7 c1 b3 85 d1 d4 24 a4 e7 37 8b cd c7 97 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 ff 2f b0 61 4c 00 30 8f 25 33 69 37 8b 9f 43 0b 1d 4a 08 2f ff e0 05 68 cd 09 63 d6 3e e6 00 8d 54 02 8a 1f 0d ee d3 1f 27 70 7b d5 ef 99 1c 07 46 0b d8 b0 95 ec 77 00 d8 37 3c 33 06 89 e6 bf d6 b3 93 51 aa 6f 43 d1 16 f7 ee e8 a6 d9 08 54 a0 a4 ff fa cb 0e 1a cc 16 16 45 f5 6a e4 d3 77 cc 71 84 f5 0a 12 67 1e 56 5d e8 83 c5 67 3e b0 c7 c7 5d b3 cc 41 09 3f f7 86 44 35 1a 23 1b a7 f4 e2 1b bb 90 41 1e 74 4b 07 51 23 f7 22 4c 7d bc 05 94 85 76 f4 83 16 6a 34 08 7f f0 9c 3f 31 3a be 3e fc d3 96 03 90 f4 6a fc 2b e8 cc e1 a1 07 ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb af f4 6f ee cf 19 9c df 60 1c c3 6a b2 81 12 43 cc 2d 87 c1 1e fb 00 01 6c aa 30 01 a8 10 43 2f d6 0a be 50 5b f1 f1 62 da b7 80 83 53 cf c2 ac c8 e0 ff 7a 6a 02 33 e8 41 41 af ba ad 12 e1 85 41 d0 cd 4c 51 da 74 72 64 86 55 36 a6 be db f0 40 09 01 47 ee ad 68 a5 09 9c 82 34 d6 fb d1 91 a3 da 7b b5 39 8a 28 51 68 70 a6 73 d8 f6 57 06 80 8b 2b 68 30 32 a8 98 2f 77 12 c8 f7 a8 76 bc c1 3b b7 ff c8 3a 5d 68 fd 2e ca 3d d7 16 fe 7f e1 e9 78 74 ff 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5f 0a 47 ec 12 de 03 60 bf 86 2c 7a b7 a6 3d 04 78 92 d1 1e 0c 06 0b c5 ce 60 7a 81 5b 07 00 5e da 13 45 1f d8 c4 88 1d cd 9e 55 89 5f cc 38 94 35 b0 23 5b d7 fd f2 52 a7 c1 bd ed c0 31 1e 4a 66 c8 9a 45 a0 33 6e a5 42 8c 8d 47 06 21 0f 30 e3 23 50 0c 52 40 a3 bb c6 7e c0 cf ef c4 58 ec 29 4c bd 00 06 dc 9a 0f e7 cd c4 4f 2b f0 f1 e6 86 01 10 0f ff 5b a1 93 67 12 20 93 f7 16 51 87 38 d2 86 a1 67 b6 03 dd 33 5e bb df 06 bf 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 e0 00 00 04 a8 65 00 78 22 20 13 ff ff 87 a2 80 00 81 07 be fb ef be fb ef be fb ef be fb ef bf e0 f6 61 3c 5f ba 60 06 03 60 00 20 04 25 92 00 7b 97 c3 b4 02 eb dc 28 1e 50 cd ff 4a b0 b0 6a 01 c5 58 1a f1 80 c1 95 f6 d2 9a 5a 69 af eb f1 e2 b3 fe 41 2d 3d f7 d8 22 6a 86 88 8e 87 3f 75 7d e9 76 01 07 36 a6 d3 f8 9f 08 e9 01 c5 7f cf fc 58 1d fb 6d 2d f5 f2 18 8c 9d cf 09 2e 38 ed 59 19 03 32 1f 92 80 30 5c 06 1c 6c c3 64 70 ff f9 48 c7 80 d3 06 06 84 b4 1b 95 9e fa 3d e1 82 2d bc ee 09 0a 7f db 00 06 46 d3 b5 b5 b8 bc 98 d4 95 94 e3 db 53 c7 7e ff 7d e1 c9 df 7d f7 df 7d f7 df 7d f7 df 7d f7 df 7d f5 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 ff fe b8 20 e0 01 23 7c 42 ce 7e c4 73 10 95 9d 73 f3 13 0d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 7f 67 13 c2 d5 ef 00 91 fa f6 81 b6 17 b3 8f 14 c0 60 cb f7 a0 88 00 19 62 81 c2 a0 b8 fc 52 62 17 58 fc a3 82 3b 5a 25 14 3d ce e2 15 f2 08 d8 3a ef ce 00 91 fa f6 8d 88 12 6f cf 9c 28 00 0d 28 1a 31 97 3a bc d4 91 80 69 64 1c 00 60 4a d8 2b 05 ec 2b 27 fe d2 18 14 7f 9b 24 7f 49 99 3a ad f8 08 e4 66 44 55 0e 41 ae c2 96 98 b5 ed f0 f1 02 e5 30 09 6a 7e 77 ec 0b ec b7 72 38 f1 bb 1b eb 49 9f ac 6f 4d 47 0c 9a 59 5c dd 16 c4 e0 47 7a 2d 99 ff 7d 3d 48 38 fe 0a 65 05 e1 53 38 4d 05 2e 06 a6 2b 04 b9 5e 5c 49 fd 2f 6c f6 d9 52 85 a0 8a a5 6f b8 60 60 f0 00 21 df 2c de 5a ef 5c 31 9d ae fd fe 31 be 00 b7 6d 88 95 6c 88 1e 12 7b 4c b2 96 f5 f7 8d 04 2d 56 ca e5 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 e1 ff 43 32 00 b8 7a 40 43 fe 18 f8 f3 f8 27 b1 2d 60 78 54 54 5e 30 98 f3 98 6f 6e 68 f3 60 f1 38 f0 d8 8e 5f a3 cd b6 23 49 9f 20 fc 51 e0 36 bf d8 31 22 b1 af 77 3b 64 d8 9a 3f 82 db 26 e1 47 95 7a 96 f7 e9 63 8f 72 6c 4d 1b f3 a3 eb 7c ef 9d cd d2 61 6b c4 b5 a6 3f 98 80 fd 1a 2d f9 b6 c1 9b 05 20 61 0e b5 8f fc b2 ad 89 ed 1b f9 51 9e 0b 3b 34 fd 6f cb 37 5f 40 70 63 35 62 32 43 93 dd 17 49 39 c7 be 66 d7 7f e8 0d c2 3c 59 f7 80 2d 52 6f 41 d5 f0 0e c5 ae 9e ff c0 59 24 77 20 87 6d 60 4e 29 e7 2a 99 a2 18 3d e0 20 dc 2d 7f b6 32 1f ff 69 21 22 49 2b c7 3b fc e0 0e 61 af 31 ae 6f b3 e6 5c 39 ba 39 da 69 ad 96 8d af 53 0c 01 38 ad 4c 5f ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb d9 81 1e 30 ff 70 1d 7c d0 2d de c5 6d aa 54 90 92 26 9b ff 75 a5 6c c0 31 a2 a9 2d fe 77 6c d8 22 57 54 91 a5 1b 2e 4e 7e 09 52 0f e9 1c 74 03 73 a4 f4 bc 3e 64 27 3a 3b f3 e3 08 c4 0c 3e 12 bf 88 60 82 6d 10 bc 2d 7e 7f ee b5 b1 f8 28 53 c5 9d 88 dc 89 b2 37 1e 86 19 4f ef 93 bd 3f 1f 43 23 53 7e f9 2d b6 b0 6f db 88 98 67 b8 cc f5 ff fb 72 e5 9c 33 42 08 7d b2 11 84 85 f8 ec 50 34 03 52 6a 3f ed 8e 59 86 5c 25 66 16 fa 4f 5d dc 0f bf e1 bd 8b 7f e2 7f 23 cd 00 01 7b 67 c5 7a f8 00 cf 4b 33 11 25 2f fd f7 6e db 6e 3d a1 af ba d6 6c 8a a2 ff d0 61 ef 56 37 36 a6 be 8b a3 1b f5 1f bf d7 eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba eb ae ba fc 0a aa 31 60 62 ee 00 07 e9 89 05 36 0a 18 cf 80 fe 0d 2c 1e b5 ca e0 3e b3 01 89 39 cd b3 ea 47 ac ca 0c 35 72 4d ef 83 61 00 59 07 fd 72 ff 06 87 86 45 ba 9a ee 68 e2 87 be ef eb d2 1a 1a 98 3c 17 08 45 62 49 8f 69 50 fe 2c e1 5c c6 a2 fe 30 84 2f 70 69 bf b7 cc 0e f7 70 11 63 1e 36 15 31 f9 eb d6 bf 27 9c 20 18 07 01 50 6b fc 04 35 98 31 8c b8 ff c0 67 a2 c3 03 5a 37 fe b0 e1 00 69 45 ed 72 fc 0e 82 09 94 4a 74 80 bf 3e 93 6d 7c 15 bc 3a 42 71 ee 99 ab 2e 29 e0 fb 98 4b 00 9b 32 e0 d9 05 d4 57 26 8a 85 c7 8e 8d d1 ee bf 0f f0 9f 01 b1 42 55 bb 14 95 c1 b8 0a 1a 65 3a c7 bd c0 a3 85 bd a7 47 bd 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5d 75 d7 5e')
const axb4 = makeArray('00 00 00 01 09 10   00 00 00 01 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8  00 00 00 01 68 ce 38 80  00 00 00 01 06 05 2f 02 f8 61 50 fc 70 41 72 b7 32 48 f3 a7 2a 3d 34 4d 69 63 72 6f 73 6f 66 74 20 48 2e 32 36 34 20 45 6e 63 6f 64 65 72 20 56 31 2e 35 2e 33 00 80  00 00 00 01 06 05 e8 cb b2 13 92 98 73 43 da a8 a6 c7 42 98 35 6c f5 73 72 63 3a 33 20 68 3a 34 38 30 20 77 3a 36 34 30 20 66 70 73 3a 33 30 2e 30 30 30 20 70 66 3a 36 36 20 6c 76 6c 3a 38 20 62 3a 30 20 62 71 70 3a 33 20 67 6f 70 3a 36 30 20 69 64 72 3a 36 30 20 73 6c 63 3a 35 20 63 6d 70 3a 30 20 72 63 3a 31 20 71 70 3a 32 36 20 72 61 74 65 3a 32 35 30 30 30 30 20 70 65 61 6b 3a 30 20 62 75 66 66 3a 39 33 37 35 30 20 72 65 66 3a 31 20 73 72 63 68 3a 33 32 20 61 73 72 63 68 3a 31 20 73 75 62 70 3a 31 20 70 61 72 3a 36 20 33 20 33 20 72 6e 64 3a 30 20 63 61 62 61 63 3a 30 20 6c 70 3a 30 20 63 74 6e 74 3a 30 20 61 75 64 3a 31 20 6c 61 74 3a 31 20 77 72 6b 3a 31 20 76 75 69 3a 31 20 6c 79 72 3a 31 20 3c 3c 00 80')
const axb3 = makeArray('00 00 01 09 10 00 00 01 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8 00 00 01 68 ce 38 80 00 00 01 06 05 2f 02 f8 61 50 fc 70 41 72 b7 32 48 f3 a7 2a 3d 34 4d 69 63 72 6f 73 6f 66 74 20 48 2e 32 36 34 20 45 6e 63 6f 64 65 72 20 56 31 2e 35 2e 33 00 80 00 00 01 06 05 e8 cb b2 13 92 98 73 43 da a8 a6 c7 42 98 35 6c f5 73 72 63 3a 33 20 68 3a 34 38 30 20 77 3a 36 34 30 20 66 70 73 3a 33 30 2e 30 30 30 20 70 66 3a 36 36 20 6c 76 6c 3a 38 20 62 3a 30 20 62 71 70 3a 33 20 67 6f 70 3a 36 30 20 69 64 72 3a 36 30 20 73 6c 63 3a 35 20 63 6d 70 3a 30 20 72 63 3a 31 20 71 70 3a 32 36 20 72 61 74 65 3a 32 35 30 30 30 30 20 70 65 61 6b 3a 30 20 62 75 66 66 3a 39 33 37 35 30 20 72 65 66 3a 31 20 73 72 63 68 3a 33 32 20 61 73 72 63 68 3a 31 20 73 75 62 70 3a 31 20 70 61 72 3a 36 20 33 20 33 20 72 6e 64 3a 30 20 63 61 62 61 63 3a 30 20 6c 70 3a 30 20 63 74 6e 74 3a 30 20 61 75 64 3a 31 20 6c 61 74 3a 31 20 77 72 6b 3a 31 20 76 75 69 3a 31 20 6c 79 72 3a 31 20 3c 3c 00 80')
const axb4emptyAtEnd = makeArray('00 00 00 01 09 10 00 00 00 01 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8 00 00 00 01 68 ce 38 80 00 00 00 01 06 05 2f 02 f8 61 50 fc 70 41 72 b7 32 48 f3 a7 2a 3d 34 4d 69 63 72 6f 73 6f 66 74 20 48 2e 32 36 34 20 45 6e 63 6f 64 65 72 20 56 31 2e 35 2e 33 00 80 00 00 00 01 06 05 e8 cb b2 13 92 98 73 43 da a8 a6 c7 42 98 35 6c f5 73 72 63 3a 33 20 68 3a 34 38 30 20 77 3a 36 34 30 20 66 70 73 3a 33 30 2e 30 30 30 20 70 66 3a 36 36 20 6c 76 6c 3a 38 20 62 3a 30 20 62 71 70 3a 33 20 67 6f 70 3a 36 30 20 69 64 72 3a 36 30 20 73 6c 63 3a 35 20 63 6d 70 3a 30 20 72 63 3a 31 20 71 70 3a 32 36 20 72 61 74 65 3a 32 35 30 30 30 30 20 70 65 61 6b 3a 30 20 62 75 66 66 3a 39 33 37 35 30 20 72 65 66 3a 31 20 73 72 63 68 3a 33 32 20 61 73 72 63 68 3a 31 20 73 75 62 70 3a 31 20 70 61 72 3a 36 20 33 20 33 20 72 6e 64 3a 30 20 63 61 62 61 63 3a 30 20 6c 70 3a 30 20 63 74 6e 74 3a 30 20 61 75 64 3a 31 20 6c 61 74 3a 31 20 77 72 6b 3a 31 20 76 75 69 3a 31 20 6c 79 72 3a 31 20 3c 3c 00 80 00 00 00 01')
const axb3emptyAtEnd = makeArray('00 00 01 09 10 00 00 01 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8 00 00 01 68 ce 38 80 00 00 01 06 05 2f 02 f8 61 50 fc 70 41 72 b7 32 48 f3 a7 2a 3d 34 4d 69 63 72 6f 73 6f 66 74 20 48 2e 32 36 34 20 45 6e 63 6f 64 65 72 20 56 31 2e 35 2e 33 00 80 00 00 01 06 05 e8 cb b2 13 92 98 73 43 da a8 a6 c7 42 98 35 6c f5 73 72 63 3a 33 20 68 3a 34 38 30 20 77 3a 36 34 30 20 66 70 73 3a 33 30 2e 30 30 30 20 70 66 3a 36 36 20 6c 76 6c 3a 38 20 62 3a 30 20 62 71 70 3a 33 20 67 6f 70 3a 36 30 20 69 64 72 3a 36 30 20 73 6c 63 3a 35 20 63 6d 70 3a 30 20 72 63 3a 31 20 71 70 3a 32 36 20 72 61 74 65 3a 32 35 30 30 30 30 20 70 65 61 6b 3a 30 20 62 75 66 66 3a 39 33 37 35 30 20 72 65 66 3a 31 20 73 72 63 68 3a 33 32 20 61 73 72 63 68 3a 31 20 73 75 62 70 3a 31 20 70 61 72 3a 36 20 33 20 33 20 72 6e 64 3a 30 20 63 61 62 61 63 3a 30 20 6c 70 3a 30 20 63 74 6e 74 3a 30 20 61 75 64 3a 31 20 6c 61 74 3a 31 20 77 72 6b 3a 31 20 76 75 69 3a 31 20 6c 79 72 3a 31 20 3c 3c 00 80 00 00 01')
const noFirstStartCodeb4 = makeArray(' 09 10 00 00 00 01 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8 00 00 00 01 68 ce 38 80 00 00 00 01 ')
const empty = new Uint8Array(0)

test('NALUStream constructor in Annex B, short stream, 4 byte sentinels', () => {
  /* four packets, four-byte sentinels: this stream is pure nonsense h264-wise */
  const data = makeArray('00 00 00 01 01 02 03 04 01    00 00 00 01  01 02 03 04 02    00 00 00 01 01 02 03 04 03    00 00 00 01 01 02 03 04 04')

  const stream = new h264tools.NALUStream(data)
  expect(stream.type).toEqual('annexB')
  expect(stream.boxSizeMinusOne).toEqual(3)
  expect(stream.packetCount).toEqual(4)
  const packets = stream.packets
  expect(packets).toBeDefined()
  expect(packets.length).toEqual(4)
  for (let i = 0; i < packets.length; i++) {
    const packet = packets[i]
    expect(packet.length).toEqual(5)
    expect(packet[packet.length - 1]).toEqual(1 + i)
  }
})

test('NALUStream constructor in Annex B, short stream, 4 byte sentinels, iterator', () => {
  /* four packets, four-byte sentinels: this stream is pure nonsense h264-wise */
  const data = makeArray('00 00 00 01 01 02 03 04 01    00 00 00 01  01 02 03 04 02    00 00 00 01 01 02 03 04 03    00 00 00 01 01 02 03 04 04')

  const stream = new h264tools.NALUStream(data)
  expect(stream.type).toEqual('annexB')
  expect(stream.boxSizeMinusOne).toEqual(3)

  let count = 0
  for (const nalu of stream) {
    expect(nalu.length).toEqual(5)
    expect(nalu[nalu.length - 1]).toEqual(count + 1)
    count++
  }
  expect(count).toEqual(stream.packetCount)
})

test('NALUStream constructor in Annex B, short stream, 3 byte sentinels', () => {
  /* four packets, four-byte sentinels: this stream is pure nonsense h264-wise */
  const data = makeArray('   00 00 01 01 02 03 04 01       00 00 01  01 02 03 04 02       00 00 01 01 02 03 04 03       00 00 01 01 02 03 04 04')

  const stream = new h264tools.NALUStream(data)
  expect(stream.type).toEqual('annexB')
  expect(stream.boxSizeMinusOne).toEqual(2)
  expect(stream.packetCount).toEqual(4)
  const packets = stream.packets
  expect(packets).toBeDefined()
  expect(packets.length).toEqual(4)
  for (let i = 0; i < packets.length; i++) {
    const packet = packets[i]
    expect(packet.length).toEqual(5)
    expect(packet[packet.length - 1]).toEqual(1 + i)
  }
  let count = 0
  for (const nalu of stream) {
    expect(nalu.length).toEqual(5)
    expect(nalu[nalu.length - 1]).toEqual(count + 1)
    count++
  }
  expect(count).toEqual(stream.packetCount)
})

test('NALUStream constructor in Annex B, short stream, varying length sentinels', () => {
  /* four packets, this stream is pure nonsense h264-wise */
  const data = makeArray('   00 00 01 01 02 03 04 01    00 00 00 01  01 02 03 04 02       00 00 01 01 02 03 04 03    00 00 00 01 01 02 03 04 04')

  const stream = new h264tools.NALUStream(data)
  expect(stream.type).toEqual('annexB')
  expect(stream.packetCount).toEqual(4)
  const packets = stream.packets
  expect(packets).toBeDefined()
  expect(packets.length).toEqual(4)
  for (let i = 0; i < packets.length; i++) {
    const packet = packets[i]
    expect(packet.length).toEqual(5)
    expect(packet[packet.length - 1]).toEqual(1 + i)
  }
  let count = 0
  for (const nalu of stream) {
    expect(nalu.length).toEqual(5)
    expect(nalu[nalu.length - 1]).toEqual(count + 1)
    count++
  }
  expect(count).toEqual(stream.packetCount)
})

test('NALUStream constructor in Annex B with 4 byte sentinels, longer', () => {
  const stream = new h264tools.NALUStream(axb4)
  expect(stream.type).toEqual('annexB')
  expect(stream.packetCount).toEqual(5)
  let count = 0
  for (const nalu of stream) {
    count++
  }
  expect(count).toEqual(stream.packetCount)
})
test('NALUStream constructor in Annex B with 3 byte sentinels, longer', () => {
  const stream = new h264tools.NALUStream(axb3)
  expect(stream.type).toEqual('annexB')
  expect(stream.packetCount).toEqual(5)
  let count = 0
  for (const nalu of stream) {
    count++
  }
  expect(count).toEqual(stream.packetCount)
})

test('NALUStream constructor in packet mode, boxSize = 3', () => {
  const bits = makeArray('00 00 02    09 10      00 00 17 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8     00 00 04 68 ce 38 80     00 00 33 06 05 2f 02 f8 61 50 fc 70 41 72 b7 32 48 f3 a7 2a 3d 34 4d 69 63 72 6f 73 6f 66 74 20 48 2e 32 36 34 20 45 6e 63 6f 64 65 72 20 56 31 2e 35 2e 33 00 80 ')
  const stream = new h264tools.NALUStream(bits, { type: 'packet' })
  expect(stream.packetCount).toEqual(4)
  expect(stream.type).toEqual('packet')
  expect(stream.boxSizeMinusOne).toEqual(2)
  let count = 0
  for (const nalu of stream) {
    count++
  }
  expect(count).toEqual(stream.packetCount)
})

test('NALUStream constructor in packet mode, boxSize = 4', () => {
  const bits = makeArray('00 00 00 02 09 10   00 00 00 17 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8  00 00 00 04 68 ce 38 80  00 00 00 33 06 05 2f 02 f8 61 50 fc 70 41 72 b7 32 48 f3 a7 2a 3d 34 4d 69 63 72 6f 73 6f 66 74 20 48 2e 32 36 34 20 45 6e 63 6f 64 65 72 20 56 31 2e 35 2e 33 00 80 ')
  const stream = new h264tools.NALUStream(bits, { type: 'packet' })
  expect(stream.packetCount).toEqual(4)
  expect(stream.type).toEqual('packet')
  expect(stream.boxSizeMinusOne).toEqual(3)
  let count = 0
  for (const nalu of stream) {
    count++
  }
  expect(count).toEqual(stream.packetCount)
})
test('NALUStream constructor in packet mode, boxSize = 3, extra data at end', () => {
  const bits = makeArray('00 00 02    09 10      00 00 17 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8     00 00 04 68 ce 38 80     00 00 33 06 05 2f 02 f8 61 50 fc 70 41 72 b7 32 48 f3 a7 2a 3d 34 4d 69 63 72 6f 73 6f 66 74 20 48 2e 32 36 34 20 45 6e 63 6f 64 65 72 20 56 31 2e 35 2e 33 00 80 de ad be ef')
  const stream = new h264tools.NALUStream(bits, { type: 'packet' })
  expect(stream.packetCount).toEqual(4)

  let count = 0
  for (const nalu of stream) {
    count++
  }
  expect(count).toEqual(stream.packetCount)
})

test('NALUStream constructor in packet mode, boxSize = 4, extra bits at end', () => {
  const bits = makeArray('00 00 00 02 09 10   00 00 00 17 67 42 c0 1e 95 a0 28 0f 68 40 00 00 03 00 40 00 00 0f 03 68 22 11 a8  00 00 00 04 68 ce 38 80  00 00 00 33 06 05 2f 02 f8 61 50 fc 70 41 72 b7 32 48 f3 a7 2a 3d 34 4d 69 63 72 6f 73 6f 66 74 20 48 2e 32 36 34 20 45 6e 63 6f 64 65 72 20 56 31 2e 35 2e 33 00 80 de ad be ef')
  const stream = new h264tools.NALUStream(bits, { type: 'packet' })
  expect(stream.packetCount).toEqual(4)
  const packets = stream.packets
  expect(packets.length).toEqual(4)
})

test('NALUStream constructor in packet mode', () => {
  const stream = new h264tools.NALUStream(bit1, { type: 'packet' })
  expect(stream.packetCount).toEqual(7)
})

test('NALUStream constructor to guess packet mode', () => {
  const stream = new h264tools.NALUStream(bit1, { boxSizeMinusOne: 3 })
  expect(stream.packetCount).toEqual(7)
  expect(stream.type).toEqual('packet')
  expect(stream.boxSizeMinusOne).toEqual(3)
})

test('NALUStream constructor in Annex B with 4 byte sentinels, empty packet at end', () => {
  const stream = new h264tools.NALUStream(axb4emptyAtEnd)
  expect(stream.packetCount).toEqual(5)
})

test('NALUStream constructor in Annex B with 3 byte sentinels, empty packet at end', () => {
  const stream = new h264tools.NALUStream(axb3emptyAtEnd)
  expect(stream.packetCount).toEqual(5)
})
test('NALUStream constructor in Annex B, too short', () => {
  const tooShortb = makeArray('00 00 00')
  const stream = new h264tools.NALUStream(tooShortb)
  expect(stream.packetCount).toEqual(0)
})
test('NALUStream constructor in Annex, no first start code', () => {
  const stream = new h264tools.NALUStream(noFirstStartCodeb4)
  expect(stream.packetCount).toEqual(0)
})
test('NALUStream constructor in Annex, empty', () => {
  const stream = new h264tools.NALUStream(empty)
  expect(stream.packetCount).toEqual(0)
})
