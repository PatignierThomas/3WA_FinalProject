import Query from "../model/Query.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import CustomError from "../utils/customError/errorHandler.js";
import customSuccess from "../utils/successRes.js";
import { getAge } from "../utils/date.js";

const dotenv = process.env;

export const register = async (req, res, next) => {
    try {
        const { username, email, password, birthdate } = req.body;
    
        if (!username || !email || !password || !birthdate) {
            const customError = new CustomError(403, "Missing fields", "Veuillez remplir tous les champs");
            return next(customError);
        }
        if (username.length < 3 || username.length > 20) {
            const customError = new CustomError(403, "Invalid username", "Le nom d'utilisateur doit contenir entre 3 et 20 caractères");
            return next(customError);
        }
        if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password) ) return res.status(403).json({error: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial"});
    
        const checkUser = "SELECT * FROM users WHERE username = ? OR email = ?";
        const [data] = await Query.runWithParams(checkUser, [username, email]);
        if (data) {
            const customError = new CustomError(403, "User already exists", "Un utilisateur avec ce nom d'utilisateur ou cette adresse mail existe déjà");
            return next(customError);
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

export const login = async (req, res, next) => {
    try {
        const { email, password, keepLoggedIn } = req.body;
        // verify if email is actually a mail 
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            console.log('email invalide')
            const customError = new CustomError(403, "Invalid email", "Email invalide");
            return next(customError);
        }

        // and password is at least 8 characters long with at least one number, one uppercase letter and one special character
        // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        // if (!passwordRegex.test(password)) {
        //     console.log('password invalide')
        //     const customError = new CustomError(403, "Invalid password", "Mot de passe invalide");
        //     return customError;
        // }

        const query = `
            SELECT users.id, users.username, users.password, users.email, users.birthdate, users.account_status, role.label
            FROM users 
            JOIN role ON users.role_id = role.id
            WHERE email = ?`;
        const values = [email];
        const [data] = await Query.runWithParams(query, values);

        if (!data || !(await bcrypt.compare(password, data.password))) {
            console.log('email ou mot de passe incorrect')
            const customError = new CustomError(401, "Invalid credentials", "Email ou mot de passe incorrect");
            return next(customError);
        }
        if (data.account_status === "banned") {
            const customError = new CustomError(403, "Account banned", "Votre compte a été banni");
            return next(customError);
        }

        // data.role_id = IDToLetterRoleSwitch(data.role_id);

        // store birthdate instead of age in the token
        const TOKEN = jwt.sign(
            // { id: data.id, username: data.username, role: data.role_id, age, keepLoggedIn, email: data.email}
            { id: data.id, username: data.username, role: data.label, birthdate: data.birthdate, keepLoggedIn, email: data.email},
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

        res.customSuccess(200, "Connexion réussie", {id: data.id, username: data.username, role: data.label, birthdate: data.birthdate, email: data.email});
        }
    catch (error) {
        console.log(error)
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return customError;
    }
}

export const logout = (req, res) => {
    res.clearCookie("TK_AUTH");
    res.customSuccess(200, "Déconnexion réussie", "Déconnexion réussie");
}

export const checkToken = (req, res) => {
    if (req.user) return res.customSuccess(200, "Token valide", {id: req.user.id, username: req.user.username, role: req.user.role, birthdate: req.user.birthdate, email : req.user.email});
    res.customSuccess(200, "No Token");
}

