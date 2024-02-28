import jwt from 'jsonwebtoken';
import "dotenv/config";

import CustomError from '../utils/customError/errorHandler.js';

const dotenv = process.env;

const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.TK_AUTH;
    if (!token) {
        const customError = new CustomError(403, "Token invalide", "Accès refusé", "Vous devez être connecté pour accéder à cette ressource");
        return next(customError);
    }
    jwt.verify(token, dotenv.SECRET_TOKEN, (err, decoded) => {
        if (err) {
            const customError = new CustomError(403, "Token invalide", "Accès refusé", "Vous devez être connecté pour accéder à cette ressource");
            return next(customError);
        }
        if (decoded.role !== "admin") {
            const customError = new CustomError(403, "Token invalide", "Accès refusé", "Vous n'avez pas les droits pour accéder à cette ressource");
            return next(customError);
        }
        req.user = decoded;
        next();
    });
}

export default verifyAdminToken;