import express from 'express';
import { login, register, logout, checkToken } from "../controllers/auth.js";
import tokenChecker from "../middlewares/checkAuth.js";
import { gameRestriction, sectionRestriction, postRestriction } from "../controllers/age.js";
import auth from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/login", login);

authRouter.post("/register", register);

authRouter.get("/logout", logout);

authRouter.get("/check-token", tokenChecker, checkToken);

authRouter.get("/age/game/:gameID", auth, gameRestriction);

authRouter.get("/age/section/:sectionID", auth, sectionRestriction);

authRouter.get("/age/post/:postID", auth, postRestriction);

export default authRouter;