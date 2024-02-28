import express from 'express';
import { lockPost, unlockPost, hidePost, hideReply, showPost, showReply } from "../controllers/moderation/moderation.js";

const moderatorRouter = express.Router();

moderatorRouter.get("/lockPost/:postID(\\d+)", lockPost);

moderatorRouter.get("/unlockPost/:postID(\\d+)", unlockPost);

moderatorRouter.get("/hidePost/:postID(\\d+)", hidePost);

moderatorRouter.get("/showPost/:postID(\\d+)", showPost);

moderatorRouter.get("/hideReply/:replyID(\\d+)", hideReply);

moderatorRouter.get("/showReply/:replyID(\\d+)", showReply);

export default moderatorRouter;