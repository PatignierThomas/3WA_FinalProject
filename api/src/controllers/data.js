import Query from "../model/Query.js";
import bcrypt from "bcrypt";
import "dotenv/config";
import path, {dirname} from "path";
import { fileURLToPath } from "url";
import fs from "fs";

import CustomError from "../utils/customError/errorHandler.js";
import customSuccess from "../utils/successRes.js";

//get all games to logged user and public games to non-logged user
export const allGames = async (req, res, next) => {
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

// get all the subjects of one game
export const subjectByGameId = async (req, res, next) => {
    try {
        const query = `SELECT sf.id, sf.subject, sf.status, sf.description, sf.game_section_id, COUNT(post.id) as post_count
                       FROM sub_forum sf
                       LEFT JOIN post ON sf.id = post.sub_forum_id
                       WHERE sf.game_section_id = ?
                       GROUP BY sf.id`;
        const data = await Query.runWithParams(query, [req.params.gameID])
        res.customSuccess(200, "Sujets", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// get the number of posts in a category
export const numberOfPostByCategory = async (req, res, next) => {
    try {
        const query = "SELECT COUNT(id) as total FROM post WHERE sub_forum_id = ?";
        const data = await Query.runWithParams(query, [req.params.sectionID]);
        res.customSuccess(200, "Nombre de posts", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}