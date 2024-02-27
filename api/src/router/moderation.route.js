import express from 'express';
import { lockPost, unlockPost, hidePost, hideReply, showPost, showReply } from "../controllers/moderation/moderation.js";

const moderatorRouter = express.Router();

moderatorRouter.get("/lockPost/:id(\\d+)", lockPost);

moderatorRouter.get("/unlockPost/:id(\\d+)", unlockPost);

moderatorRouter.get("/hidePost/:id(\\d+)", hidePost);

moderatorRouter.get("/hideReply/:id(\\d+)", hideReply);

moderatorRouter.get("/showPost/:id(\\d+)", showPost);

moderatorRouter.get("/showReply/:id(\\d+)", showReply);




export default moderatorRouter;