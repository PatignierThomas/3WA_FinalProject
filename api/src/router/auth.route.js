import express from 'express';
import { login, register, logout, checkToken } from "../controllers/auth.js";
import tokenChecker from "../middlewares/checkAuth.js";

const authRouter = express.Router();

authRouter.post("/login", login);

authRouter.post("/register", register);

authRouter.get("/logout", logout);

authRouter.get("/check-token", tokenChecker, checkToken);

export default authRouter;