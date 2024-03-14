import express from 'express';

import { createReply, updateReply, replyByPostId } from "../controllers/reply.js";
import auth from "../middlewares/auth.js";
import checkToken from '../middlewares/checkAuth.js';

const replyRouter = express.Router();

replyRouter.post("/create", auth, createReply);

replyRouter.patch("/edit/:replyID(\\d+)", auth, updateReply);

replyRouter.get("/all/:postID/", checkToken, replyByPostId);

export default replyRouter;