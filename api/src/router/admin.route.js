import express from 'express';
import { getStats, getAllUsers, getUserById, changeUserInfo } from "../controllers/admin/index.js";
import { createGame, createSection } from "../controllers/admin/create.js";
import { updateGame, updateSection } from "../controllers/admin/update.js";
import { deleteGame, deleteSection, deletePost, deleteReply } from "../controllers/admin/delete.js";
import { resetPassword } from "../controllers/admin/index.js";


const adminRouter = express.Router();

adminRouter.get("/stats", getStats);

adminRouter.get("/all/users", getAllUsers);

adminRouter.get("/user/:id", getUserById);

adminRouter.patch("/user/info/:userId(\\d+)", changeUserInfo);

// adminRouter.post("/ban/:userId", banUser);

// adminRouter.post("/unban/:userId", unbanUser);

adminRouter.post("/createGame", createGame);

adminRouter.patch("/updateGame/:id(\\d+)", updateGame);

adminRouter.delete("/deleteGame/:id(\\d+)", deleteGame);

adminRouter.post("/createSection", createSection);

adminRouter.patch("/updateSection/:id(\\d+)", updateSection);

adminRouter.delete("/deleteSection/:id(\\d+)", deleteSection);

adminRouter.delete("/deletePost/:id(\\d+)", deletePost);

adminRouter.delete("/deleteReply/:id(\\d+)", deleteReply);

adminRouter.patch("/reset/:id(\\d+)", resetPassword)

export default adminRouter;
