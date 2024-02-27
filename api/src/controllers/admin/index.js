import Query from '../../model/Query.js';
import { letterToIDRoleSwitch, IDToLetterRoleSwitch } from '../../utils/roleSwitch.js';
import CustomError from '../../utils/customError/errorHandler.js';
import customSuccess from '../../utils/successRes.js';

export const getStats = async (req, res) => {
    try {
        const stats = `
        SELECT 
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM post) AS total_posts,
            (SELECT COUNT(*) FROM post_reply) AS total_replies;
        `;
        const data = await Query.run(stats);
        res.customSuccess(200, "Statistiques", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

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
        const [data] = await Query.runWithParams(query, [req.params.id]);
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

export const hidePost = async (req, res) => {
    try {
        const query = "UPDATE post SET status = 'hidden' WHERE id = ?";
        const data = await Query.runWithParams(query, [req.params.id]);
        if (data.affectedRows === 0) {
            const customError = new CustomError(404, "Not found", "Introuvable", "Le post n'existe pas");
            return next(customError);
        }
        res.customSuccess(200, "Post caché", data);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({error: "Erreur serveur"});
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
        const data = await Query.runWithParams(query, [username, email, letterToIDRoleSwitch(role), account_status, req.params.userId]);

        res.customSuccess(200, "Utilisateur modifié", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}

// UNUSED
// will generate a random password and update the user's password
// then send the new password to the user's email
// OR it could send a mail to the user with a link to reset the password
export const resetPassword = async (req, res) => {
    const newPassword = "1234";
    const hash = await bcrypt.hash(newPassword, Number(dotenv.SALT));

    const updateUser = "UPDATE users SET password = ? WHERE id = ?";
    const result = await Query.runWithParams(updateUser, [hash, req.params.id]);

    res.json({result});
}




