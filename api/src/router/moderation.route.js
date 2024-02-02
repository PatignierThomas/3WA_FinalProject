import express from 'express';
import { lockPost, unlockPost, deletePost } from "../controllers/admin/index.js";

const moderatorRouter = express.Router();

moderatorRouter.post("/lockPost/:id", lockPost);

moderatorRouter.post("/unlockPost/:id", unlockPost);

moderatorRouter.post("/hidePost/:id", deletePost);


export default moderatorRouter;