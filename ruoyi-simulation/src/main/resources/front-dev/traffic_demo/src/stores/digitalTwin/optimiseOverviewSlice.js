import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  averageDelay: 2.42,
  congestionMileage: 7.0,
  averageSpeed: 5.2,
};

const optimiseOverviewSlice = createSlice({
  name: 'optimiseOverview',
  initialState,
  reducers: {
    setOptimiseOverview: (state, action) => {
      const { averageDelay, congestionMileage, averageSpeed } = action.payload;
      state.averageDelay = averageDelay;
      state.congestionMileage = congestionMileage;
      state.averageSpeed = averageSpeed;
    },
  },
});

export const { setOptimiseOverview } = optimiseOverviewSlice.actions;

export default optimiseOverviewSlice.reducer;