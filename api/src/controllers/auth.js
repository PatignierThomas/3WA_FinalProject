import Query from "../model/Query.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import CustomError from "../utils/customError/errorHandler.js";
import customSuccess from "../utils/successRes.js";
import { IDToLetterRoleSwitch } from '../utils/roleSwitch.js';
import { getAge } from "../utils/date.js";

const dotenv = process.env;

export const register = async (req, res) => {
    try {
        const { username, email, password, birthdate } = req.body;
    
        if (!username || !email || !password || !birthdate) return res.status(403).json({error: "Veuillez remplir tous les champs"});
        if (username.length < 3 || username.length > 20) return res.status(403).json({error: "Le nom d'utilisateur doit contenir entre 3 et 20 caractères"});
        if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password) ) return res.status(403).json({error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial"});
    
        const checkUser = "SELECT * FROM users WHERE username = ? OR email = ?";
        const [data] = await Query.runWithParams(checkUser, [username, email]);
        if (data) {
            const customError = new CustomError(403, "User already exists", "Un utilisateur avec ce nom d'utilisateur ou cette adresse mail existe déjà");
            return customError;
        }
    
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
        const insertUser = "INSERT INTO users (username, birthdate, email, password, account_creation_date, account_status, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        const hash = await bcrypt.hash(password, Number(dotenv.SALT));
    
        const values = [username, birthdate, email, hash, date, "ok", 1];
        const result = await Query.runWithParams(insertUser, values);
    
        res.customSuccess(201, "Utilisateur créé", "Utilisateur créé avec succès");
    }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return customError;
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, keepLoggedIn } = req.body;
        const query = `SELECT id, username, password, email, role_id, birthdate, account_status FROM users WHERE email = ?`;
        const values = [email];
        const [data] = await Query.runWithParams(query, values);

        if (!data || !(await bcrypt.compare(password, data.password))) {
            const customError = new CustomError(401, "Invalid credentials", "Email ou mot de passe incorrect");
            return customError;
        }
        if (data.account_status === "banned") {
            const customError = new CustomError(403, "Account banned", "Votre compte a été banni");
            return customError;
        }
    
        data.role_id = IDToLetterRoleSwitch(data.role_id);
        const age = getAge(data.birthdate);

        const TOKEN = jwt.sign(
            { id: data.id, username: data.username, role: data.role_id, age, keepLoggedIn, email: data.email},
            process.env.SECRET_TOKEN,
            { expiresIn: "30d" }
        );

        if (keepLoggedIn) {
            // Set a persistent cookie if keepLoggedIn is true
            res.cookie("TK_AUTH", TOKEN, { httpOnly: true, maxAge: 2592000000, sameSite: 'lax', secure: true });
        } else {
            // Set a session cookie if keepLoggedIn is false
            res.cookie("TK_AUTH", TOKEN, { httpOnly: true, sameSite: 'lax', secure: true });
        }

        res.customSuccess(200, "Connexion réussie", {id: data.id, username: data.username, role: data.role_id, age, email: data.email});
        }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return customError;
    }
}

export const logout = (req, res) => {
    res.clearCookie("TK_AUTH");
    res.customSuccess(200, "Déconnexion réussie", "Déconnexion réussie");
}

export const checkToken = (req, res) => {
    res.customSuccess(200, "Token valide", {id: req.user.id, username: req.user.username, role: req.user.role, age: req.user.age, email : req.user.email});
}

