import { useContext, useEffect } from "react" //context ke andr ka data nikalana
import { AuthContext } from "../auth.context"
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {  //wrapper function,, custom hook
    const context = useContext(AuthContext) 
    const{user,setUser,loading,setLoading} = context



    //jbtk login vali api call ni hori tb tk loading screen show 
    const handleLogin = async ({email, password}) => {
        setLoading(true) //jese hi login start loading start otherwise false means no loading
    try{
        const data = await login({email , password}) //server ko email pass bhejega and waits for his call
    setUser(data.user) //api se jo call usse save, api se jo info aai vo data m save
    } catch(err){
        
    } finally{
    setLoading(false)
    }
}

    const handleRegister = async ({username, email , password}) => {
        setLoading(true)
        try{
    const data = await register({username,email,password})
    setUser(data.user)
        } catch(err) {

        } finally{
    setLoading(false)
    }
}

    const handleLogout = async() => {
        setLoading(true)
        try{
        const data = await logout()
        setUser(null)
        } catch(err) {

        }finally{
        setLoading(false)
    }
}

useEffect(() => {
    const getAndSetUser = async () => {
        try {
            const data = await getMe()
            setUser(data.user)
        } catch (err) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    getAndSetUser()
}, [])


    return {user, loading, handleLogin, handleRegister, handleLogout}

}