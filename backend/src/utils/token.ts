import jwt from "jsonwebtoken";
import EnvConfig from "../config/env.config.js";
import AppError from "./appError.js";
import crypto from 'crypto';

export interface MyJwtPayload{
    userId:string,
    email:string,
    sessionId:string
}

export const GenerateAccessToken = (payload:MyJwtPayload)=>{

    const accessTokenSecret = EnvConfig.token.access;

    if(!accessTokenSecret){
        throw new AppError(404,"Missing JWT credentials","JWT_SECRET_MISSING")
    }

    const token = jwt.sign(payload,accessTokenSecret);

    return token;
}

export const GenerateRefreshToken = (payload:MyJwtPayload)=>{

    const refreshTokenSecret = EnvConfig.token.refresh;

    if(!refreshTokenSecret){
        throw new AppError(404,"Missing JWT credentials","JWT_SECRET_MISSING")
    }

    const token = jwt.sign(payload,refreshTokenSecret);

    return token;
    
}

export const verifyToken = (token:string,secret:string)=>{

    const validToken = token.trim();
    const validSecret = secret.trim();

    if(!validToken){
        throw new AppError(400,"Invalid Jwt token","INVALID_TOKEN");
    }

    if(!validSecret){
        throw new AppError(400,"Missing Jwt credentials","JWT_SECRET_MISSING")
    }

    const decoded = jwt.verify(token,secret) as MyJwtPayload;

    return decoded;
}

export const HashToken = (token:string)=>{

    if(token.trim()){
        throw new AppError(400,"Invalid token to hash","INVALID_TOKEN");
    }

    const tokenHash = crypto.createHash("sha256").update(token.trim()).digest("hex");

    return tokenHash;
}