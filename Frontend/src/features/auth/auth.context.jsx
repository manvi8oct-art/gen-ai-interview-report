
//context api without passing the props and can be accessed by the user
import { createContext, useState} from "react";

export const AuthContext = createContext(); //authcontext m hum loading , login user ki info store

export const AuthProvider = ({children}) => { //component //content h jo authprovider k andr likha
    const [user, setUser] = useState(null);
    const [loading , setLoading] = useState(true);

    return (
        <AuthContext.Provider value={{user,setUser,loading,setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}