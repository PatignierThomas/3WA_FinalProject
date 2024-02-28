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

    const [msg, setMsg] = useState("");

    useEffect(() => {
        emailRef.current.focus();
    }, [msg]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            const keepLoggedIn = keepLoggedInRef.current.checked;
            const datas = { email, password, keepLoggedIn };
            const response = await fetch("http://localhost:9001/api/v1/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(datas),
                credentials: 'include',
            });
            if (response.ok) {
                const result = await response.json();
                if (result.errors) {
                    setMsg(result.errors);
                    return;
                }
                dispatch(login(result.data));

                navigate("/");
            } else {
                setMsg("Une erreur s'est produite");
            }
        } catch (error) {
            setMsg("Une erreur s'est produite");
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email :</label>
            <input ref={emailRef} type="mail" name="email" id="email" />
            <label htmlFor="password">Password</label>
            <input ref={passwordRef} type="password" name="password" id="password" />
            <label htmlFor="keepLoggedIn">Rester connecté</label>
            <input ref={keepLoggedInRef} type="checkbox" name="keepLoggedIn" id="keepLoggedIn" />
            <input type="submit" value="Se connecter" />
            <Link to="/inscription">S'inscrire</Link>
            {msg && <p>{msg}</p>}
        </form>
    )
}

export default Login