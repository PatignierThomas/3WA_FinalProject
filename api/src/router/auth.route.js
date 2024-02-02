import express from 'express';
import { login, register, logout, checkToken } from "../controllers/auth.js";
import auth from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/connexion", login);

authRouter.post("/creer-un-compte", register);

authRouter.get("/deconnexion", logout);

authRouter.get("/check-token", auth, checkToken);

export default authRouter;