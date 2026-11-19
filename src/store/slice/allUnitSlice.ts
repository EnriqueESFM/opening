import { createSlice } from '@reduxjs/toolkit';

export const allUnitSlice = createSlice({
    name: 'allUnit',
    initialState: {
        allUnit: []
    },
    reducers: {
        setAllUnit: (state,action) =>{
            state.allUnit = action.payload.allUnit;
        }
    }
});


// Action creators are generated for each case reducer function
export const { setAllUnit } = allUnitSlice.actions;