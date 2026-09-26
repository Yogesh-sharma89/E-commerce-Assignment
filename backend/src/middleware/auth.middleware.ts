import EnvConfig from "../config/env.config.js";
import AppError from "../utils/appError.js";
import { verifyToken } from "../utils/token.js";
import asyncHandler from "./asyncHandler.js";


const ProtectRoutes = asyncHandler(async (req, res, next) => {

    const accessToken = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!accessToken || !accessToken.trim()) {
        throw new AppError(401, "Unautorized", "FAIL")
    }

    const validAccessToken = accessToken.trim();

    //verify accessToken 
    const accessTokenSecret = EnvConfig.token.access;

    const decoded = verifyToken(validAccessToken, accessTokenSecret!);

    req.user = decoded;

    next?.();

})

export default ProtectRoutes;