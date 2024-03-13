import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { logout } from "../store/slices/user.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/img/logo.jpg";

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
                <div className='brand'>
                    <Link to="/"> 
                        <img src={logo} alt="Logo de Ctrl Freak"/> Ctrl Freak Studio
                    </Link>
                </div>
                <button
                    className="cta-menu"
                    onClick={handleToggleMenu}
                    title="Accéder au menu de navigation"
                    aria-label="Accéder au menu de navigation"
                >
                    <FontAwesomeIcon icon={faBars} />
                </button>
                <ul className={isMenuOpen ? 'open' : ''}>
                    <Link to="/"><li>Accueil</li></Link>
                    {user.role === 'admin' ? <Link to="/admin"><li>Admin</li></Link> : null}
                    {!isLogged ? <Link to="/inscription"><li>Créer un compte</li></Link> : null} 
                    {isLogged ? 
                    <button onClick={handleLogout}><li>Se déconnecter</li></button> : 
                    <Link to="/connexion"><li>Se connecter</li></Link>
                    }
                    {isLogged ? <Link to={`/profil`}><li>Profil</li></Link> : null}
                </ul>
            </nav>
        </header>
    )
}

export default Header