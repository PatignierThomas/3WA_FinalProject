import Query from "../model/Query.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const dotenv = process.env;

export const register = async (req, res) => {
    const { username, email, password, birthdate } = req.body;
    const checkUser = "SELECT * FROM users WHERE username = ? OR email = ?";
    const [data] = await Query.runWithParams(checkUser, [username, email]);
    if (data) return res.json({error: "L'utilisateur existe déjà"});

    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const insertUser = "INSERT INTO users (username, birthdate, email, password, account_creation_date, account_status, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    const hash = await bcrypt.hash(password, Number(dotenv.SALT));

    const values = [username, birthdate, email, hash, date, "ok", 1];
    const result = await Query.runWithParams(insertUser, values);

    res.json({result});
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const query = `SELECT id, username, password, role_id, birthdate FROM users WHERE email = ?`;
        const values = [email];
        const [data] = await Query.runWithParams(query, values);
        
        if (!data || !(await bcrypt.compare(password, data.password))) {
            return res.json({error: "Mauvais nom d'utilisateur ou mot de passe"});
        }
    
        switch(data.role_id) {
            case 1:
                data.role_id = "user";
                break;
            case 2:
                data.role_id = "admin";
                break;
            case 3:
                data.role_id = "moderator";
                break;
            case 4:
                data.role_id = "developer";
                break;
        }

        //giving the user's age
        const birthdate = new Date(data.birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const month = today.getMonth() - birthdate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }

        const TOKEN = jwt.sign(
            { id: data.id, username: data.username, role: data.role_id, age}, // payload
            process.env.SECRET_TOKEN, // signature de vérification
            { expiresIn: "1h" }
        );
            
        res.cookie("TK_AUTH", TOKEN, { httpOnly: true, maxAge: 3600000, sameSite: 'none', secure: false});
        res.json({message: "Login Ok", username: data.username, role: data.role_id, age});
        }
        catch (error) {
            console.log(error);
            res.status(500).json({error: "Erreur serveur"});
    }
}

export const logout = (req, res) => {
    res.clearCookie("TK_AUTH");
    res.json({message: "Vous êtes déconnecté"});
}

export const checkToken = (req, res) => {
    res.json({message: "Token valide", username: req.user.username, role: req.user.role, age: req.user.age});
}

