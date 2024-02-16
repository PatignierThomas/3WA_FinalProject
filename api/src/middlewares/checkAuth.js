import jwt from 'jsonwebtoken';
import "dotenv/config";

const dotenv = process.env;

const checkToken = (req, res, next) => {
    const token = req.cookies.TK_AUTH;
    if (!token) return next();
    const check = jwt.verify(token, dotenv.SECRET_TOKEN);
    if (check) {
        req.user = check;
        next();
    } 
}

export default checkToken;