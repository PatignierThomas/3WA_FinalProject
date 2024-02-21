import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { logout } from "../store/slices/user.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { user, isLogged } = useSelector(state => state.user)

    const handleToggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

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
            <nav>
                <Link to="/">Ctrl Freak Studio</Link>
                <button
                    className="cta-menu"
                    onClick={handleToggleMenu}
                    title="Accéder au menu de navigation"
                    aria-label="Accéder au menu de navigation"
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <ul className={isMenuOpen ? 'open' : ''}>
                    <li><Link to="/">Home</Link></li>
                    {user.role === 'admin' ? <li><Link to="/admin">Admin</Link></li> : null}
                    {!isLogged ? <li><Link to="/inscription">Crée un compte</Link></li> : null} 
                    {isLogged ? 
                    <li><button onClick={handleLogout}>Se déconnecter</button></li> : 
                    <li><Link to="/connexion">Se connecter</Link></li>
                    }
                    {isLogged ? <li><Link to={`/profil`}>Profil</Link></li> : null}
                </ul>
            </nav>
        </header>
    )
}

export default Header