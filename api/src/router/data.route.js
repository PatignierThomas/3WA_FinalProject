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


// dataRouter.get("/post/section/:id(\\d+)", checkToken, postsBySection);

// dataRouter.get("/post/:id(\\d+)", checkToken, postById);

// dataRouter.post("/post/createPost", auth, createPost);

// dataRouter.post("/post/createReply", auth, createReply);

// dataRouter.patch("/post/editPost/:id(\\d+)", auth, updatePost);

// dataRouter.patch("/post/editReply/:id(\\d+)", auth, updateReply);


// dataRouter.get("/get/most/recent/post/:id(\\d+)", mostRecentPostOfCategory);

// dataRouter.get("/get/edit/post/:id(\\d+)", auth, singlePostInfo);

// dataRouter.get("/post/reply/:postId/", replyByPostId);



export default dataRouter;