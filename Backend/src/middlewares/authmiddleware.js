const jwt=require('jsonwebtoken');
const BlacklistedTokens=require("../models/blacklistmodel")

// creating  a function to verify token and also users identity

 async function authUser(req,res,next){
    const token=req.cookies.token
    if(!token){
        return res.status(401).json({message:"Token Required"});
          }
          const isTokenBlacklisted=await BlacklistedTokens.findOne({token});
          if(isTokenBlacklisted){
            return res.status(401).json({message:"Token is invalid"})
          }

     try{
        const decoded = await jwt.verify(token,process.env.JWT_SECRET)
        req.user=decoded;
        next();

     }
     catch(err){
        return res.status(401).json({message:"Invalid Token"})
     }
    

 }
 module.exports={authUser}