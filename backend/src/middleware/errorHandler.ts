import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.js";
import EnvConfig from "../config/env.config.js";

const ErrorHandler: ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) => {

    let statusCode = 500;
    let status = "error";
    let message = "Something went wrong";

    //handle error
    if (err instanceof AppError) {
        status = err.status;
        statusCode = err.statusCode;
        message: err.message
    }

    //log the error 
    console.error({
        name: err.name,
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
    })

    //now return the response

    return res.status(statusCode).json({
        success:false,
        status,
        message,
        ...(EnvConfig.environment === "development" ? {stack:err.stack} : null)
    })

}

export default ErrorHandler;