import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { logout } from "../store/slices/user.js";

function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { username, role, isLogged } = useSelector(state => state.user)

    const handleLogout = async () => {
        const res = await fetch('http://localhost:9001/api/v1/auth/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        if (res.ok) {
            dispatch(logout())
            navigate('/')
        }

    }
    return (
        <header>
            <h1>Welcome {username}</h1>
            <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                {role === 'admin' ? <li><Link to="/admin">Admin</Link></li> : null}
                {!isLogged ? <li><Link to="/inscription">Crée un compte</Link></li> : null} 
                {isLogged ? 
                <li><button onClick={handleLogout}>Se déconnecter</button></li> : 
                <li><Link to="/connexion">Se connecter</Link></li>
                }
            </ul>
            </nav>
        </header>
    )
}

export default Header