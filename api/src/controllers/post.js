import Query from "../model/Query.js";
import path, {dirname, format} from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import CustomError from "../utils/customError/errorHandler.js";
import customSuccess from "../utils/successRes.js";

import { formatDate, TimeAgo } from "../utils/date.js";

// get posts of a section paginated, filtered by user role and sorted by the most recent activity or creation date
export const postsBySection = async (req, res, next) => {
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const offset = `${(page - 1) * limit}`

        // CASE is used to get the most recent reply date if their status is 'ok'
        // GREATEST function is used to get the most recent date between the creation date and the latest reply date
        let commonQuery =  `SELECT 
                                post.id, 
                                post.title, 
                                post.status, 
                                post.views, 
                                post.sub_forum_id, 
                                post.creation_date,
                                users.username,
                                avatar.src,
                                COUNT(CASE WHEN post_reply.status = 'ok' THEN 1 END) as replies, 
                                MAX(CASE WHEN post_reply.status = 'ok' THEN post_reply.reply_date END) as latest_reply,
                                GREATEST(COALESCE(MAX(CASE WHEN post_reply.status = 'ok' THEN post_reply.reply_date END), '0000-00-00'), post.creation_date) as most_recent_activity
                            FROM post 
                            LEFT JOIN post_reply ON post.id = post_reply.post_id AND post_reply.status = 'ok'
                            JOIN users ON post.user_id = users.id
                            LEFT JOIN avatar ON avatar.user_id = users.id
                            `

        let countQuery = `
            SELECT COUNT(DISTINCT post.id) as total
            FROM post
            LEFT JOIN post_reply ON post.id = post_reply.post_id AND post_reply.status = 'ok'`;

        switch (req.user?.role) {
            case "admin":
                // fall through
            case "moderator":
                const filterAdmin = `WHERE post.sub_forum_id = ? `;
                commonQuery += filterAdmin;
                countQuery += filterAdmin;
                break;
            case "user":
                const filterUser = `WHERE post.sub_forum_id = ? AND post.status = 'ok' `;
                commonQuery += filterUser;
                countQuery += filterUser;
                break;
            case null: 
                // fall through
            case undefined:
                const filter = `
                JOIN sub_forum ON post.sub_forum_id = sub_forum.id
                JOIN game_section ON sub_forum.game_section_id = game_section.id
                WHERE post.status = 'ok' AND post.sub_forum_id = ? AND game_section.visibility = 'Public' `;
                commonQuery += filter;
                countQuery += filter;
                break;
        }

        commonQuery += `
        GROUP BY post.id
        ORDER BY GREATEST(COALESCE(latest_reply, '0000-00-00'), post.creation_date) DESC LIMIT ? OFFSET ?`;

        const data = await Query.runWithParams(commonQuery, [req.params.sectionID, limit, offset]);
        const [count] = await Query.runWithParams(countQuery, [req.params.sectionID]);
        data.forEach(post => {
            post.creation_date = formatDate(post.creation_date);
            post.most_recent_activity = TimeAgo(post.most_recent_activity);
            if (post.latest_reply) {
                post.latest_reply = formatDate(post.latest_reply);
            }
        });
        res.customSuccess(200, "Posts", {posts: data, total: count.total});
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// get the most recent post of each category and the date of the most recent activity
export const mostRecentPostOfCategory = async (req, res, next) => {
    try {
        // the subquery is meant to filter the most recent between the OG post and the latest reply
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
            users.username,
            avatar.src
        FROM post p
        LEFT JOIN post_reply pr ON p.id = pr.post_id
        JOIN sub_forum on sub_forum.id = p.sub_forum_id
        JOIN users ON p.user_id = users.id
        LEFT JOIN avatar ON avatar.user_id = users.id
        JOIN (
            SELECT sub_forum.id as subID, MAX(IFNULL(pr.reply_date, p.creation_date)) as max_date
            FROM post p
            LEFT JOIN post_reply pr ON p.id = pr.post_id
            JOIN sub_forum on sub_forum.id = p.sub_forum_id
            WHERE sub_forum.game_section_id = ? AND (pr.status = 'ok' OR pr.status IS NULL)
            GROUP BY sub_forum.id
        ) sub_max ON sub_forum.id = sub_max.subID AND IFNULL(pr.reply_date, p.creation_date) = sub_max.max_date
        ORDER BY IFNULL(pr.reply_date, p.creation_date) DESC;`;

        const data = await Query.runWithParams(query, [req.params.gameID]);

        for (const post of data) {
            post.creation_date = formatDate(post.creation_date);
            if (post.reply_date) {
                post.reply_date = formatDate(post.reply_date);
            }
        }

        res.customSuccess(200, "Posts", data);
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
            SELECT 
                post.id, 
                post.title, 
                post.content, 
                post.status, 
                post.creation_date,
                post.last_update, 
                users.username, 
                avatar.src
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

        const data = await Query.runWithParams(commonQuery, [req.params.postID]);

        if (data.length === 0) {
            const customError = new CustomError(404, "Not found", "Introuvable", "Le post n'existe pas");
            return next(customError);
        }

        const view = "UPDATE post SET views = views + 1 WHERE id = ?";
        await Query.runWithParams(view, [req.params.postID]);

        if (data.length > 0) {
            const creation_date = new Date(data[0].creation_date);
            data[0].creation_date = creation_date.toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            const last_update = new Date(data[0].last_update);
            data[0].last_update = last_update.toLocaleString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
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

// update the post and delete the images that are not in the content
export const updatePost = async (req, res, next) => {
    try {
        let { title, content } = req.body;

        // React quill adds an empty paragraph when the editor is empty
        content = content.replace("<p><br></p>", "");

        if ( !title || !content )  {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "Tous les champs doivent être remplis");
            return next(customError);
        }

        const check = "SELECT id, user_id, status FROM post WHERE id = ?";
        const [checkData] = await Query.runWithParams(check, [req.params.postID]);
        if (req.user.role !== "admin" && (checkData.user_id !== req.user.id || checkData.status === "locked" || checkData.status === "hidden")) {
            return res.customSuccess(403, "Unauthorized", {error: "Unauthorized"});
        }


        // Get the image url from the content stored in the database
        const imageQuery = "SELECT url FROM image WHERE post_id = ?";
        const imageResult = await Query.runWithParams(imageQuery, [req.params.postID]);


        // Get the image url from the content
        const regex = new RegExp(`http:\/\/localhost:9001\/public\/assets\/img\/post\/${checkData.id}\/\\w+\\.\\w+`, 'g');
        const url = req.body.content.match(regex) || [];

        // Compare the url(s) with the one(s) in the database
        // If the url is not in the database, delete the image from the server
        for (const image of imageResult) {
            if (!url.includes(image.url)) {
                const deleteQuery = "DELETE FROM image WHERE url = ?";
                await Query.runWithParams(deleteQuery, [image.url]);
                
                const url = new URL(image.url);
                
                // get the directory of this file
                const __dirname = dirname(fileURLToPath(import.meta.url)); // 'C:/Users/username/project/src'
                const filePath = path.join(__dirname, '../..', url.pathname); // 'C:/Users/username/project/public/assets/img/post/1234/image.jpg'
                fs.unlink(filePath, (err) => {
                    if (err) {
                        const customError = new CustomError(500, "File error", "Erreur serveur");
                        next(customError);
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
        let { content, sectionId, title } = req.body;

        // React quill adds an empty paragraph when the editor is empty
        if ( !content || !sectionId || !title || content === "<p><br></p>") {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "Tous les champs doivent être remplis");
            return next(customError);
        }

        const check = `
            SELECT game_section.visibility
            FROM sub_forum 
            JOIN game_section ON sub_forum.game_section_id = game_section.id 
            WHERE sub_forum.id = ?`;

        const section = await Query.runWithParams(check, [sectionId]);

        if (!section.length) {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "La section n'existe pas");
            return next(customError);
        }

        if (section[0].visibility === 'Public' && req.user.role !== 'admin') {
            const customError = new CustomError(403, "Forbidden", "Accès refusé", "Vous devez être administrateur pour créer un post dans cette section");
            return next(customError);
        }
    
        const now = new Date()
    
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