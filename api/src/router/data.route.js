import express from 'express';
import { getAllGames, getAllSubject, getAllPost, getPostById, getReplyByPostId, createPost, createReply, getEditPostById, updatePost, updateReply, getNumberOfPostByCategory, getMostRecentPostOfCategory } from "../controllers/data.js";
import auth from "../middlewares/auth.js";
import { updateGame } from '../controllers/admin/update.js';

const dataRouter = express.Router();

dataRouter.get("/game", getAllGames);

dataRouter.get("/subject", getAllSubject);

dataRouter.get("/post", getAllPost);

dataRouter.get("/post/:id", getPostById);

dataRouter.post("/post/createPost", createPost);

dataRouter.post("/post/createReply", createReply);

dataRouter.patch("/post/editPost/:id", auth, updatePost);

dataRouter.patch("/post/editReply/:id", auth, updateReply);

dataRouter.get("/get/number/post/:id", getNumberOfPostByCategory);

dataRouter.get("/get/most/recent/post/:id", getMostRecentPostOfCategory);

dataRouter.get("/get/edit/post/:id", auth, getEditPostById);

dataRouter.get("/post/reply/:postId/", getReplyByPostId);


export default dataRouter;