import mongoose from "mongoose";
import type { IUSER } from "../types/schema/user.js";
import { EMAIL_REGEX } from "../constant/regex.js";




const userSchema = new mongoose.Schema<IUSER>({

    fullname: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        min: [3, "Fullname should have minimum 3 characters"],
        max: [30, "Fullname must not exceed 30 characters"]
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true,
        unique: true,
        index:true,
        validate:{
            validator:(val)=>EMAIL_REGEX.test(val),
            message:"Invalid Email address"
        }
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    role:{
        type:String,
        enum:["user","seller"],
        default:"user",
        required:true
    },

    profileUrl: {
        type: String,
        default: ""
    },

    profilePublicId: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
})

const UserModel = mongoose.model("user", userSchema);

export default UserModel;