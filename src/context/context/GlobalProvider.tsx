import { useReducer } from "react"
import { GlobalContext } from "./GlobalContext";
import { globalReducer } from "./globalReducer"

const init = ()=>{
    const user = JSON.parse(localStorage.getItem('user') as any);

    return { logged: !!user ? 
                            (typeof user.lastLogin == 'undefined' ? 
                                                                    false : (new Date()).getTime() - (new Date()).setDateTimeString(user.lastLogin).getTime() <= 30*60000
                            ): false,
              user};
}

export const GlobalProvider = ({children}) => {
    const [globalState] = useReducer(globalReducer,{},init);
    const login = (user) =>{

    }

    const logout = () =>{
        
    }
  return (
    <GlobalContext.Provider value={{
        ...globalState as any,
        login,
        logout
    }}>
      {children}
    </GlobalContext.Provider>
  )
}
