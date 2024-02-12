import express from 'express';
import { getAllGames, getAllSubject, getAllPost, getPostById, getReplyByPostId, createPost, createReply } from "../controllers/data.js";

const dataRouter = express.Router();

dataRouter.get("/game", getAllGames);

dataRouter.get("/subject", getAllSubject);

dataRouter.get("/post", getAllPost);

dataRouter.post("/post/createPost", createPost);

dataRouter.post("/post/createReply", createReply);

dataRouter.get("/post/:id", getPostById);

dataRouter.get("/post/reply/:postId/", getReplyByPostId);


export default dataRouter;