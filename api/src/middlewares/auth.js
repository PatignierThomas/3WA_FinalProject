import jwt from 'jsonwebtoken';
import "dotenv/config";

const dotenv = process.env;

const verifyToken = (req, res, next) => {
    const token = req.cookies.TK_AUTH;
    if (!token) return res.json({error: "Accès refusé"});
    jwt.verify(token, dotenv.SECRET_TOKEN, (err, user) => {
        if (err) return res.status(403).json({error: "Token invalide"});
        req.user = user;
        next();
    });
}

export default verifyToken;