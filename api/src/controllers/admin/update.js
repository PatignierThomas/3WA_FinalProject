import Query from '../../model/Query.js';
import CustomError from '../../utils/customError/errorHandler.js';
import customSuccess from '../../utils/successRes.js';

export const updateGame = async (req, res) => {
    try {
        if (req.body.gameName === "" || req.body.description === "" || req.body.gameAge === "") {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "Veuillez remplir tous les champs");
            return next(customError);
        }
        const query = "UPDATE game_section SET game_name = ?, description = ?, minimal_age = ? WHERE id = ?";
        const data = await Query.runWithParams(query, [req.body.gameName, req.body.description, req.body.gameAge, req.params.id]);
        res.json(data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

export const updateSection = async (req, res, next) => {
    try {
        if (!req.body.sectionName || req.body.sectionName === "" || !req.body.gameId) {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "Veuillez remplir tous les champs");
            return next(customError);
        }
        const query = "UPDATE sub_forum SET subject = ?, game_section_id = ? WHERE id = ?";
        const data = await Query.runWithParams(query, [req.body.sectionName, req.body.gameId, req.params.id]);

        if (data.affectedRows === 0) {
            const customError = new CustomError(404, "Not found", "Introuvable", "La section n'existe pas");
            return next(customError);
        }
        res.customSuccess(200, "Section modifiée", "La section a bien été modifiée", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}