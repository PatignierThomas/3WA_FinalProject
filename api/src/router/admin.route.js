import express from 'express';
import { getStats, banUser, unbanUser, deletePost, deleteReply } from "../controllers/admin/index.js";

const adminRouter = express.Router();

adminRouter.get("/stats", getStats);

adminRouter.get("/ban/:id", banUser);

adminRouter.get("/unban/:id", unbanUser);

adminRouter.delete("/deletePost/:id", deletePost);

adminRouter.delete("/deleteReply/:id", deleteReply);

export default adminRouter;
