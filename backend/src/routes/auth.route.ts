import { Router } from "express";
import { GetCurrentUser, Login, Logout, RefreshSession, Register } from "../controller/auth.controller.js";

const authRouter = Router();

authRouter.post("/register",Register)
authRouter.post("/login",Login)
authRouter.post("/refresh-token",RefreshSession)

//Authenticated routes
authRouter.post("/logout",Logout);
authRouter.get("/me",GetCurrentUser)


export default authRouter;