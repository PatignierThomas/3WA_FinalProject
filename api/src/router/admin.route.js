import express from 'express';

import { getStats, allSubject } from "../controllers/admin/select.js";
import { getAllUsers, getUserById, changeUserInfo } from "../controllers/admin/user.js";
import { createGame, createSection } from "../controllers/admin/create.js";
import { updateGame, updateSection } from "../controllers/admin/update.js";
import { deleteGame, deleteSection, deletePost, deleteReply } from "../controllers/admin/delete.js";
// import { resetUserPassword } from "../controllers/admin/index.js";


const adminRouter = express.Router();

adminRouter.get("/stats", getStats);

adminRouter.get("/post/section", allSubject);

adminRouter.get("/all/users", getAllUsers);

adminRouter.get("/user/:userID", getUserById);

adminRouter.patch("/user/info/:userID(\\d+)", changeUserInfo);


adminRouter.post("/createGame", createGame);

adminRouter.patch("/updateGame/:gameID(\\d+)", updateGame);


adminRouter.post("/createSection", createSection);

adminRouter.patch("/updateSection/:sectionID(\\d+)", updateSection);


adminRouter.delete("/deleteGame/:gameID(\\d+)", deleteGame);

adminRouter.delete("/deleteSection/:sectionID(\\d+)", deleteSection);

adminRouter.delete("/deletePost/:postID(\\d+)", deletePost);

adminRouter.delete("/deleteReply/:replyID(\\d+)", deleteReply);


// adminRouter.patch("/reset/:id(\\d+)", resetUserPassword)

export default adminRouter;
