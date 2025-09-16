import express from "express";
import {
  login,
  register,
  logout,
  getCurrent
} from "../controllers/authController.js";
import validateBody from "../middlewares/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.get("/current", authenticate, getCurrent);

authRouter.post("/logout", authenticate, logout);

export default authRouter;
