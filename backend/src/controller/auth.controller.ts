import { Types } from "mongoose";
import asyncHandler from "../middleware/asyncHandler.js";
import UserModel from "../models/user.model.js";
import AppError from "../utils/appError.js";
import { registerSchema } from "../validations/register.js";
import bcrypt from "bcryptjs";

import SessionModel from "../models/session.model.js";
import { GenerateAccessToken, GenerateRefreshToken, HashToken, verifyToken } from "../utils/token.js";
import EnvConfig from "../config/env.config.js";
import { loginSchema } from "../validations/login.js";

export const Register = asyncHandler(async (req, res) => {

    const validatedData = registerSchema.safeParse(req.body);

    if (!validatedData.success) {

        const message = validatedData.error.issues
            .map((issue) => issue.message)
            .join(", ");

        throw new AppError(400, message || "Validation failed", "FAIL");
    }

    const { fullname, email, password } = validatedData.data;

    //check if user exists 

    const user = await UserModel.findOne({ email });

    if (user) {
        throw new AppError(409, "User already exists with this email", "CONFLICT")
    }

    //Create user 
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
        fullname,
        email,
        password: passwordHash
    })

    //now create the user session 
    const sessionId = new Types.ObjectId();

    const payload = {
        userId: newUser._id.toString(),
        sessionId: sessionId.toString(),
        email: newUser.email,
        role:newUser.role
    }

    //generate refresh token
    const refreshToken = GenerateRefreshToken(payload);

    //hash the refresh token
    const refreshTokenHash = HashToken(refreshToken);

    const REFRESH_TOKEN_EXPIRES = 7 * 24 * 60 * 60 * 1000;

    await SessionModel.create({
        _id: sessionId,
        user: newUser._id,
        refreshTokenHash,
        ip: req.ip ?? "unknown",
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES),
        userAgent: req.headers["user-agent"] ?? "unknown",
    })

    //now create access token also 
    const accessToken = GenerateAccessToken(payload);

    //now set both token in cookies

    const cookieConfig = {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: EnvConfig.environment === 'production',
        maxAge: 20 * 60 * 1000
    }

    res.cookie("accessToken", accessToken, {
        ...cookieConfig
    })

    res.cookie("refreshToken", refreshToken, {
        ...cookieConfig, maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        success: true,
        message: "User account created successfully",
        data: {
            user: {
                id: newUser._id,
                name: newUser.fullname,
                email: newUser.email,
                profileUrl: newUser.profileUrl
            }
        }
    })

})

export const Login = asyncHandler(async (req, res) => {

    const validLoginData = loginSchema.safeParse(req.body);

    if (!validLoginData.success) {

        const message = validLoginData.error.issues.map((issue) => issue.message).join(", ");

        throw new AppError(400, message || "Validation failed", "FAIL")
    }

    const { email, password } = validLoginData.data;

    //check for user 
    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new AppError(404, "User account doesn't exists. Please register.", "NO_ACCOUNT_EXISTS");
    }

    //user exists then check for password

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
    }

    //then create session

    const sessionId = new Types.ObjectId();

    const payload = {
        userId: user._id.toString(),
        sessionId: sessionId.toString(),
        email: user.email,
        role:user.role
    }

    //generate refresh token
    const refreshToken = GenerateRefreshToken(payload);

    //hash the refresh token
    const refreshTokenHash = HashToken(refreshToken);

    const REFRESH_TOKEN_EXPIRES = 7 * 24 * 60 * 60 * 1000;

    await SessionModel.create({
        _id: sessionId,
        user: user._id,
        refreshTokenHash,
        ip:req.ip ?? "unknown",
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRES),
        userAgent: req.headers["user-agent"] ?? "unknown",
    })

    //now create access token also 
    const accessToken = GenerateAccessToken(payload);

    //now set both token in cookies

    const cookieConfig = {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: EnvConfig.environment === 'production',
        maxAge: 20 * 60 * 1000
    }

    res.cookie("accessToken", accessToken, {
        ...cookieConfig
    })

    res.cookie("refreshToken", refreshToken, {
        ...cookieConfig, maxAge: 7 * 24 * 60 * 60 * 1000
    })

    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        data: {
            user: {
                id: user._id,
                name: user.fullname,
                email: user.email,
                profileUrl: user.profileUrl
            }
        }
    })


})

export const RefreshSession = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies?.refreshToken;

    const validRefreshToken = refreshToken.trim();

    if (!validRefreshToken) {
        throw new AppError(401, "Refresh token is missing", "FAIL");
    }

    //verify refresh token 

    const decoded = verifyToken(validRefreshToken, EnvConfig.token.refresh!, "refresh");

    const session = await SessionModel.findById(decoded.sessionId);

    //If session do not exist 
    if (!session) {

        //clear the cookies 
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        throw new AppError(401, "Session is invalid or expired", "FAIL");
    }

    //Session exists then check it expiry 

    if (session.expiresAt <= new Date(Date.now())) {
        //session has expired
        await SessionModel.findByIdAndDelete(session._id);

        //clear the cookies 
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        throw new AppError(401, "Session has expired", "FAIL")

    }

    //Now check refresh token is valid
    const refreshTokenHash = HashToken(validRefreshToken);

    if (session.refreshTokenHash !== refreshTokenHash) {

        await SessionModel.findByIdAndDelete(session._id);

        //clear the cookies 
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        throw new AppError(401, "Invalid refrest token", "FAIL")
    }


    //Now rotate the refresh token 

    const newRefreshToken = GenerateRefreshToken(decoded);

    const newAccessToken = GenerateAccessToken(decoded);

    const newRefreshTokenHash = HashToken(newRefreshToken);

    //update the session
    await SessionModel.findByIdAndUpdate(session._id, {
        refreshTokenHash: newRefreshTokenHash
    })

    //set the cookies
    const cookieOptions = {
        httpOnly: true,
        sameSite: "lax" as const,
        secure: EnvConfig.environment === "production",
        maxAge: 20 * 60 * 1000
    }

    res.cookie("accessToken", newAccessToken,{
      ...cookieOptions
    })

    res.cookie("refreshToken",newRefreshToken,{
        ...cookieOptions,maxAge:7*24*60*60*1000
    })

    return res.status(200).json({
        success:true,
        message:"Token refreshed successfully",
    })


})


export const GetCurrentUser = asyncHandler(async (req, res) => {

    const currentUser = req.user;

    const user = await UserModel.findById(currentUser?.userId).lean();


    return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: {
            user: {
                id: user?._id,
                email: user?.email,
                name: user?.fullname,
                profileUrl: user?.profileUrl
            }
        }
    })

})

export const Logout = asyncHandler(async (req, res) => {

    const currentUser = req.user;

    //check this user exists on not 

    const user = await UserModel.findById(currentUser?.userId).lean();

    if(!user){
        throw new AppError(404,"User doesn't exists","FAIL")
    }

    //find the session 
    const session = await SessionModel.findById(currentUser.sessionId).lean();

    if(session){

        //then delete It 
        await SessionModel.deleteOne({_id:session._id});
    }

    //otherwise logout would have happen
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({
        success:true,
        message:"User logged out successfully"
    })

})