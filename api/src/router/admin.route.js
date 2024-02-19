import express from 'express';
import { getStats, getNonBannedUsers, getAllBannedUsers, banUser, unbanUser, getAllUsers, getUserById, changeUserInfo } from "../controllers/admin/index.js";
import { createGame, createSection } from "../controllers/admin/create.js";
import { updateGame, updateSection } from "../controllers/admin/update.js";
import { deleteGame, deleteSection, deletePost, deleteReply } from "../controllers/admin/delete.js";

const adminRouter = express.Router();

adminRouter.get("/stats", getStats);

adminRouter.get("/all/users", getAllUsers);

adminRouter.get("/user/:id", getUserById);

adminRouter.get("/users", getNonBannedUsers);

adminRouter.get("/users/ban", getAllBannedUsers);

adminRouter.patch("/user/info/:userId", changeUserInfo);

adminRouter.post("/ban", banUser);

adminRouter.post("/unban", unbanUser);

adminRouter.post("/createGame", createGame);

adminRouter.patch("/updateGame/:id", updateGame);

adminRouter.delete("/deleteGame/:id", deleteGame);

adminRouter.post("/createSection", createSection);

adminRouter.patch("/updateSection/:id", updateSection);

adminRouter.delete("/deleteSection/:id", deleteSection);

adminRouter.delete("/deletePost/:id", deletePost);

adminRouter.delete("/deleteReply/:id", deleteReply);

export default adminRouter;
