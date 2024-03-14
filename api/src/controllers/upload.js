import Query from "../model/Query.js";
import "dotenv/config";
import path, {dirname} from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import CustomError from "../utils/customError/errorHandler.js";
import customSuccess from "../utils/successRes.js";


// store the url of the image in the database
export const uploadImage = async (req, res, next) => {
    try {
        const url = `http://localhost:9001/public${req.files[0]}`;
        const query = "INSERT INTO image (url) VALUES (?)";
        await Query.runWithParams(query, [url]);
        res.customSuccess(200, "Image uploadée", {url});
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// store the url of the avatar in the database
export const uploadAvatar = async (req, res, next) => {
    try {
        const url = `http://localhost:9001/public${req.files}`;
    
        const checkQuery = "SELECT id FROM avatar WHERE user_id = ?";
        const checkResult = await Query.runWithParams(checkQuery, [req.user.id]);
        
        if (checkResult.length > 0) {
            // If the user already has an avatar, update the existing record
            const updateQuery = "UPDATE avatar SET src = ? WHERE user_id = ?";
            const updateData = await Query.runWithParams(updateQuery, [url, req.user.id]);
        } else {
            // If the user doesn't have an avatar, insert a new record
            const insertQuery = "INSERT INTO avatar (src, user_id) VALUES (?, ?)";
            const insertData = await Query.runWithParams(insertQuery, [url, req.user.id]);
        }
        res.customSuccess(200, "Avatar uploadé", {url});
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// delete the avatar of the user from the database and the server
export const deleteAvatar = async (req, res, next) => {
    try {
        const checkQuery = "SELECT src FROM avatar WHERE user_id = ?";
        const [checkResult] = await Query.runWithParams(checkQuery, [req.params.userID]);
        if (req.user.id !== req.params.userID && req.user.role !== "admin") {
            const customError = new CustomError(403, "Unauthorized", "Unauthorized");
            return next(customError);
        }
        if (checkResult.src) {
            const url = new URL(checkResult.src);
            const __dirname = dirname(fileURLToPath(import.meta.url));
            const filePath = path.join(__dirname, '../..', url.pathname);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.log(`Failed to delete file: ${err}`);
                } else {
                    console.log(`File deleted: ${filePath}`);
                }
            });
        }
        else {
            const customError = new CustomError(404, "Not found", "Pas d'avatar trouvé");
            return next(customError);
        }
        const query = "DELETE FROM avatar WHERE user_id = ?";
        const data = await Query.runWithParams(query, [req.params.userID]);
        res.customSuccess(200, "Avatar supprimé", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}