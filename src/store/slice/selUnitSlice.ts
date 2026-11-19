import { createSlice } from '@reduxjs/toolkit';

export const selUnitSlice = createSlice({
    name: 'selUnit',
    initialState: {
        selUnit: null
    },
    reducers: {
        setUnit: (state, action ) => {
            state.selUnit = action.payload.selUnit;
        },
    }
});


// Action creators are generated for each case reducer function
export const { setUnit } = selUnitSlice.actions;