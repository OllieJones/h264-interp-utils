'use strict'

const h264tools = require('../index.js')
const avccConfigs = require('./sampledata.js')

// http://iphome.hhi.de/suehring/tml/doc/ldec/html/parset_8c_source.html

test('SPS parser SPS', () => {
  for (let i = 0; i < avccConfigs.length; i++) {
    const cfg = avccConfigs[i]
    const sps = new h264tools.SPS(cfg.sps)
    expect(sps.success).toBeTruthy()
    expect(sps.MIME).toEqual(cfg.mime)
  }
})

test('SPS parser SPS from avcC', () => {
  for (let i = 0; i < avccConfigs.length; i++) {
    const cfg = avccConfigs[i]
    if (cfg.avcC) {
      const avc = new h264tools.AvcC({ avcC: cfg.avcC })
      expect(avc.sps.length).toBeGreaterThanOrEqual(1)
      for (let p = 0; p < avc.sps.length; p++) {
        const sps = new h264tools.SPS(avc.sps[p])
        expect(sps.success).toBeTruthy()
        expect(sps.MIME).toEqual(cfg.mime)
      }
    }
  }
})
