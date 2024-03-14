import Query from "../model/Query.js";
import path, {dirname} from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import CustomError from "../utils/customError/errorHandler.js";
import customSuccess from "../utils/successRes.js";


// create a reply and return the id of the new reply
export const createReply = async (req, res, next) => {
    try {
        let { content, postId, url } = req.body;

        // React quill adds an empty paragraph when the editor is empty
        content = content.replace("<p><br></p>", "");

        if (!content) {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "Vous devez écrire un contenu pour votre réponse");
            return next(customError);
        }

        // check if post is locked or hidden
        const checkPost = "SELECT status FROM post WHERE id = ?";
        const [checkPostData] = await Query.runWithParams(checkPost, [req.body.postId]);
        if (checkPostData.status === "locked" || checkPostData.status === "hidden") {
            const customError = new CustomError(403, "Unauthorized", "Unauthorized", "Vous ne pouvez pas répondre à ce post");
            return next(customError);
        }

        
        
        const query = "INSERT INTO post_reply (content, reply_date, status, post_id, user_id) VALUES (?, ?, ?, ?, ?)";
        const values = [content, new Date(), "ok", postId, req.user.id];
        const data = await Query.runWithParams(query, values);
        for (const image of url) {
            const imageQuery = "UPDATE image SET reply_id = ? WHERE url = ?";
            await Query.runWithParams(imageQuery, [data.insertId, image]);
        }
        res.customSuccess(200, "Réponse crée", {id: data.insertId});
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
} 

// update the reply of a post
export const updateReply = async (req, res, next) => {
    try {
        let { content } = req.body;
        // React quill adds an empty paragraph when the editor is empty
        content = content.replace("<p><br></p>", "");
        if (!req.body.content) {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "Vous devez écrire un contenu pour votre réponse");
            return next(customError);
        }

        const check = "SELECT status, post_id, user_id FROM post_reply WHERE id = ?";
        const [checkData] = await Query.runWithParams(check, [req.params.replyID]);
        if (req.user.role !== "admin" && (checkData.user_id !== req.user.id || checkData.status === "locked" || checkData.status === "hidden")) {
            return res.customSuccess(403, "Unauthorized", {error: "Unauthorized"});
        }

        // Get the image url from the content stored in the database
        const imageQuery = "SELECT url FROM image WHERE reply_id = ?";
        const imageResult = await Query.runWithParams(imageQuery, [req.params.replyID]);


        // Get the image url from the content
        const regex = new RegExp(`http:\/\/localhost:9001\/public\/assets\/img\/post\/${checkData.post_id}\/\\w+\\.\\w+`, 'g');
        const url = content.match(regex) || [];

        // Compare the url(s) with the one(s) in the database
        // If the url is not in the database, delete the image from the server
        for (const image of imageResult) {
            if (!url.includes(image.url)) {
                const deleteQuery = "DELETE FROM image WHERE url = ?";
                await Query.runWithParams(deleteQuery, [image.url]);
                const url = new URL(image.url);
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
        }
        for (const image of req.body.url) {
            const imageQuery = "UPDATE image SET reply_id = ? WHERE url = ?";
            await Query.runWithParams(imageQuery, [req.params.replyID, image]);
        }

        const query = "UPDATE post_reply SET content = ?, last_update = ? WHERE id = ?";
        const data = await Query.runWithParams(query, [content, new Date(), req.params.replyID]);
        res.customSuccess(200, "Réponse modifiée", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// get all the replies of a post filtered by the user role and the reply status
export const replyByPostId = async (req, res, next) => {
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const offset = `${(page - 1) * limit}`
        let query = `SELECT post_reply.id, post_reply.content, post_reply.reply_date, post_reply.last_update, post_reply.status, users.username, avatar.src
                       FROM post_reply 
                       JOIN users ON post_reply.user_id = users.id
                       LEFT JOIN avatar ON avatar.user_id = users.id
                       `;
     
        let countQuery = `SELECT COUNT(post_reply.id) as total
        FROM post_reply
        JOIN users ON post_reply.user_id = users.id
        LEFT JOIN avatar ON avatar.user_id = users.id
        `;

        switch (req.user?.role) {
            case "admin":
                // fall through
            case "moderator":
                const filterAdmin = `WHERE post_reply.post_id = ? `;
                query += filterAdmin;
                countQuery += filterAdmin;
                break;
            case "user":
                const filterUser = `WHERE post_reply.post_id = ? AND post_reply.status = "ok" `;
                query += filterUser;
                countQuery += filterUser;
                break;
            case null:
                // fall through
            case undefined:
                const filter = `
                JOIN post ON post_reply.post_id = post.id
                JOIN sub_forum ON post.sub_forum_id = sub_forum.id
                JOIN game_section ON sub_forum.game_section_id = game_section.id
                WHERE post_reply.post_id = ? AND post_reply.status = "ok" AND game_section.visibility = 'Public'
                `;
                query += filter;
                countQuery += filter;
                break;
        }

        query += `ORDER BY post_reply.reply_date ASC LIMIT ? OFFSET ?`;
        const data = await Query.runWithParams(query, [req.params.postID, limit, offset]);
        const countResult = await Query.runWithParams(countQuery, [req.params.postID]);
        const totalReplies = countResult[0].total;
        data.map((reply) => {
            const reply_date = new Date(reply.reply_date);
            reply.reply_date = reply_date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'});
            if (reply.last_update === "Invalid Date") return;
            const last_update = new Date(reply.last_update);
            reply.last_update = last_update.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'});
        })

        res.customSuccess(200, "Réponses", {replies: data, total: totalReplies});
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}
