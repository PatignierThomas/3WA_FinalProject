import React from 'react'
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { login } from "../../store/slices/user.js";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const emailRef = useRef();
    const passwordRef = useRef();
    const keepLoggedInRef = useRef();

    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const datas = { 
                email       : emailRef.current.value, 
                password    : passwordRef.current.value, 
                keepLoggedIn: keepLoggedInRef.current.checked
            };
            const response = await fetch("http://localhost:9001/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datas),
                credentials: 'include',
            })
            if (response.ok) {
                const result = await response.json();
                dispatch(login(result.data));
                navigate("/");
            } else {
                const result = await response.json();
                setError(result.errorMessage);
                return;
            }
        } catch (error) {
            setError(error);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend>Connexion</legend>
                {error && <p>{error}</p>}
                <label htmlFor="email">Email :</label>
                <input ref={emailRef} type="email" name="email" id="email" />
                <label htmlFor="password">Mot de passe (au moins 8 caractères, 1 minuscule, 1 majuscule, 1 chiffre et 1 symbole): </label>
                <input ref={passwordRef} type="password" name="password" id="password"/>
                <label htmlFor="keepLoggedIn">Rester connecté</label>
                <input ref={keepLoggedInRef} type="checkbox" name="keepLoggedIn" id="keepLoggedIn" />
                <input type="submit" value="Se connecter" />
                <Link to="/inscription">S'inscrire</Link>
            </fieldset>
        </form>
    )
}

export default Login