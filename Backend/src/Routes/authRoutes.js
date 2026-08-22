const express=require('express');
const authRouter=express.Router()
const authController=require('../controllers/authController');
const authMiddleware=require("../middlewares/authmiddleware")

authRouter.post("/register", authController.createUser);
authRouter.post("/login",authController.userlogin);
authRouter.get("/logout",authController.userlogout);
authRouter.get("/get-me",authMiddleware.authUser,authController.getMe)

module.exports=authRouter;