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

// postRouter.get("/post/:id(\\d+)", checkToken, postById);

// postRouter.post("/post/create", auth, createPost);

// postRouter.patch("/post/editPost/:id(\\d+)", auth, updatePost);

// postRouter.get("/post/section/:id(\\d+)", checkToken, postsBySection);

// postRouter.get("/get/edit/post/:id(\\d+)", auth, singlePostInfo);

// postRouter.get("/get/most/recent/post/:id(\\d+)", mostRecentPostOfCategory);