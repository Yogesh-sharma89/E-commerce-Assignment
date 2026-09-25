import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

},{
    timestamps:true
})

const UserModel = mongoose.model("user",userSchema);

export default UserModel;