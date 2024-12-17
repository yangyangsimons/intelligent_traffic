// src/store/trafficLightsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    north: {
        left: {
            redDurationTime: 30,
            greenDurationTime: 40,
            initialLight: 'red',
        },
        forward: {
            redDurationTime: 35,
            greenDurationTime: 45,
            initialLight: 'green',
        },
    },
    east: {
        left: {
            redDurationTime: 28,
            greenDurationTime: 38,
            initialLight: 'red',
        },
        forward: {
            redDurationTime: 33,
            greenDurationTime: 43,
            initialLight: 'green',
        },
    },
    south: {
        left: {
            redDurationTime: 32,
            greenDurationTime: 42,
            initialLight: 'red',
        },
        forward: {
            redDurationTime: 37,
            greenDurationTime: 47,
            initialLight: 'green',
        },
    },
    west: {
        left: {
            redDurationTime: 25,
            greenDurationTime: 35,
            initialLight: 'red',
        },
        forward: {
            redDurationTime: 30,
            greenDurationTime: 40,
            initialLight: 'green',
        },
    },
};

const lightControlSlice = createSlice({
    name: 'lightControl',
    initialState,
    reducers: 
    {
            setLight: (state, action) => {
                // 假设 action.payload 是与 initialState 结构一致的对象
                return action.payload;
            },
    },
});

export const { setLight } = lightControlSlice.actions;

export default lightControlSlice.reducer; 