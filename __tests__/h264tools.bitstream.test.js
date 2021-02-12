'use strict'

const h264tools = require('../index.js')
const avccConfigs = require('./sampledata.js')


// http://iphome.hhi.de/suehring/tml/doc/ldec/html/parset_8c_source.html

test('Bitstream parser PPS NALUs', () => {
  for (let i = 0; i < avccConfigs.length; i++) {
    const cfg = avccConfigs[i]
    const bitstream = new h264tools.Bitstream(cfg.pps)

    const forbidden_zero_bit = bitstream.u_1()
    expect(forbidden_zero_bit).toEqual(0)
    const nal_ref_id = bitstream.u_2()
    const nal_unit_type = bitstream.u(5)
    expect(bitstream.consumed & 0x07).toEqual(0)

    const pic_parameter_set_id = bitstream.ue_v()
    const seq_parameter_set_id = bitstream.ue_v()
    /* 0 = CALVC,  1 = CABAC */
    const entropy_coding_mode_flag = bitstream.u_1()
    const bottom_field_pic_order_in_frame_present_flag = bitstream.u_1()
    const num_slice_groups_minus1 = bitstream.ue_v()
    if (num_slice_groups_minus1 > 0) {
      const slice_group_map_type = bitstream.ue_v()
      switch (slice_group_map_type) {
        case 0:
          for (i = 0; i <= num_slice_groups_minus1; i++) {
            const run_length_minus1 = bitstream.ue(v)
          }
          break
        case 1:  /* there is no case 1 */
          break
        case 2:
          for (i = 0; i <= num_slice_groups_minus1; i++) {
            const top_left = bitstream.ue_v()
            const bottom_right = bitstream.ue_v()
            expect(top_left).toBeLessThanOrEqual(bottom_right)
          }
          break
        case 3:
        case 4:
        case 5:
          expect(num_slice_groups_minus1).toEqual(1)
          const slice_group_change_direction_flag = bitstream.u_1()
          const slice_group_change_rate_minus1 = bitstream.ue_v()
          break
        case 6:
          let NumberBitsPerSliceGroupId
          if (num_slice_groups_minus1 + 1 > 4) {
            NumberBitsPerSliceGroupId = 3
          } else if (num_slice_groups_minus1 + 1 > 2) {
            NumberBitsPerSliceGroupId = 2
          } else {
            NumberBitsPerSliceGroupId = 1
          }
          const pic_size_in_map_units_minus1 = bitstream.ue_v()
          for (let i = 0; i <= pic_size_in_map_units_minus1; i++) {
            const slice_group_id = bitstream.u(NumberBitsPerSliceGroupId)
            expect(slice_group_id).toBeLessThanOrEqual(num_slice_groups_minus1)
          }
          break
      }
    }
    const num_ref_idx_l0_active_minus1 = bitstream.ue_v()
    expect(num_ref_idx_l0_active_minus1).toBeLessThanOrEqual(31)
    const num_ref_idx_l1_active_minus1 = bitstream.ue_v()
    expect(num_ref_idx_l1_active_minus1).toBeLessThanOrEqual(31)
    const weighted_pred_flag = bitstream.u_1()
    const weighted_bipred_idc = bitstream.u_2()
    const pic_init_qp_minus26 = bitstream.se_v()
    expect(pic_init_qp_minus26).toBeLessThanOrEqual(25)
    const pic_init_qs_minus26 = bitstream.se_v()
    expect(pic_init_qs_minus26).toBeLessThanOrEqual(25)

    const deblocking_filter_control_present_flag = bitstream.u_1()
    const constrained_intra_pred_flag = bitstream.u_1()
    const redundant_pic_cnt_present_flag = bitstream.u_1()

  }
})

test('Bitstream parser SPS NALUs', () => {
  for (let i = 0; i < avccConfigs.length; i++) {
    const cfg = avccConfigs[i]
    const bitstream = new h264tools.Bitstream(cfg.sps)

    const foo = bitstream.peek16

    const forbidden_zero_bit = bitstream.u_1()
    expect(forbidden_zero_bit).toEqual(0)
    const nal_ref_id = bitstream.u_2()
    const nal_unit_type = bitstream.u(5)
    expect(bitstream.consumed & 0x07).toEqual(0)

    const profile_idc = bitstream.u_8()
    expect(bitstream.consumed & 0x07).toEqual(0)

    const constraint_set0_flag = bitstream.u_1()
    const constraint_set1_flag = bitstream.u_1()
    const constraint_set2_flag = bitstream.u_1()
    const constraint_set3_flag = bitstream.u_1()
    const constraint_set4_flag = bitstream.u_1()
    const constraint_set5_flag = bitstream.u_1()
    const reserved_zero_2bits = bitstream.u_2()
    expect(reserved_zero_2bits).toEqual(0)
    expect(bitstream.consumed & 0x07).toEqual(0)

    const level_idc = bitstream.u_8()
    expect(bitstream.consumed & 0x07).toEqual(0)

    const seq_parameter_set_id = bitstream.ue_v()
    expect(seq_parameter_set_id).toBeGreaterThanOrEqual(0)
    expect(seq_parameter_set_id).toBeLessThanOrEqual(31)

    const has_no_chroma_format_idc = (profile_idc === 66 || profile_idc === 77 || profile_idc === 88)

    if (!has_no_chroma_format_idc) {
      const chroma_format_idc = bitstream.ue_v()
      expect(chroma_format_idc).toBeGreaterThanOrEqual(0)
      expect(chroma_format_idc).toBeLessThanOrEqual(3)
      if (chroma_format_idc === 3) {  /* 3 = YUV444 */
        const separate_colour_plane_flag = bitstream.u_1()
        const chromaArrayType = separate_colour_plane_flag ? 0 : chroma_format_idc
      }
      const bit_depth_luma_minus8 = bitstream.ue_v()
      expect(bit_depth_luma_minus8).toBeGreaterThanOrEqual(0)
      expect(bit_depth_luma_minus8).toBeLessThanOrEqual(6)
      const bit_depth_chroma_minus8 = bitstream.ue_v()
      expect(bit_depth_chroma_minus8).toBeGreaterThanOrEqual(0)
      expect(bit_depth_chroma_minus8).toBeLessThanOrEqual(6)
      const lossless_qpprime_flag = bitstream.u_1()
      const seq_scaling_matrix_present_flag = bitstream.u_1()
      if (seq_scaling_matrix_present_flag) {
        const n_ScalingList = (chroma_format_idc !== 3) ? 8 : 12
        for (let i = 0; i < n_ScalingList; i++) {
          const seq_scaling_list_present_flag = bitstream.u_1()
          if (seq_scaling_list_present_flag) {
            const sizeOfScalingList = i < 6 ? 16 : 64
            let nextScale = 8
            let lastScale = 8
            for (let j = 0; j < sizeOfScalingList; j++) {
              if (nextScale !== 0) {
                const delta_scale = bitstream.se_v()
                nextScale = (lastScale + delta_scale + 256) % 256
              }
              lastScale = (nextScale === 0) ? lastScale : nextScale
            }
          }
        }
      }
    }

    const log2_max_frame_num_minus4 = bitstream.ue_v()
    expect(log2_max_frame_num_minus4).toBeGreaterThanOrEqual(0)
    expect(log2_max_frame_num_minus4).toBeLessThanOrEqual(12)
    const maxFrameNum = 1 << (log2_max_frame_num_minus4 + 4)

    const pic_order_cnt_type = bitstream.ue_v()
    expect(pic_order_cnt_type).toBeGreaterThanOrEqual(0)
    expect(pic_order_cnt_type).toBeLessThanOrEqual(2)

    switch (pic_order_cnt_type) {
      case 0:
        const log2_max_pic_order_cnt_lsb_minus4 = bitstream.ue_v()
        expect(log2_max_pic_order_cnt_lsb_minus4).toBeGreaterThanOrEqual(0)
        expect(log2_max_pic_order_cnt_lsb_minus4).toBeLessThanOrEqual(12)
        const maxPicOrderCntLsb = 1 << (log2_max_pic_order_cnt_lsb_minus4 + 4)
        break
      case 1:
        const delta_pic_order_always_zero_flag = bitstream.u_1()
        const offset_for_non_ref_pic = bitstream.se_v()
        const offset_for_top_to_bottom_field = bitstream.se_v()
        let expectedDeltaPerPicOrderCntCycle = 0
        const num_ref_frames_in_pic_order_cnt_cycle = bitstream.ue_v()
        for (let i = 0; i < num_ref_frames_in_pic_order_cnt_cycle; i++) {
          const offset_for_ref_frame = bitstream.se_v()
          expectedDeltaPerPicOrderCntCycle += offset_for_ref_frame
        }
        break
      case 2:
        break
      default:
        throw new Error('incorrect value of pic_order_cnt_type')
    }

    const max_num_ref_frames = bitstream.ue_v()
    const gaps_in_frame_num_value_allowed_flag = bitstream.u_1()
    const pic_width_in_mbs_minus_1 = bitstream.ue_v()
    const picWidth = (pic_width_in_mbs_minus_1 + 1) << 4
    const pic_height_in_map_units_minus_1 = bitstream.ue_v()
    const frame_mbs_only_flag = bitstream.u_1()
    if (frame_mbs_only_flag === 0) { /* 1 if frames rather than fields (no interlacing) */
      const frameHeight = ((2 - frame_mbs_only_flag) * (pic_height_in_map_units_minus_1 + 1)) << 4
      const mb_adaptive_frame_field_flag = bitstream.u_1()
    }

    const direct_8x8_inference_flag = bitstream.u_1()
    const frame_cropping_flag = bitstream.u_1()
    if (frame_cropping_flag) {
      const frame_cropping_rect_left_offset = bitstream.ue_v()
      const frame_cropping_rect_right_offset = bitstream.ue_v()
      const frame_cropping_rect_top_offset = bitstream.ue_v()
      const frame_cropping_rect_bottom_offset = bitstream.ue_v()
    }
    const vui_prameters_present_flag = bitstream.u_1()

  }
})
