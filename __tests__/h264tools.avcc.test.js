import { test, expect } from '@jest/globals'

const h264tools = require('../index.js')
const avccConfigs = require('./sampledata.js')

test('AvcC constructor with avcC array', () => {
  for (let i = 0; i < avccConfigs.length; i++) {
    const cfg = avccConfigs[i]
    if (cfg.avcC) {
      const options = { avcC: cfg.avcC }
      if (typeof cfg.strict === 'boolean') options.strict = cfg.strict
      const avc = new h264tools.AvcC(options)
      const avcArray = avc.avcC
      expect(avcArray).toEqual(cfg.avcC.subarray(0, avcArray.byteLength))
      expect(avc.pps[0]).toEqual(cfg.pps)
      expect(avc.sps[0]).toEqual(cfg.sps)
      expect(avc.MIME).toEqual(cfg.mime)
    }
  }
})
test('AvcC constructor with sps and pps', () => {
  for (let i = 0; i < avccConfigs.length; i++) {
    const cfg = avccConfigs[i]
    const options = { sps: cfg.sps, pps: cfg.pps }
    if (typeof cfg.strict === 'boolean') options.strict = cfg.strict
    const avc = new h264tools.AvcC(options)
    expect(avc.MIME).toEqual(cfg.mime)
    const avcArray = avc.avcC
    if (cfg.avcC) expect(avcArray).toEqual(cfg.avcC.subarray(0, avcArray.byteLength))
    expect(avc.pps[0]).toEqual(cfg.pps)
    expect(avc.sps[0]).toEqual(cfg.sps)
  }
})
