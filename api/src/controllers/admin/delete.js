import Query from '../../model/Query.js';
import CustomError from '../../utils/customError/errorHandler.js';

// delete a game and cascade all elements related to it
export const deleteGame = async (req, res, next) => {
    try {
        const query = "DELETE FROM game_section WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.gameID]);

        if (data.affectedRows === 0) {
            const customError = new CustomError(404, "Not found", "Introuvable", "Le jeu n'existe pas");
            return next(customError);
        }
        res.customSuccess(200, "Jeux supprimé", "Le jeux a bien été supprimé", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// delete a section and cascade all elements related to it
export const deleteSection = async (req, res, next) => {
    try {
        const query = "DELETE FROM sub_forum WHERE id = ?";
        const data = await Query.runWithParams(query, [req.body.sectionId]);

        if (data.affectedRows === 0) {
            const customError = new CustomError(404, "Not found", "Introuvable", "La section n'existe pas");
            return next(customError);
        }
        res.customSuccess(200, "Section supprimée", "La section a bien été supprimée", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// delete a post and cascade all elements related to it
export const deletePost = async (req, res, next) => {
    try {
        const query = "DELETE FROM post WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.postID]);

        if (data.affectedRows === 0) {
            const customError = new CustomError(404, "Not found", "Introuvable", "Le post n'existe pas");
            return next(customError);
        }
        res.customSuccess(200, "Post supprimé", "Le post a bien été supprimé", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// delete a reply
export const deleteReply = async (req, res, next) => {
    try {
        const query = "DELETE FROM post_reply WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.replyID]);

        if (data.affectedRows === 0) {
            const customError = new CustomError(404, "Not found", "Introuvable", "La réponse n'existe pas");
            return next(customError);
        }
        res.customSuccess(200, "Réponse supprimée", "La réponse a bien été supprimée", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}