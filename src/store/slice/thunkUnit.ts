import { filterUnit } from "../../provider";
import { setUnits, startLoadingUnit } from "./unitSlice";

export const getUnits = (filter) => { 
    return async(dispatch) => {
        dispatch(startLoadingUnit({lastSearch:filter}));
        const response = await filterUnit(filter);
         console.log(response);
        if(response.statusCode == 200)
            dispatch(setUnits({units: response.unit}));
    };
}