import { createSlice } from '@reduxjs/toolkit'

// Utility to generate a random time (HH:MM) for today
const initialState = {
  listItems: [
    {
      name: '岳麓大道与旺龙路',
      direction: '由北向南',
      phase1: '红灯62秒',
      phase2: '绿灯82秒',
      phase3: '黄灯3秒',
      phase4: '红灯81秒',
      diff: '0',
    },
    {
      name: '岳麓大道与旺龙路',
      direction: '由北向南',
      phase1: '红灯62秒',
      phase2: '绿灯82秒',
      phase3: '黄灯3秒',
      phase4: '红灯81秒',
      diff: '0',
    },
    {
      name: '岳麓大道与旺龙路',
      direction: '由北向南',
      phase1: '红灯62秒',
      phase2: '绿灯82秒',
      phase3: '黄灯3秒',
      phase4: '红灯81秒',
      diff: '0',
    },
    {
      name: '岳麓大道与旺龙路',
      direction: '由北向南',
      phase1: '红灯62秒',
      phase2: '绿灯82秒',
      phase3: '黄灯3秒',
      phase4: '红灯81秒',
      diff: '0',
    },
    {
      name: '岳麓大道与旺龙路',
      direction: '由北向南',
      phase1: '红灯62秒',
      phase2: '绿灯82秒',
      phase3: '黄灯3秒',
      phase4: '红灯81秒',
      diff: '157秒',
    },
  ],
}

// const initialState = {
//   listItems: [],
// }

const greenSettingSlice = createSlice({
  name: 'greenSetting',
  initialState,
  reducers: {
    setGreenSettingList: (state, action) => {
      state.listItems = action.payload
    },
    clearGreenSetting: (state) => {
      state.listItems = []
    },
  },
})

export const { setGreenSettingList, clearGreenSetting } =
  greenSettingSlice.actions

export default greenSettingSlice.reducer
