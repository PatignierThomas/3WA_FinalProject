import express from 'express';

import { allGames, subjectByGameId, numberOfPostByCategory } from "../controllers/data.js";
import { updateUserInfo } from "../controllers/user.js";
import auth from "../middlewares/auth.js";
import checkToken from '../middlewares/checkAuth.js';
import upload from '../middlewares/multer.js';

const dataRouter = express.Router();

dataRouter.get("/game", checkToken, allGames);

dataRouter.get("/subject/:gameID(\\d+)", subjectByGameId);

dataRouter.get("/get/number/post/:sectionID(\\d+)", numberOfPostByCategory);

dataRouter.patch("/user/info/:userID(\\d+)", auth, updateUserInfo);


export default dataRouter;