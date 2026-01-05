import { createSlice } from '@reduxjs/toolkit'

const videoShowSlice = createSlice({
  name: 'videoShow',
  initialState: {
    videoShow: false,
  },
  reducers: {
    setVideoShow(state, action) {
      state.videoShow = action.payload
    },
  },
})

export const { setVideoShow } = videoShowSlice.actions
export default videoShowSlice.reducer
