import AppError from "../utils/appError.js";
import asyncHandler from "./asyncHandler.js";

const checkSeller = asyncHandler(async(req,_res,next)=>{

   const user = req.user;

   if(user.role!=="seller"){
     throw new AppError(403,"Unauthorized access","FAIL");
   }

   next?.();
})

export default checkSeller;