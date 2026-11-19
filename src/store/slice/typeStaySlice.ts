import { createSlice } from '@reduxjs/toolkit';

export const typeStaySlice = createSlice({
    name: 'typeStay',
    initialState: {
        typeStay: []
    },
    reducers: {
        setTypeStay: (state, action ) => {
            state.typeStay = action.payload.typeStay;
        },
    }
});


// Action creators are generated for each case reducer function
export const { setTypeStay } = typeStaySlice.actions;