import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

//creating a function for register 
 export async function register({username,email,password}) {
    
        const res=await axios.post(`${API_URL}/api/auth/register`,{
            username,email,password
        },{
            withCredentials:true
        })
        return res.data;

    
    
       
 }


 //creating a function for login

 export async function login({email,password}) {
    
        const res=await axios.post(`${API_URL}/api/auth/login`,{
            email,password
        },{
            withCredentials:true
        })
        console.log("RESPONSE DATA:", res.data);
        return res.data

    
  
 }


 //creating a function for logout
 export async function logout() {
    try{
        const res=await axios.get(`${API_URL}/api/auth/logout`,{
            withCredentials:true
        })
        return res.data
    }
    catch(err){
        console.log(err)
    }
    
 } 
  // creating a function for getMe
 export async function getMe() {
    try{
        const res=await axios.get(`${API_URL}/api/auth/get-me`,{
            withCredentials:true
        })
        return res.data

    }
    catch(err){
        console.log(err)
    }
    
 }


