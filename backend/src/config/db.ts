import mongoose from "mongoose";
import EnvConfig from "./env.config.js";

const ConnectDb = async()=>{
    try{
         await mongoose.connect(EnvConfig.db.url!);
         console.log("MongoDB connected successfully ✅")
    }catch(err){
      console.log("Failed to connect with database :",err)
    }
}

export default ConnectDb;