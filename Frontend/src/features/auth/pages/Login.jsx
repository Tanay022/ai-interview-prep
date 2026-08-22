import React, { useState } from 'react'
import "../auth.form.scss"
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const Login = () => {

  const{loading,handleLogin,res} = useAuth()
  const navigate=useNavigate()

  const [email , setEmail] = useState("")
  const [password , setPassword] = useState("")

  const handlesubmit=async(e)=>{
    e.preventDefault();
    const success=await handleLogin({email,password})
    
     if (success) {
        navigate("/");
    }
  }
  if(loading){
    return(
    <main>
      <h1>Loading...</h1>
    </main>)
  }

    
  
  return (
    <main>
    <div className="form-container">
       <h1>Login</h1>
       <form onSubmit={handlesubmit}>
        <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type='email' id='email' onChange={(e)=>setEmail(e.target.value)} placeholder='Enter email address'/>
        </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input type='password' id='password' onChange={(e)=>setPassword(e.target.value)} placeholder='Enter your password'/>
        </div>
        <button className='button primary-button'>Login</button>
         <p style={{ color: "red" }}>{res}</p>
       
       </form>
        
        <p>Don't have an account ? <Link to={"/register"}>Register</Link></p>
    </div>
    </main>
  )
}

export default Login