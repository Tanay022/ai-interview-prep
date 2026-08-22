const express=require('express');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authController=require('./controllers/authController');
const app=express();
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());  
const authRouter=require('./Routes/authRoutes');
const interviewRouter=require("./Routes/interviewRoutes")
app.use("/api/auth",authRouter);
app.use("/api/interview",interviewRouter)
module.exports=app