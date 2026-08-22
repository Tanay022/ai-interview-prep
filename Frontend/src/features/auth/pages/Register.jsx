import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';


const Register = () => {

  const {loading,handleRegister,res}=useAuth();
  const navigate=useNavigate();

  const[username,setUsername]=useState("")
  const[email,setEmail]=useState("")
  const[password,setPassword]=useState("")

   const  handlesubmit=async(e)=>{
    e.preventDefault();
    const success=await handleRegister({username,email,password});
    if(success){console.log("idhar tk to aaya ");navigate("/");}
   }
   if(loading){
    return(<main>
      <h1>Loading...</h1>
    </main>)
   }
  return (
    <main>
    <div className="form-container">
       <h1>Register</h1>
       <form onSubmit={handlesubmit}>
        <div className="input-group">
            <label htmlFor="username">Username</label>
            <input type='text' id='username' onChange={(e)=>setUsername(e.target.value)} placeholder='Enter username'/>
        </div>
        <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type='email' id='email' onChange={(e)=>setEmail(e.target.value)} placeholder='Enter email address'/>
        </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type='password' id='password' onChange={(e)=>setPassword(e.target.value)} placeholder='Enter your password'/>
        </div>
        <button className='button primary-button'>Register</button>
        <p style={{ color: "red" }}>{res}</p>
       </form>
       <p>Already have an account ? <Link to={"/login"}>Login</Link></p>
    </div>
    </main>
  )
}

export default Register