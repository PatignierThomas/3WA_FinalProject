import Query from '../../model/Query.js';
import { letterToIDRoleSwitch, IDToLetterRoleSwitch } from '../../utils/roleSwitch.js';
import CustomError from '../../utils/customError/errorHandler.js';
import customSuccess from '../../utils/successRes.js';

export const getAllUsers = async (req, res) => {
    try {
        const query = "SELECT * FROM users";
        const data = await Query.run(query);
        res.customSuccess(200, "Utilisateurs", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

export const getUserById = async (req, res) => {
    try {
        const query = "SELECT username, email, role_id AS role, account_status FROM users WHERE id = ?";
        const [data] = await Query.runWithParams(query, [req.params.userID]);
        if (!data) {
            const customError = new CustomError(404, "Not found", "Introuvable", "L'utilisateur n'existe pas");
            return next(customError);
        }
        data.role = IDToLetterRoleSwitch(data.role);
        res.customSuccess(200, "Utilisateur modifié", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

export const changeUserInfo = async (req, res) => {
    try {
        const {username, email, role, account_status} = req.body;

        if (!username || !email || !role || !account_status) {
            const customError = new CustomError(400, "Bad request", "Requête incorrecte", "Veuillez remplir tous les champs");
            return next(customError);
        }
        const query = "UPDATE users SET username = ?, email = ?, role_id = ?, account_status = ? WHERE id = ?";
        const data = await Query.runWithParams(query, [username, email, letterToIDRoleSwitch(role), account_status, req.params.userID]);

        res.customSuccess(200, "Utilisateur modifié", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}