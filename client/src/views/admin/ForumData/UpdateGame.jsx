import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { fetchGames } from '../../../store/slices/game.js'

function UpdateGame() {
    const dispatch = useDispatch()
    const { games } = useSelector(state => state.game)

    useEffect(() => {
        dispatch(fetchGames())
    }, [])

    const newGameNameRef = useRef(null)
    const gameAgeRef = useRef(null)
    const gameIdRef = useRef(null)
    const handleSubmit = async (e) => {
        e.preventDefault()
        const gameName = newGameNameRef.current.value
        const gameAge = gameAgeRef.current.value
        const gameId = gameIdRef.current.value
        const res = await fetch(`http://localhost:9001/api/v1/admin/updateGame/${gameId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ gameName, gameId, gameAge })
        })
        if (res.ok) {
            console.log('Jeu modifié')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <legend>Modifier un jeu :</legend>
            <label htmlFor="gameName">Nom du jeu :</label>
            <select ref={gameIdRef} name="gameName" id="updateGameName">
                {games.map((data) => (
                    <option key={data.id} value={data.id}>{data.game_name}</option>
                ))}
            </select>
            <label htmlFor="newName">Nouveau nom :</label>
            <input 
                ref={newGameNameRef}
                type="text" 
                name="newName" 
                id="updateGameName"
            />
            <label htmlFor="gameAge">Age minimal :</label>
            <input 
                ref={gameAgeRef}
                type="number" 
                name="gameAge" 
                id="updateGameAge" 
            />
            <input type="submit" value="Modifier" />
        </form>
    )
}

export default UpdateGame