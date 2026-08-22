const mongoose=require('mongoose');
async function connectToDB(){
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to database")
    }
    catch(err){
        console.error("Failed to connect to MongoDB:", err.message)
        process.exit(1)
    }
}
module.exports=connectToDB