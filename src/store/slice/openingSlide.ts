import { createSlice } from '@reduxjs/toolkit';

export const openingSlice = createSlice({
    name: 'opening',
    initialState: {
        isLoading: false,
        type:1,
        opening: []
    },
    reducers: {
        startLoadingOpening: (state, /*action*/ ) => {
            state.isLoading = true;
        },
        setOpening: (state, action ) => {
            state.isLoading = false;
            state.opening = action.payload.opening;
            state.type = action.payload.type;
        },
    }
});


// Action creators are generated for each case reducer function
export const { startLoadingOpening, setOpening } = openingSlice.actions;