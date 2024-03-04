import React from 'react'
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import user from '../../store/slices/user';


function Register() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({ username: "", email: "", password: "", birthdate: "" });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value })
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    useEffect(() => {
        setPasswordsMatch(userInfo.password === confirmPassword);
    }, [userInfo.password, confirmPassword]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPasswordsMatch(userInfo.password === confirmPassword);
        if (!passwordsMatch) {
            setError("Passwords do not match");
            return;
        }

        //check if the user is over 13
        const birthdate = new Date(userInfo.birthdate);
        const now = new Date();
        let age = now.getFullYear() - birthdate.getFullYear();
        if (now.getMonth() < birthdate.getMonth() || (now.getMonth() === birthdate.getMonth() && now.getDate() < birthdate.getDate())) {
            age--;
        }
        if (age < 13) {
            setError("You must be at least 13 years old to register");
            return;
        }

        try {
            const response = await fetch("http://localhost:9001/api/v1/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userInfo),
            });
            if (response.ok) {
                navigate("/connexion");
            } else {
                const data = await response.json();
                setError(data.errorMessage);
            }
        } catch (error) {
            setError("An error occurred while registering");
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <legend>S'inscrire</legend>
            <label htmlFor="username">Nom d'utilisateur :</label>
            <input 
                type="text" 
                name="username" 
                id="username" 
                onChange={handleChange}
            />
            <label htmlFor="email">Email :</label>
            <input 
                type="email" 
                name="email" 
                id="email" 
                onChange={handleChange}
            />
            <label htmlFor="password">Mot de passe :</label>
            <input 
                type="password" 
                name="password" 
                id="password" 
                onChange={handleChange} 
                className={userInfo.password && confirmPassword && passwordsMatch ? 'password-match' : ''}
            />
            <label htmlFor="password">Confirmer mot de passe :</label>
            <input 
                type="password"
                name="confirmPassword" 
                id="confirmPassword" 
                onChange={handleConfirmPasswordChange} 
                className={userInfo.password && confirmPassword && passwordsMatch ? 'password-match' : ''}
            />
            <label htmlFor="birthdate">Date de naissance :</label>
            <input 
                type="date" 
                name="birthdate" 
                id="birthdate" 
                onChange={handleChange}
            />

            <input type="submit" value="S'inscrire" />
            {error && <p>{error}</p>}
        </form>
    )
}

export default Register