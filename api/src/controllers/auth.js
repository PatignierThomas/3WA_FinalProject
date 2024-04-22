import Query from "../model/Query.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import CustomError from "../utils/customError/errorHandler.js";
import customSuccess from "../utils/successRes.js";

const dotenv = process.env;

// check for missing fields and if the username is already taken
// then hash the password and insert the user in the database
// return a success message
export const register = async (req, res, next) => {
    try {
        const { username, email, password, birthdate } = req.body;
    
        if (!username || !email || !password || !birthdate) {
            const customError = new CustomError(403, "Missing fields", "Veuillez remplir tous les champs");
            return next(customError);
        }
        if (username.length < 3 || username.length > 50) {
            const customError = new CustomError(403, "Invalid username", "Le nom d'utilisateur doit contenir entre 3 et 50 caractères");
            return next(customError);
        }
        if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(password) ) {
            const customError = new CustomError(403, "Invalid password", "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial");
            return next(customError);
        }    
        const checkUser = "SELECT id FROM users WHERE username = ? OR email = ?";
        const [data] = await Query.runWithParams(checkUser, [username, email]);
        if (data) {
            const customError = new CustomError(403, "User already exists", "Un utilisateur avec ce nom d'utilisateur ou cette adresse mail existe déjà");
            return next(customError);
        }
    
        const date = new Date();
    
        const insertUser = `INSERT INTO users 
                            (username, birthdate, email, password, account_creation_date, account_status, role_id) 
                            VALUES (?, ?, ?, ?, ?, ?, ?)`;
        
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

// check if the email exists and if the password match the criteria
// then create a token and store it in a cookie
// if keepLoggedIn is true, the cookie will be persistent
// else it will be a session cookie
// return a success message with the user's id, username and role
export const login = async (req, res, next) => {
    try {
        const { email, password, keepLoggedIn } = req.body;
        // verify if email is actually a mail 
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            const customError = new CustomError(403, "Invalid email", "Veuillez entrer une adresse mail valide");
            return next(customError);
        }

        // and password is at least 8 characters long with at least one number, one uppercase letter and one special character
        // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        // if (!passwordRegex.test(password)) {
        //     const customError = new CustomError(403, "Invalid password", "Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial");
        //     return next(customError);
        // }

        const query = `
            SELECT users.id, users.username, users.password, users.email, users.birthdate, users.account_status, role.label
            FROM users 
            JOIN role ON users.role_id = role.id
            WHERE email = ?`;
        const values = [email];
        const [data] = await Query.runWithParams(query, values);

        if (!data || !(await bcrypt.compare(password, data.password))) {
            const customError = new CustomError(401, "Invalid credentials", "Email ou mot de passe incorrect");
            return next(customError);
        }
        if (data.account_status === "banned") {
            const customError = new CustomError(403, "Account banned", "Votre compte a été banni");
            return next(customError);
        }

        // store birthdate instead of age in the token
        const TOKEN = jwt.sign(
            // { id: data.id, username: data.username, role: data.role_id, age, keepLoggedIn, email: data.email}
            { id: data.id, username: data.username, role: data.label, birthdate: data.birthdate, keepLoggedIn, email: data.email},
            process.env.SECRET_TOKEN,
            { expiresIn: "30d" }
        );

        if (keepLoggedIn) {
            // Set a persistent cookie if keepLoggedIn is true (30 days)
            res.cookie("TK_AUTH", TOKEN, { httpOnly: true, maxAge: 2592000000, sameSite: 'lax', secure: true });
        } else {
            // Set a session cookie if keepLoggedIn is false
            res.cookie("TK_AUTH", TOKEN, { httpOnly: true, sameSite: 'lax', secure: true });
        }

        res.customSuccess(200, "Connexion réussie", {id: data.id, username: data.username, role: data.label, birthdate: data.birthdate, email: data.email});
        }
    catch (error) {
        const customError = new CustomError(500, "Database error", "Erreur serveur", error);
        return customError;
    }
}

// clear the cookie and return a success message
export const logout = (req, res) => {
    res.clearCookie("TK_AUTH");
    res.customSuccess(200, "Déconnexion réussie", "Déconnexion réussie");
}

// check if the token is valid and return the user's id, username, role and birthdate
export const checkToken = (req, res) => {
    if (req.user) return res.customSuccess(200, "Token valide", {id: req.user.id, username: req.user.username, role: req.user.role, birthdate: req.user.birthdate, email : req.user.email});
    res.customSuccess(200, "No Token");
}

