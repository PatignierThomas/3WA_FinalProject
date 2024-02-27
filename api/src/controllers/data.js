import Query from "../model/Query.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import path, {dirname} from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import CustomError from "../utils/customError/errorHandler.js";
import customSuccess from "../utils/successRes.js";

//get all games to logged user and public games to non-logged user
export const getAllGames = async (req, res, next) => {
    if (req.user) {
        try {
            const query = "SELECT id, game_name, description, minimal_age, visibility FROM game_section ORDER BY visibility DESC, game_name ASC";
            const data = await Query.run(query)
            res.customSuccess(200, "Jeux", data);
        } 
        catch (error) {
            const customError = new CustomError(500, "Database error", "Erreur serveur", error);
            return next(customError);
        }
    }
    else {
        try {
            const query = "SELECT id, game_name, description, minimal_age, visibility FROM game_section WHERE visibility = 'Public' ORDER BY game_name ASC";
            const data = await Query.run(query)
            res.customSuccess(200, "Jeux", data);
        }
        catch (error) {
            const customError = new CustomError(500, "Database error", "Erreur serveur", error);
            return next(customError);
        }
    }
}

// get all the subjects of all games
export const getAllSubject = async (req, res, next) => {
    try {
        const query = ` SELECT sf.id, sf.subject, sf.status, sf.game_section_id, COUNT(post.id) as post_count
                        FROM sub_forum sf
                        LEFT JOIN post ON sf.id = post.sub_forum_id
                        GROUP BY sf.id`;
        const data = await Query.run(query) 
        res.customSuccess(200, "Sujets", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// get all the subjects of one game
export const getSubjectByGameId = async (req, res, next) => {
    try {
        const query = `SELECT sf.id, sf.subject, sf.status, sf.game_section_id, COUNT(post.id) as post_count
                       FROM sub_forum sf
                       LEFT JOIN post ON sf.id = post.sub_forum_id
                       WHERE sf.game_section_id = ?
                       GROUP BY sf.id`;
        const data = await Query.runWithParams(query, [req.params.gameId])
        res.customSuccess(200, "Sujets", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// get all the posts of one section, filtered by user role and sorted by the most recent activity or creation date
export const getPostsBySection = async (req, res, next) => {
    try {
        let commonQuery =  `SELECT post.id, post.title, post.status, post.views, post.sub_forum_id, COUNT(CASE WHEN post_reply.status = 'ok' THEN 1 END) as replies, 
                                MAX(CASE WHEN post_reply.status = 'ok' THEN post_reply.reply_date END) as latest_reply
                            FROM post 
                            LEFT JOIN post_reply ON post.id = post_reply.post_id AND post_reply.status = 'ok'`

        switch (req.user?.role) {
            case "admin":
                commonQuery += `
                WHERE post.sub_forum_id = ?`;
                break;
            case "user":
                commonQuery += `
                WHERE post.sub_forum_id = ? AND post.status = 'ok'`
                break;
            case null || undefined:
                commonQuery += `
                JOIN sub_forum ON post.sub_forum_id = sub_forum.id
                JOIN game_section ON sub_forum.game_section_id = game_section.id
                WHERE post.status = 'ok' AND post.sub_forum_id = ? AND game_section.visibility = 'Public'`
                break;
        }

        commonQuery += `
        GROUP BY post.id
        ORDER BY GREATEST(COALESCE(latest_reply, '0000-00-00'), post.creation_date) DESC`;

        const data = await Query.runWithParams(commonQuery, [req.params.id])
        res.customSuccess(200, "Posts", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }

}

// get the most recent post of each category and the date of the most recent activity
export const getMostRecentPostOfCategory = async (req, res, next) => {
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
    
        const data = await Query.runWithParams(query, [req.params.id])
    
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
export const getPostById = async (req, res, next) => {
    try {
        let commonQuery = `
            SELECT post.title, post.content, post.status, post.creation_date, post.last_update, users.username, avatar.src
            FROM post
            JOIN users ON post.user_id = users.id
            LEFT JOIN avatar ON avatar.user_id = users.id
            `;

        switch (req.user?.role) {
            case "admin":
                commonQuery += `
                WHERE post.id = ?`;
                break;
            case "user":
                commonQuery += `
                WHERE post.id = ? AND post.status = 'ok'`
                break;
            case null || undefined:
                commonQuery += `
                JOIN sub_forum ON post.sub_forum_id = sub_forum.id
                JOIN game_section ON sub_forum.game_section_id = game_section.id
                WHERE post.status = 'ok' AND post.id = ? AND game_section.visibility = 'Public'`
                break;
            }

        //could also use cache to store the number of views
        const data = await Query.runWithParams(commonQuery, [req.params.id])
        const view = "UPDATE post SET views = views + 1 WHERE id = ?";
        await Query.runWithParams(view, [req.params.id]);

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

// get the number of posts in a category
export const NumberOfPostByCategory = async (req, res, next) => {
    try {
        const query = "SELECT COUNT(*) as total FROM post WHERE sub_forum_id = ?";
        const data = await Query.runWithParams(query, [req.params.id]);
        res.customSuccess(200, "Nombre de posts", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// get the post info if the user is the author or an admin
export const getEditPostById = async (req, res, next) => {
    try {
        const query = `SELECT user_id, status, title, content 
                       FROM post 
                       WHERE id = ?`;
        const [data] = await Query.runWithParams(query, [req.params.id])
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

// get all the replies of a post
export const getReplyByPostId = async (req, res, next) => {
    try {
        const query = `SELECT post_reply.id, post_reply.content, post_reply.reply_date, post_reply.last_update, post_reply.status, users.username, avatar.src
                       FROM post_reply 
                       JOIN users ON post_reply.user_id = users.id
                       LEFT JOIN avatar ON avatar.user_id = users.id
                       WHERE post_reply.post_id = ?
                       ORDER BY reply_date ASC`;
    
        const data = await Query.runWithParams(query, [req.params.postId])
        data.map((reply) => {
            const reply_date = new Date(reply.reply_date);
            reply.reply_date = reply_date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'});
            if (reply.last_update === null) return;
            const last_update = new Date(reply.last_update);
            reply.last_update = last_update.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'});
        })
        res.customSuccess(200, "Réponses", data);
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
        const [checkData] = await Query.runWithParams(check, [req.params.id]);
        console.log(checkData);
        if (req.user.role !== "admin" && (checkData.user_id !== req.user.id || checkData.status === "locked" || checkData.status === "hidden")) {
            return res.customSuccess(403, "Unauthorized", {error: "Unauthorized"});
        }

        //compare image url with the one in the database
        //if the url is not in the database, delete the image from the server
        //if the url is in the database, do nothing
        const imageQuery = "SELECT url FROM image WHERE post_id = ?";
        const imageResult = await Query.runWithParams(imageQuery, [req.params.id]);


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
            await Query.runWithParams(imageQuery, [req.params.id, image]);
        }

        const query = "UPDATE post SET title = ?, content = ?, last_update = ? WHERE id = ?";
        const data = await Query.runWithParams(query, [title, content, new Date(), req.params.id]);
        res.customSuccess(200, "Post modifié", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// update the reply of a post
export const updateReply = async (req, res, next) => {
    try {
        const check = "SELECT status, post_id, user_id FROM post_reply WHERE id = ?";
        const [checkData] = await Query.runWithParams(check, [req.params.id]);
        if (req.user.role !== "admin" && (checkData.user_id !== req.user.id || checkData.status === "locked" || checkData.status === "hidden")) {
            return res.customSuccess(403, "Unauthorized", {error: "Unauthorized"});
        }

        //compare image url with the one in the database
        //if the url is not in the database, delete the image from the server
        //if the url is in the database, do nothing
        const imageQuery = "SELECT url FROM image WHERE reply_id = ?";
        const imageResult = await Query.runWithParams(imageQuery, [req.params.id]);


        // Get the image url from the content
        const regex = new RegExp(`http:\/\/localhost:9001\/public\/assets\/img\/post\/${checkData.post_id}\/\\w+\\.\\w+`, 'g');
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
            const imageQuery = "UPDATE image SET reply_id = ? WHERE url = ?";
            await Query.runWithParams(imageQuery, [req.params.id, image]);
        }

        const query = "UPDATE post_reply SET content = ?, last_update = ? WHERE id = ?";
        const data = await Query.runWithParams(query, [req.body.content, new Date(), req.params.id]);
        res.customSuccess(200, "Réponse modifiée", data);
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

// create a reply and return the id of the new reply
export const createReply = async (req, res, next) => {
    try {
        const { content, postId, url } = req.body;
        const query = "INSERT INTO post_reply (content, reply_date, status, post_id, user_id) VALUES (?, ?, ?, ?, ?)";
        const values = [content, new Date().toISOString().slice(0, 19).replace('T', ' '), "ok", postId, req.user.id];
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

// update the user info
// Not possible to set info to null or empty string
// This would need to be handled by a button 'delete my info'
export const updateUserInfo = async (req, res, next) => {
    try {
        const {email, currentPassword, newPassword} = req.body;
        const queryParam = [];
        
        let builtQuery = "UPDATE users SET ";

        if (email !== undefined && email !== "") {
            builtQuery += "email = ?";
            queryParam.push(email);
        } 

        if (currentPassword !== undefined && newPassword !== undefined) {
            const query = "SELECT password FROM users WHERE id = ?";
            const [data] = await Query.runWithParams(query, [req.params.userId]);
            if (!await bcrypt.compare(currentPassword, data.password)) {
                return res.status(403).json({error: "Mot de passe incorrect"});
            }
            if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
                const customError = new CustomError(
                    400, 
                    "Password error", 
                    "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial"
                    );
                return next(customError);
            }
            
            const hash = await bcrypt.hash(newPassword, Number(process.env.SALT));
            if (queryParam.length > 0) builtQuery += ", ";
            builtQuery += "password = ?"; 
            queryParam.push(hash);
        }

        builtQuery += " WHERE id = ?";
        queryParam.push(req.params.userId);
        const data = await Query.runWithParams(builtQuery, queryParam);
        res.customSuccess(200, "Utilisateur modifié", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// store the url of the image in the database
export const uploadImage = async (req, res, next) => {
    try {
        const url = `http://localhost:9001/public${req.files[0]}`;
        const query = "INSERT INTO image (url) VALUES (?)";
        const data = await Query.runWithParams(query, [url]);
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

// delete the avatar of the user
export const deleteAvatar = async (req, res, next) => {
    try {
        const checkQuery = "SELECT src FROM avatar WHERE user_id = ?";
        const [checkResult] = await Query.runWithParams(checkQuery, [req.params.userId]);
        if (req.user.id !== req.params.userId && req.user.role !== "admin") {
            const customError = new CustomError(403, "Unauthorized", "Unauthorized");
            return next(customError);
        }
        if (checkResult.src) {
            const url = new URL(checkResult.src);
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
        else {
            const customError = new CustomError(404, "Not found", "Pas d'avatar trouvé");
            return next(customError);
        }
        const query = "DELETE FROM avatar WHERE user_id = ?";
        const data = await Query.runWithParams(query, [req.params.userId]);
        res.customSuccess(200, "Avatar supprimé", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}