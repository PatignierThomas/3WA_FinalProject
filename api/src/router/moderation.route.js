import express from 'express';
import { lockPost, unlockPost, hidePost } from "../controllers/admin/index.js";

const moderatorRouter = express.Router();

moderatorRouter.get("/lockPost/:id", lockPost);

moderatorRouter.get("/unlockPost/:id", unlockPost);

moderatorRouter.get("/hidePost/:id", hidePost);


export default moderatorRouter;