import Query from "../../model/Query.js";
import CustomError from '../../utils/customError/errorHandler.js';
import customSuccess from '../../utils/successRes.js';

export const lockPost = async (req, res) => {
    try {
        const query = "UPDATE post SET status = 'locked' WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.postID]);
        if (data.affectedRows === 0) {
            const customError = new CustomError(404, "Post not found", "Post non trouvé");
            return next(customError);
        }

        res.customSuccess(200, "Post locked", "Post locked");
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

export const unlockPost = async (req, res) => {
    try {
        const query = "UPDATE post SET status = 'ok' WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.postID]);
        if (data.affectedRows === 0) {
            const customError = new CustomError(404, "Post not found", "Post non trouvé");
            return next(customError);
        }
        res.customSuccess(200, "Post unlocked", "Post unlocked");
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

export const hidePost = async (req, res) => {
    try {
        const query = "UPDATE post SET status = 'hidden' WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.postID]);
        if (data.affectedRows === 0) {
            const customError = new CustomError(404, "Post not found", "Post non trouvé");
            return next(customError);
        }
        res.customSuccess(200, "Post hidden", "Post hidden");
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

export const showPost = async (req, res) => {
    try {
        const query = "UPDATE post SET status = 'ok' WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.postID]);
        if (data.affectedRows === 0) {
            const customError = new CustomError(404, "Post not found", "Post non trouvé");
            return next(customError);
        }
        res.customSuccess(200, "Post shown", "Post shown");
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

export const hideReply = async (req, res) => {
    try {
        const query = "UPDATE post_reply SET status = 'hidden' WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.replyID]);
        if (data.affectedRows === 0) {
            const customError = new CustomError(404, "Reply not found", "Réponse non trouvée");
            return next(customError);
        }
        res.customSuccess(200, "Reply hidden", "Réponse cachée");
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

export const showReply = async (req, res) => {
    try {
        const query = "UPDATE post_reply SET status = 'ok' WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.replyID]);
        if (data.affectedRows === 0) {
            const customError = new CustomError(404, "Reply not found", "Réponse non trouvée");
            return next(customError);
        }
        res.customSuccess(200, "Reply shown", "Réponse affichée");
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

