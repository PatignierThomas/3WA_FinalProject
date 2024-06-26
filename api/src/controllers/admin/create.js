import Query from '../../model/Query.js';
import CustomError from '../../utils/customError/errorHandler.js';

// create a new game, check if the form is filled and if the age is above 13
export const createGame = async (req, res, next) => {
    try {
        if (req.body.gameName === "" || req.body.description === "" || req.body.gameAge === "" || req.body.visibility === "") {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "Un ou plusieurs champs sont manquants");
            return next(customError);
        }

        if (req.body.gameAge < 13) {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "L'âge minimum doit être de 13 ans");
            return next(customError);
        }

        const query = "INSERT INTO game_section (game_name, description, minimal_age, visibility) VALUES (?, ?, ?, ?)";
        const data = await Query.runWithParams(query, [req.body.gameName, req.body.description, req.body.gameAge, req.body.visibility]);
        res.customSuccess(201, "Jeu créé", "Le jeu a bien été créé", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// create a new section, check if the form is filled
export const createSection = async (req, res, next) => {
    try {
        if (req.body.sectionName === "" || req.body.gameId === "" || req.body.description === "") {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "Un ou plusieurs champs sont manquants");
            return next(customError);
        }
        const query = "INSERT INTO sub_forum (subject, status, description, game_section_id) VALUES (?, ?, ?, ?)";
        const data = await Query.runWithParams(query, [req.body.sectionName, "ok", req.body.description, req.body.gameId]);
        res.customSuccess(201, "Section créée", "La section a bien été créée", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}