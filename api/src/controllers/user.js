import Query from "../model/Query.js";
import bcrypt from "bcrypt";

import CustomError from "../utils/customError/errorHandler.js";
import customSuccess from "../utils/successRes.js";

// update the user info
// Not possible to set info to null or empty string
// This would need to be handled by a button 'delete my info'
export const updateUserInfo = async (req, res, next) => {
    try {
        if (req.user.id !== Number(req.params.userID)) {
            const customError = new CustomError(403, "Forbidden", "Vous n'avez pas les droits pour effectuer cette action");
            return next(customError);
        }
        const {email, currentPassword, newPassword} = req.body;
        const queryParam = [];
        
        let builtQuery = "UPDATE users SET ";

        if (email !== undefined && email !== "") {
            builtQuery += "email = ?";
            queryParam.push(email);
        } 

        if (currentPassword !== undefined && newPassword !== undefined) {
            const query = "SELECT password FROM users WHERE id = ?";
            const [data] = await Query.runWithParams(query, [req.params.userID]);
            if (!await bcrypt.compare(currentPassword, data.password)) {
                const customError = new CustomError(403, "Password error", "Mot de passe incorrect");
                return next(customError);
            }
            if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[A-Z]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
                const customError = new CustomError(
                    400, 
                    "Password error", 
                    "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial"
                    );
                return next(customError);
            }
            const hash = await bcrypt.hash(newPassword, Number(process.env.SALT));
            if (queryParam.length > 0) builtQuery += ", ";
            builtQuery += "password = ?"; 
            queryParam.push(hash);
        }

        builtQuery += " WHERE id = ?";
        queryParam.push(req.params.userID);
        const data = await Query.runWithParams(builtQuery, queryParam);
        res.customSuccess(200, "Utilisateur modifié", data);
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return next(customError);
    }
}