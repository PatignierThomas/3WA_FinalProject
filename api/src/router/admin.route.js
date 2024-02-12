import express from 'express';
import { getStats, banUser, unbanUser, deletePost, deleteReply } from "../controllers/admin/index.js";
import { createGame, createSection } from "../controllers/admin/create.js";
import { updateGame, updateSection } from "../controllers/admin/update.js";
import { deleteGame, deleteSection } from "../controllers/admin/delete.js";

const adminRouter = express.Router();

adminRouter.get("/stats", getStats);

adminRouter.get("/ban/:id", banUser);

adminRouter.get("/unban/:id", unbanUser);

adminRouter.post("/createGame", createGame);

adminRouter.patch("/updateGame/:id", updateGame);

adminRouter.delete("/deleteGame/:id", deleteGame);

adminRouter.post("/createSection", createSection);

adminRouter.patch("/updateSection/:id", updateSection);

adminRouter.delete("/deleteSection/:id", deleteSection);

adminRouter.delete("/deletePost/:id", deletePost);

adminRouter.delete("/deleteReply/:id", deleteReply);

export default adminRouter;
