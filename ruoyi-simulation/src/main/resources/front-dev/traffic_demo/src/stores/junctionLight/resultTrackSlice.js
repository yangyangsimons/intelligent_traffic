// resultTrackSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  timeRange: '14:30:00-14:51:43',
  district1: '岳麓西大道',
  district2: '岳麓西大道',
  direction: '东向西', 
  data: [
    {
      name: '电警卡口',
      averageTime: '1.5',
      timeCompare: '5%',
      averageParking: '2',
      parkingCompare: '5%',
    },
    {
      name: '百度车轨迹',
      averageTime: '1.5',
      timeCompare: '5%',
      averageParking: '2',
      parkingCompare: '5%',
    },
  ],
};

const resultTrackSlice = createSlice({
  name: 'resultTrack',
  initialState,
  reducers: {
    setResultTrackData: (state, action) => {
      const { timeRange, district1, district2, direction, data } = action.payload;
      if (timeRange !== undefined) state.timeRange = timeRange;
      if (district1 !== undefined) state.district1 = district1;
      if (district2 !== undefined) state.district2 = district2;
      if (direction !== undefined) state.direction = direction;
      if (data !== undefined) state.data = data;
    },
  },
});

export const { setResultTrackData } = resultTrackSlice.actions;
export default resultTrackSlice.reducer;