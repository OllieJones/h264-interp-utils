'use strict'

const h264tools = require('../index.js')
const avccConfigs = require('./sampledata.js')

// http://iphome.hhi.de/suehring/tml/doc/ldec/html/parset_8c_source.html

test('PPS parser PPS', () => {
  for (let i = 0; i < avccConfigs.length; i++) {
    const cfg = avccConfigs[i]
    const pps = new h264tools.PPS(cfg.pps)
    expect(pps.success).toBeTruthy()
    let entropyCodingMode = pps.entropyCodingMode
    expect(entropyCodingMode).toEqual(cfg.entropyCodingMode)
  }
})

test('PPS parser PPS from avcC', () => {
  for (let i = 0; i < avccConfigs.length; i++) {
    const cfg = avccConfigs[i]
    if (cfg.avcC) {
      const avc = new h264tools.AvcC({ avcC: cfg.avcC })
      expect(avc.pps.length).toBeGreaterThanOrEqual(1)
      for (let p = 0; p < avc.pps.length; p++) {
        const pps = new h264tools.PPS(avc.pps[p])
        expect(pps.success).toBeTruthy()
        let entropyCodingMode = pps.entropyCodingMode
        expect(entropyCodingMode).toEqual(cfg.entropyCodingMode)
      }
    }
  }
})
