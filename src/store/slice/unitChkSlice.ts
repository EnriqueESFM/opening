import { createSlice } from '@reduxjs/toolkit';

export const unitChkSlice = createSlice({
    name: 'unitChk',
    initialState: {
        unitChk: []
    },
    reducers: {
        setUnitChk: (state,action) =>{
            state.unitChk = action.payload.unitChk;
        }
    }
});


// Action creators are generated for each case reducer function
export const { setUnitChk } = unitChkSlice.actions;