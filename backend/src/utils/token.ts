import jwt from "jsonwebtoken";
import EnvConfig from "../config/env.config.js";
import AppError from "./appError.js";
import crypto from 'crypto';

type UserRole = "user" | "seller"
export interface MyJwtPayload {
    userId: string,
    email: string,
    sessionId: string,
    role:UserRole
}

export const GenerateAccessToken = (payload: MyJwtPayload) => {

    const accessTokenSecret = EnvConfig.token.access;

    if (!accessTokenSecret) {
        throw new AppError(404, "Missing JWT credentials", "JWT_SECRET_MISSING")
    }

    const token = jwt.sign(payload, accessTokenSecret);

    return token;
}

export const GenerateRefreshToken = (payload: MyJwtPayload) => {

    const refreshTokenSecret = EnvConfig.token.refresh;

    if (!refreshTokenSecret) {
        throw new AppError(404, "Missing JWT credentials", "JWT_SECRET_MISSING")
    }

    const token = jwt.sign(payload, refreshTokenSecret);

    return token;

}

type TokenType = "access" | "refresh";

export const verifyToken = (token: string, secret: string,type?:TokenType) => {

    const validToken = token.trim();
    const validSecret = secret.trim();

    if (!validToken) {
        throw new AppError(400, "Invalid Jwt token", "INVALID_TOKEN");
    }

    if (!validSecret) {
        throw new AppError(400, "Missing Jwt credentials", "JWT_SECRET_MISSING")
    }

    try {

        const decoded = jwt.verify(token, secret) as MyJwtPayload;

        if(!decoded || typeof decoded!=="object"){
            throw new AppError(401,`Malicious ${type} token detected`,"FAIL")
        }

        return decoded;

    } catch (err) {

        if(err instanceof jwt.TokenExpiredError){
            throw new AppError(401,`${type}  token is expired`,"TOKEN_EXPIRED")
        }

        if(err instanceof jwt.JsonWebTokenError){
            throw new AppError(401,`Invalid ${type} token`,"INVALID_TOKEN")
        }

        throw new AppError(401,"Unable to authenticate request","FAIL")

    }
}

export const HashToken = (token: string) => {

    if (!token.trim()) {
        throw new AppError(400, "Invalid token to hash", "INVALID_TOKEN");
    }

    const tokenHash = crypto.createHash("sha256").update(token.trim()).digest("hex");

    return tokenHash;
}