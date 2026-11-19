import { createSlice } from '@reduxjs/toolkit';

export const companySlice = createSlice({
    name: 'company',
    initialState: {
        company:[]
    },
    reducers: {
        setCompany: (state,action) =>{
            state.company = action.payload.company;
        }
    }
});


// Action creators are generated for each case reducer function
export const { setCompany } = companySlice.actions;