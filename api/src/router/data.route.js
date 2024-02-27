import express from 'express';
import { getAllGames, getSubjectByGameId, getPostById, getReplyByPostId, createPost, createReply, getEditPostById, updatePost, updateReply, NumberOfPostByCategory, getMostRecentPostOfCategory, getPostsBySection, updateUserInfo, uploadImage, uploadAvatar, deleteAvatar, getAllSubject } from "../controllers/data.js";
import auth from "../middlewares/auth.js";
import checkToken from '../middlewares/checkAuth.js';
import { updateGame } from '../controllers/admin/update.js';
import multer from 'multer';
import upload from '../middlewares/multer.js';

// import multerNone from '../middlewares/multerNone.js';
// import upload from '../middlewares/multerStorage.js';

const multerUpload = multer();

const dataRouter = express.Router();

dataRouter.get("/game", checkToken, getAllGames);

dataRouter.get("/subject/:gameId(\\d+)", getSubjectByGameId);

// dataRouter.get("/post", checkToken, getAllPost);

dataRouter.get("/post/section", checkToken, getAllSubject);

dataRouter.get("/post/section/:id(\\d+)", checkToken, getPostsBySection);

dataRouter.get("/post/:id", checkToken, getPostById);

dataRouter.post("/post/createPost", auth, createPost);

dataRouter.post("/post/createReply", auth, createReply);

dataRouter.patch("/post/editPost/:id(\\d+)", auth, updatePost);

dataRouter.patch("/post/editReply/:id(\\d+)", auth, updateReply);

dataRouter.get("/get/number/post/:id(\\d+)", NumberOfPostByCategory);

dataRouter.get("/get/most/recent/post/:id(\\d+)", getMostRecentPostOfCategory);

dataRouter.get("/get/edit/post/:id(\\d+)", auth, getEditPostById);

dataRouter.get("/post/reply/:postId/", getReplyByPostId);

dataRouter.post("/upload/image", auth, upload, uploadImage);

dataRouter.post("/upload/avatar", auth, upload, uploadAvatar);

dataRouter.delete("/delete/avatar/:userId(\\d+)", auth, deleteAvatar);

dataRouter.patch("/user/info/:userId(\\d+)", updateUserInfo);


export default dataRouter;