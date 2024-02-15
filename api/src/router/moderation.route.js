import express from 'express';
import { lockPost, unlockPost, hidePost, hideReply, showPost, showReply } from "../controllers/moderation/moderation.js";

const moderatorRouter = express.Router();

moderatorRouter.get("/lockPost/:id", lockPost);

moderatorRouter.get("/unlockPost/:id", unlockPost);

moderatorRouter.get("/hidePost/:id", hidePost);

moderatorRouter.get("/hideReply/:id", hideReply);

moderatorRouter.get("/showPost/:id", showPost);

moderatorRouter.get("/showReply/:id", showReply);




export default moderatorRouter;