import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'dataUser',
    initialState: {
        dataUser: null
    },
    reducers: {
        setDataUser: (state, action ) => {
            state.dataUser = action.payload.dataUser;
        },
    }
});


// Action creators are generated for each case reducer function
export const { setDataUser } = userSlice.actions;