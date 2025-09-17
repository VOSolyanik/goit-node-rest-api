import express from "express";
import {
  login,
  register,
  logout,
  getCurrentUser,
  updateCurrentUserAvatar
} from "../controllers/authController.js";
import validateBody from "../middlewares/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.post("/logout", authenticate, logout);

authRouter.get("/current", authenticate, getCurrentUser);

authRouter.patch("/avatar", authenticate, upload.single("avatar"), updateCurrentUserAvatar);

export default authRouter;
