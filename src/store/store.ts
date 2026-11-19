import { configureStore } from "@reduxjs/toolkit";
import { allUnitSlice, companySlice, openingSlice, selUnitSlice, subgroupSlice, typeStaySlice, unitChkSlice } from "./slice";
import { unitSlice } from "./slice/unitSlice";
import { userSlice } from "./slice/userSlide";

export const store = configureStore({
    reducer: {
        dataUser:userSlice.reducer,
        selUnit:selUnitSlice.reducer,
        typeStay:typeStaySlice.reducer,
        units:unitSlice.reducer,
        opening:openingSlice.reducer,
        allUnit:allUnitSlice.reducer,
        company:companySlice.reducer        ,
        subgroup:subgroupSlice.reducer,
        unitChk:unitChkSlice.reducer
    },

    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        })
});