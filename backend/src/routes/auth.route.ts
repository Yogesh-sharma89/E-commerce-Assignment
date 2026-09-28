import { Router } from "express";
import { GetCurrentUser, Login, Logout, RefreshSession, Register, UpdateProfileAvatar } from "../controller/auth.controller.js";
import ProtectRoutes from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.js";

const authRouter = Router();

authRouter.post("/register", Register)
authRouter.post("/login", Login)
authRouter.post("/refresh-token", RefreshSession)

//Authenticated routes

authRouter.use(ProtectRoutes);

authRouter.post("/logout", Logout);
authRouter.get("/me", GetCurrentUser)
authRouter.put("/profile/avatar", upload.single("avatar"), UpdateProfileAvatar)


export default authRouter;