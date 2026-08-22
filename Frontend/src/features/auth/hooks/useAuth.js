import { useContext, useEffect } from "react";
import { login,logout,register,getMe } from "../services/auth.api";
import { AuthContext } from "../auth.context";
import { useState } from "react";

export const useAuth=()=> {
    const context = useContext(AuthContext);
    const [res,setRes]=useState("")
    const {user,setUser,loading,setLoading}=context;
     
    const handleLogin=async({email,password})=>{
        console.log("handleLogin fired")
        setLoading(true);
        try{
        const data=await login({email,password});
        setUser(data.user);
        return true
        }
        catch(err){
            console.log("ERROR:", err.response?.data?.message);
            setRes(err.response?.data?.message || "Something went wrong. Please try again.")
             
            return false
        }
        finally{
        setLoading(false)}
    }

     const handleRegister=async({username,email,password})=>{
        setLoading(true);
        try{
        const data=await register({username,email,password});
        setUser(data.user);return true}
        catch(err){ setRes(err.response?.data?.message || "Something went wrong. Please try again.")
             return false}
        finally{
        setLoading(false)}
    }

     const handleLogout=async()=>{
        setLoading(true);
        try{
        const data=await logout();
        setUser(null);return true;}
        catch(err){return false;}
        finally{
        setLoading(false)}
    }

        useEffect(()=>{
             const getAndSetUser=async()=>{
          
                try{
       
            const data=await getMe();
            setUser(data.user);
        }
            catch(err){}
            
            finally{
            setLoading(false)
            }
        }
        getAndSetUser();

    },[])

    return {user,loading,handleLogin,handleRegister,handleLogout,res}
    
}


