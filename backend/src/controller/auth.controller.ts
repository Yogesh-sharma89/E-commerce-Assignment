import { Types } from "mongoose";
import asyncHandler from "../middleware/asyncHandler.js";
import UserModel from "../models/user.model.js";
import AppError from "../utils/appError.js";
import { registerSchema } from "../validations/register.js";
import bcrypt from "bcryptjs";

import SessionModel from "../models/session.model.js";

export const Register = asyncHandler(async(req,res)=>{

    const validatedData = registerSchema.safeParse(req.body);

    if(!validatedData.success){

        const message = validatedData.error.issues
            .map((issue) => issue.message)
            .join(", ");

        throw new AppError(400, message || "Validation failed", "FAIL");
    }

    const {fullname,email,password} = validatedData.data;

    //check if user exists 

    const user = await UserModel.findOne({email});

    if(user){
        throw new AppError(409,"User already exists with this email","CONFLICT")
    }

    //Create user 
    const passwordHash = await bcrypt.hash(password,10);

    const newUser = await UserModel.create({
        fullname,
        email,
        password:passwordHash
    })

    //now create the user session 
    const sessionId = new Types.ObjectId();

    const payload = {
        userId:newUser._id.toString(),
        sessionId:sessionId.toString(),
        email:newUser.email
    }

    //generate refresh token

    const session = await SessionModel.create({

        user:newUser._id,
        refreshTokenHash
    })

})

export const Login = asyncHandler(async(req,res)=>{
    
})

export const RefreshSession = asyncHandler(async(req,res)=>{
    
})


export const GetCurrentUser = asyncHandler(async(req,res)=>{
    
})

export const Logout = asyncHandler(async(req,res)=>{
    
})