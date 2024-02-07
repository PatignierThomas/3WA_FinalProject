import React, { useEffect } from 'react'
import CreateGame from './ForumData/CreateGame'
import CreateSection from './ForumData/CreateSection'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

import { fetchGames } from '../../store/slices/game'
import { fetchSection } from '../../store/slices/section'
import { Link } from 'react-router-dom'
import { useState } from 'react'


function Panel() {
    const [data, setData] = useState(null)

    useEffect(() => {
        const getStats = async () => {
            const res = await fetch('http://localhost:9001/api/v1/admin/stats', {
                method: 'GET',
                credentials: 'include'
            })
            if (res.ok) {
                const data = await res.json()
                setData(data)
            }
        }
        getStats()
    }, [])


    return (
        <>
            <h1>Panel</h1>

            {
                data && data[0] && (
                    <>
                        <div>Nombre d'utilisateur: {data[0].total_users}</div>
                        <div>Nombre de jeux: {data[0].total_posts}</div>
                        <div>Nombre de catégories: {data[0].total_replies}</div>
                    </>
                )
            }
            
            <div><Link to="/admin/create-game">Créer un jeu</Link></div>
            <div><Link to="/admin/update-game">Modifier un jeu</Link></div>
            <br></br>
            <div><Link to="/admin/create-section">Créer une catégorie</Link></div>
            <div><Link to="/admin/update-section">Modifier une catégorie</Link></div>
            
        </>
    )
}

export default Panel