import { createSlice } from '@reduxjs/toolkit';

export const unitSlice = createSlice({
    name: 'units',
    initialState: {
        isLoading: false,
        units:[],
        lastSearch:null
    },
    reducers: {
        startLoadingUnit: (state, action ) => {
            state.isLoading = true;
            state.lastSearch = action.payload.lastSearch;
        },
        setUnits: (state,action) =>{
            state.isLoading = false;
            state.units = action.payload.units;
        }
    }
});


// Action creators are generated for each case reducer function
export const { startLoadingUnit, setUnits } = unitSlice.actions;