import express from 'express';
import { getAllGames, getAllSubject, getAllPost, getPostById, getReplyByPostId } from "../controllers/data.js";

const dataRouter = express.Router();

dataRouter.get("/game", getAllGames);

dataRouter.get("/subject", getAllSubject);

dataRouter.get("/post", getAllPost);

dataRouter.get("/post/:id", getPostById);

dataRouter.get("/post/:id/reply", getReplyByPostId);


export default dataRouter;