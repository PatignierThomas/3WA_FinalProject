import Query from "../model/Query.js";

import CustomError from "../utils/customError/errorHandler.js";
import customSuccess from "../utils/successRes.js";
import { getAge } from "../utils/date.js";

export const gameRestriction = async (req, res, next) => {
    try {
        const query = "SELECT minimal_age FROM game_section WHERE id = ?";
        const [data] = await Query.runWithParams(query, [req.params.gameID]);
        req.user.birthdate = new Date(req.user.birthdate);
        console.log(data.minimal_age, getAge(req.user.birthdate))
        if (data.minimal_age > getAge(req.user.birthdate)) {
            const customError = new CustomError(403, "Forbidden", "Vous n'avez pas l'âge requis pour accéder à ce jeu");
            return next(customError);
        }
        return res.customSuccess(200, "Accès autorisé");
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

export const sectionRestriction = async (req, res, next) => {
    try {
        const query = `
            SELECT game_section.minimal_age 
            FROM sub_forum 
            JOIN game_section ON sub_forum.game_section_id = game_section.id
            WHERE sub_forum.id = ?`;
        const [data] = await Query.runWithParams(query, [req.params.sectionID]);
        req.user.birthdate = new Date(req.user.birthdate);
        if (data.minimal_age > getAge(req.user.birthdate)) {
            const customError = new CustomError(403, "Forbidden", "Vous n'avez pas l'âge requis pour accéder à cette section");
            return next(customError);
        }
        return res.customSuccess(200, "Accès autorisé");
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

export const postRestriction = async (req, res, next) => {
    try {
        const query = `
            SELECT game_section.minimal_age 
            FROM sub_forum 
            JOIN game_section ON sub_forum.game_section_id = game_section.id
            JOIN post ON sub_forum.id = post.sub_forum_id
            WHERE post.id = ?`;
        const [data] = await Query.runWithParams(query, [req.params.postID]);
        req.user.birthdate = new Date(req.user.birthdate);
        if (data.minimal_age > getAge(req.user.birthdate)) {
            const customError = new CustomError(403, "Forbidden", "Vous n'avez pas l'âge requis pour accéder à ce post");
            return next(customError);
        }
        return res.customSuccess(200, "Accès autorisé");
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}