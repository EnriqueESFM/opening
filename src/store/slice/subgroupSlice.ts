import { createSlice } from '@reduxjs/toolkit';

export const subgroupSlice = createSlice({
    name: 'subgroup',
    initialState: {
        subgroup: []
    },
    reducers: {
        setSubgroup: (state,action) =>{
            state.subgroup = action.payload.subgroup;
        }
    }
});


// Action creators are generated for each case reducer function
export const { setSubgroup } = subgroupSlice.actions;