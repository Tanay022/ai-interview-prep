require("dotenv").config()
const app = require("./src/app");
const connectToDB=require('./src/Config/database')

connectToDB()
app.listen(process.env.PORT || 3000,()=>{
    console.log("server is running at http://localhost:3000")
})