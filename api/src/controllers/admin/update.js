import Query from '../../model/Query.js';
import CustomError from '../../utils/customError/errorHandler.js';

// update a game, check if the form is filled and if the age is above 13
export const updateGame = async (req, res) => {
    try {
        if (req.body.gameName === "" || req.body.description === "" || req.body.gameAge === "") {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "Veuillez remplir tous les champs");
            return next(customError);
        }

        if (req.body.gameAge < 13) {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "L'âge minimum doit être de 13 ans");
            return next(customError);
        }
        const query = "UPDATE game_section SET game_name = ?, description = ?, minimal_age = ? WHERE id = ?";
        const data = await Query.runWithParams(query, [req.body.gameName, req.body.description, req.body.gameAge, req.params.gameID]);
        res.customSuccess(200, "Jeu modifié", "Le jeu a bien été modifié", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// update a section, check if the form is filled and return an error if the section does not exist
export const updateSection = async (req, res, next) => {
    try {
        if (!req.body.sectionName || !req.body.description || !req.body.gameId ) {
            const customError = new CustomError(400, "Bad request", "Requête invalide", "Veuillez remplir tous les champs");
            return next(customError);
        }
        const query = "UPDATE sub_forum SET subject = ?, description = ?, game_section_id = ? WHERE id = ?";
        const data = await Query.runWithParams(query, [req.body.sectionName, req.body.description, req.body.gameId, req.params.sectionID]);

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