import express from 'express';

import { uploadImage, uploadAvatar, deleteAvatar} from "../controllers/upload.js";

import auth from "../middlewares/auth.js";
import upload from '../middlewares/multer.js';

const fileRouter = express.Router();

fileRouter.post("/upload/image", auth, upload, uploadImage);

fileRouter.post("/upload/avatar", auth, upload, uploadAvatar);

fileRouter.delete("/delete/avatar/:userID(\\d+)", auth, deleteAvatar);

export default fileRouter;