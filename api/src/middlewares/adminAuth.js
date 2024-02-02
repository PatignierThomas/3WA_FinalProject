import jwt from 'jsonwebtoken';
import "dotenv/config";

const dotenv = process.env;

const verifyAdminToken = (req, res, next) => {
    const token = req.cookies.TK_AUTH;
    if (!token) return res.status(401).json({error: "Accès refusé"});
    jwt.verify(token, dotenv.SECRET_TOKEN, (err, decoded) => {
        if (err) return res.status(403).json({error: "Token invalide"});
        if (decoded.role !== "admin") return res.status(403).json({error: "Accès refusé"});
        req.user = decoded;
        next();
    });
}

export default verifyAdminToken;