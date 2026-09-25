import type { NextFunction, Request, RequestHandler, Response } from "express";

const asyncHandler = (fn:(req:Request,res:Response,next?:NextFunction)=>any) : RequestHandler  =>{
     
    return (req:Request,res:Response,next:NextFunction)=>{

        Promise.resolve(fn(req,res,next)).catch(next);
    }
}

export default asyncHandler;