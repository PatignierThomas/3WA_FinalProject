import jwt from 'jsonwebtoken';
import "dotenv/config";

import CustomError from "../utils/customError/errorHandler.js";

const dotenv = process.env;

const verifyToken = (req, res, next) => {
    console.log("auth")
    const token = req.cookies.TK_AUTH;
    if (!token) {
        const customError = new CustomError(403, "Token invalide", "Accès refusé", "Vous devez être connecté pour accéder à cette ressource");
        return next(customError);
    }
    const check = jwt.verify(token, dotenv.SECRET_TOKEN);
    if (check) {
        req.user = check;
        next();
    } else {
        const customError = new CustomError(403, "Token invalide", "Accès refusé", "Vous devez être connecté pour accéder à cette ressource");
        return next(customError);
    }
}

export default verifyToken;