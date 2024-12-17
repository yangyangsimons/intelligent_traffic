// evaluationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  peakHourFlow: 885,      // 高峰小时流量
  twelveHourFlow: 20,     // 12小时流量
  position: '岳麓区',  // 位置
  content: '优化详情.' // 优化详情
};

const evaluationSlice = createSlice({
  name: 'evaluation',
  initialState,
  reducers: {
    setEvaluationData: (state, action) => {
      const { peakHourFlow, twelveHourFlow, position, content } = action.payload;
      if (peakHourFlow !== undefined) state.peakHourFlow = peakHourFlow;
      if (twelveHourFlow !== undefined) state.twelveHourFlow = twelveHourFlow;
      if (position !== undefined) state.position = position;
      if (content !== undefined) state.content = content;
    },
  },
});

export const { setEvaluationData } = evaluationSlice.actions;
export default evaluationSlice.reducer;