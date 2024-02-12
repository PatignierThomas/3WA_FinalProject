import jwt from 'jsonwebtoken';
import "dotenv/config";

const dotenv = process.env;

const verifyToken = (req, res, next) => {
    const token = req.cookies.TK_AUTH;
    if (!token) return res.json({error: "Accès refusé"});
    const check = jwt.verify(token, dotenv.SECRET_TOKEN);
    if (check) {
        req.user = check;
        next();
    } else {
        return res.json({error: "Accès refusé"});
    }
}

export default verifyToken;

// (err, user) => {
//     if (err) return res.status(403).json({error: "Token invalide"});
//     req.user = user;