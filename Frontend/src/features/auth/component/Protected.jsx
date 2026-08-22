/* is component me ham wahi kaam karenge jo localstorage se karte the,
matlab koi bina login ke access na kre url copy krke */

import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import React from 'react'

const Protected = ({children}) => {
    const {loading,user}=useAuth();
    
    if(loading){
        return(<main>
            <h1>Loading...</h1>
        </main>)
    }
    if(!user){
       return <Navigate to={"/login"}/>
    }
  return children
}

export default Protected