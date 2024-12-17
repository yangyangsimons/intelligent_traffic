// signalJunctionSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    listItems: [
        {
            name: '尖山路与岳麓西大道交叉口',
            index: 1,
            trend: 18.53,
        },
        {
            name: '青山路与尖山路交叉口',
            index: 3,
            trend: 20.53,
        },
        {
            name: '旺龙路与青山路交叉口',
            index: 4,
            trend: 15.53,
        },
        {
            name: '旺龙路与青山路交叉口',
            index: 4,
            trend: 15.53,
        },
    ],
};

const signalJunctionSlice = createSlice({
    name: 'signalJunction',
    initialState,
    reducers: {
        setListItems: (state, action) => {
            state.listItems = action.payload;
        },
    },
});

export const { setListItems } = signalJunctionSlice.actions;

export default signalJunctionSlice.reducer;