import Query from '../../model/Query.js';
import CustomError from '../../utils/customError/errorHandler.js';
import customSuccess from '../../utils/successRes.js';

export const createGame = async (req, res, next) => {
    try {
        if (req.body.gameName === "" || req.body.description === "" || req.body.gameAge === "" || req.body.visibility === "") {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "Un ou plusieurs champs sont manquants");
            return next(customError);
        }

        const query = "INSERT INTO game_section (game_name, description, minimal_age, visibility) VALUES (?, ?, ?, ?)";
        const data = await Query.runWithParams(query, [req.body.gameName, req.body.description, req.body.gameAge, req.body.visibility]);
        res.customSuccess(201, "Jeux créé", "Le jeux a bien été créé", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

export const createSection = async (req, res, next) => {
    try {
        if (req.body.sectionName === "" || req.body.gameId === "") {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "Un ou plusieurs champs sont manquants");
            return next(customError);
        }
        const query = "INSERT INTO sub_forum (subject, status, game_section_id) VALUES (?, ?, ?)";
        const data = await Query.runWithParams(query, [req.body.sectionName, "ok", req.body.gameId]);
        res.customSuccess(201, "Section créée", "La section a bien été créée", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}