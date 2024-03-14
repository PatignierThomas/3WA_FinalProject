import Query from '../../model/Query.js';
import { letterToIDRoleSwitch } from '../../utils/roleSwitch.js';
import CustomError from '../../utils/customError/errorHandler.js';
import customSuccess from '../../utils/successRes.js';


// return a object with the number of users linked to the size of the pagination and the total number of users
export const getAllUsers = async (req, res, next) => {
    try {
        const page = req.query.page ? req.query.page : 1;
        const limit = req.query.limit ? req.query.limit : 10;
        const offset = `${(page - 1) * limit}`
        let query = `
            SELECT id, username, email, role_id, account_status 
            FROM users`;

        let countQuery = `SELECT COUNT(id) AS total FROM users`;

        if (req.query.search) {
            query += ` WHERE username LIKE ?`;
            countQuery += ` WHERE username LIKE ?`;
            query += ` LIMIT ? OFFSET ?`
            const count = await Query.runWithParams(countQuery, [`${req.query.search}%`]);
            const searchData = await Query.runWithParams(query, [`${req.query.search}%`, limit, offset]);
            res.customSuccess(200, "Utilisateurs", {user : searchData, count: count[0].total});
        }
        else {
            query += ` LIMIT ? OFFSET ?`;
            const data = await Query.runWithParams(query, [limit, offset]);
            const count = await Query.runWithParams(countQuery, [limit, offset]);
            res.customSuccess(200, "Utilisateurs", {user: data, count: count[0].total});
        }
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}


// return the user's information
export const getUserById = async (req, res, next) => {
    try {
        const query = `
            SELECT users.username, users.email, users.account_status, role.label AS role
            FROM users 
            JOIN role ON users.role_id = role.id
            WHERE users.id = ?`;
        const [data] = await Query.runWithParams(query, [req.params.userID]);
        if (!data) {
            const customError = new CustomError(404, "Not found", "Introuvable", "L'utilisateur n'existe pas");
            return next(customError);
        }
        res.customSuccess(200, "Utilisateur modifié", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// change the user's information and return the new user's information
export const changeUserInfo = async (req, res, next) => {
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