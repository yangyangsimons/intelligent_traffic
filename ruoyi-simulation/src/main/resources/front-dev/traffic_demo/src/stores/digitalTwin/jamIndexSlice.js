import { createSlice } from "@reduxjs/toolkit";

const jamIndexSlice = createSlice({
    name: "controlModule",
    initialState: [{
        name: "旺龙路",
        status: "拥堵",
        direction: "方向： 东向西",
        length: "2.1",
        index: "6.2"
    }, {
        name: "尖山路",
        status: "拥堵",
        direction: "方向： 东向西",
        length: "1.2",
        index: "4.8"
    }],
    reducers: {
        setJamIndex: (state, action) => {
            return [...action.payload];
        },
    },
});

export const { setJamIndex } = jamIndexSlice.actions;
export default jamIndexSlice.reducer;