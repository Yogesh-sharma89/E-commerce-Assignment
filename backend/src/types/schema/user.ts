import type { Types } from "mongoose";

export interface IUSER extends Document{
    fullname:string,
    email:string,
    password:string,
    role:string,
    profileUrl:string,
    profilePublicId:string,
}

export interface ISESSION extends Document{
    user:Types.ObjectId,
    refreshTokenHash:string,
    ip:string,
    expiresAt:Date,
    revokedAt?:Date,
    userAgent?:string 
}