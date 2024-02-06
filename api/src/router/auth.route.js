import express from 'express';
import { login, register, logout, checkToken } from "../controllers/auth.js";
import auth from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/login", login);

authRouter.post("/register", register);

authRouter.get("/logout", logout);

authRouter.get("/check-token", auth, checkToken);

export default authRouter;