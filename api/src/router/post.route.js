import express from 'express';

import { createPost, updatePost, singlePostInfo, postById, mostRecentPostOfCategory, postsBySection } from "../controllers/post.js";
import auth from "../middlewares/auth.js";
import checkToken from '../middlewares/checkAuth.js';

const postRouter = express.Router();

postRouter.get("/:postID(\\d+)", checkToken, postById);

postRouter.post("/create", auth, createPost);

postRouter.patch("/editPost/:postID(\\d+)", auth, updatePost);

postRouter.get("/info/:postID(\\d+)", auth, singlePostInfo);

postRouter.get("/section/:sectionID(\\d+)", checkToken, postsBySection);

postRouter.get("/recent/:gameID(\\d+)", mostRecentPostOfCategory);

export default postRouter;