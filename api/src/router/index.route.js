import express from 'express';

import authRouter from "./auth.route.js";
import dataRouter from "./data.route.js";
import adminRouter from "./admin.route.js";
import moderatorRouter from "./moderation.route.js";
import postRouter from './post.route.js';
import replyRouter from './reply.route.js';
import fileRouter from './file.route.js';
import verifyAdminToken from '../middlewares/adminAuth.js';
import verifyModeratorToken from '../middlewares/moderatorAuth.js';

const indexRouter = express.Router();

indexRouter.get("/api/v1", (req, res) => {
    res.send("Hello World!");
    }
);

// access to everyone
indexRouter.use("/api/v1/auth", authRouter);

indexRouter.use("/api/v1/data", dataRouter);

indexRouter.use("/api/v1/post", postRouter);

indexRouter.use("/api/v1/reply", replyRouter);

indexRouter.use("/api/v1/file", fileRouter);

// access to moderator and admin
indexRouter.use("/api/v1/moderator", verifyModeratorToken, moderatorRouter);

// access to admin only
indexRouter.use("/api/v1/admin", verifyAdminToken, adminRouter);

indexRouter.get("*", (req, res) => {
    res.json({ error: "No route found" })
});

export default indexRouter;