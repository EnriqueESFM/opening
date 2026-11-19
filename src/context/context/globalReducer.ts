import { typesAuth } from "../types/typesAuth"

export const globalReducer = (state = {}, action) => {
    switch(action.type){
        case typesAuth.login:
            return {
                ...state,
                logged: true,
                user: action.payload
            }
        case typesAuth.logout:
            return {                
                logged: false,        
            }
        default:
            return state;
    }
}