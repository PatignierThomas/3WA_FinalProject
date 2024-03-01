import Query from "../model/Query.js";
import path, {dirname} from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import CustomError from "../utils/customError/errorHandler.js";
import customSuccess from "../utils/successRes.js";

// get all the posts of one section, filtered by user role and sorted by the most recent activity or creation date
export const postsBySection = async (req, res, next) => {
    try {
        let commonQuery =  `SELECT post.id, post.title, post.status, post.views, post.sub_forum_id, COUNT(CASE WHEN post_reply.status = 'ok' THEN 1 END) as replies, 
                                MAX(CASE WHEN post_reply.status = 'ok' THEN post_reply.reply_date END) as latest_reply
                            FROM post 
                            LEFT JOIN post_reply ON post.id = post_reply.post_id AND post_reply.status = 'ok'`

        switch (req.user?.role) {
            case "admin":
                // fall through
            case "moderator":
                commonQuery += `
                WHERE post.sub_forum_id = ?`;
                break;
            case "user":
                commonQuery += `
                WHERE post.sub_forum_id = ? AND post.status = 'ok'`
                break;
            case null: 
                // fall through
            case undefined:
                commonQuery += `
                JOIN sub_forum ON post.sub_forum_id = sub_forum.id
                JOIN game_section ON sub_forum.game_section_id = game_section.id
                WHERE post.status = 'ok' AND post.sub_forum_id = ? AND game_section.visibility = 'Public'`
                break;
        }

        commonQuery += `
        GROUP BY post.id
        ORDER BY GREATEST(COALESCE(latest_reply, '0000-00-00'), post.creation_date) DESC`;

        const data = await Query.runWithParams(commonQuery, [req.params.sectionID])
        res.customSuccess(200, "Posts", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// get the most recent post of each category and the date of the most recent activity
export const mostRecentPostOfCategory = async (req, res, next) => {
    try {
        const query = `
        SELECT 
            p.id postID, 
            p.title, 
            p.creation_date, 
            p.views, 
            p.user_id, 
            pr.id, 
            pr.reply_date, 
            sub_forum.game_section_id, 
            sub_forum.id subID, 
            users.username
    
        FROM post_reply pr
        JOIN post p ON p.id = pr.post_id
        JOIN sub_forum on sub_forum.id = p.sub_forum_id
        JOIN users ON p.user_id = users.id
        JOIN (
            SELECT post_id, MAX(reply_date) as max_reply_date
            FROM post_reply
            WHERE status = 'ok'
            GROUP BY post_id
        ) pr_max ON pr.post_id = pr_max.post_id AND pr.reply_date = pr_max.max_reply_date
        WHERE sub_forum.game_section_id = ?
        ORDER BY pr.reply_date DESC;`;
    
        const data = await Query.runWithParams(query, [req.params.gameID])
    
        // filter the first post of each category
        const filteredData = data.filter((post, index, self) => {
            return index === self.findIndex((p) => (
                p.subID === post.subID
            ))
        })
    
        res.customSuccess(200, "Posts", filteredData);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// get the post by id, filtered by user role and add a view to the post
export const postById = async (req, res, next) => {
    try {
        let commonQuery = `
            SELECT post.id, post.title, post.content, post.status, post.creation_date, post.last_update, users.username, avatar.src
            FROM post
            JOIN users ON post.user_id = users.id
            LEFT JOIN avatar ON avatar.user_id = users.id
            `;

        switch (req.user?.role) {
            case "admin":
                // fall through
            case "moderator":
                commonQuery += `
                WHERE post.id = ?`
                break;
            case "user":
                commonQuery += `
                WHERE post.id = ? AND post.status = 'ok'`
                break;
            case null:
                // fall through
            case undefined:
                commonQuery += `
                JOIN sub_forum ON post.sub_forum_id = sub_forum.id
                JOIN game_section ON sub_forum.game_section_id = game_section.id
                WHERE post.status = 'ok' AND post.id = ? AND game_section.visibility = 'Public'`
                break;
            }

        const data = await Query.runWithParams(commonQuery, [req.params.postID])

        if (data.length === 0) {
            const customError = new CustomError(404, "Not found", "Introuvable", "Le post n'existe pas");
            return next(customError);
        }

        const view = "UPDATE post SET views = views + 1 WHERE id = ?";
        await Query.runWithParams(view, [req.params.postID]);

        if (data.length > 0) {
            const creation_date = new Date(data[0].creation_date);
            data[0].creation_date = creation_date.toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            if (!data[0].last_update === null) {
                const last_update = new Date(data[0].last_update);
                data[0].last_update = last_update.toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            }
            res.customSuccess(200, "Post", data);
        } 
        else {
            res.customSuccess(200, "Post", data);
        }
    }

    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }

}

// get the post info if the user is the author or an admin
export const singlePostInfo = async (req, res, next) => {
    try {
        const query = `SELECT user_id, status, title, content 
                       FROM post 
                       WHERE id = ?`;
        const [data] = await Query.runWithParams(query, [req.params.postID]);
        if (req.user.role !== "admin" && (data.user_id !== req.user.id || data.status === "locked" || data.status === "hidden")) {
            res.customSuccess(403, "Unauthorized", {error: "Unauthorized"});
        }
        res.customSuccess(200, "Post", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// update the post
export const updatePost = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        const check = "SELECT id, user_id, status FROM post WHERE id = ?";
        const [checkData] = await Query.runWithParams(check, [req.params.postID]);
        console.log(checkData);
        if (req.user.role !== "admin" && (checkData.user_id !== req.user.id || checkData.status === "locked" || checkData.status === "hidden")) {
            return res.customSuccess(403, "Unauthorized", {error: "Unauthorized"});
        }

        //compare image url with the one in the database
        //if the url is not in the database, delete the image from the server
        //if the url is in the database, do nothing
        const imageQuery = "SELECT url FROM image WHERE post_id = ?";
        const imageResult = await Query.runWithParams(imageQuery, [req.params.postID]);


        // Get the image url from the content
        const regex = new RegExp(`http:\/\/localhost:9001\/public\/assets\/img\/post\/${checkData.id}\/\\w+\\.\\w+`, 'g');
        const url = req.body.content.match(regex) || [];

        // Compare the url with the one in the database
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
                        console.error(`Failed to delete file: ${err}`);
                    } else {
                        console.log(`File deleted: ${filePath}`);
                    }
                });
            }
        }
        for (const image of req.body.url) {
            const imageQuery = "UPDATE image SET post_id = ? WHERE url = ?";
            await Query.runWithParams(imageQuery, [req.params.postID, image]);
        }

        const query = "UPDATE post SET title = ?, content = ?, last_update = ? WHERE id = ?";
        const data = await Query.runWithParams(query, [title, content, new Date(), req.params.postID]);
        res.customSuccess(200, "Post modifié", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// create a post and return the id of the new post
export const createPost = async (req, res, next) => {
    try {
        const { content, sectionId, title } = req.body;
    
        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
        const query = "INSERT INTO post (title, content, creation_date, last_update, status, sub_forum_id, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const values = [title, content, now, now, "ok", sectionId, req.user.id];
        const data = await Query.runWithParams(query, values);
    
        res.customSuccess(200, "Post crée", {id: data.insertId});
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}