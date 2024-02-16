import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGames } from '../../../../store/slices/game'

function DeleteGame() {
    const dispatch = useDispatch()
    const { games } = useSelector(state => state.game)
    const gameIdRef = useRef(null)

    useEffect(() => {
        dispatch(fetchGames())
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const gameId = gameIdRef.current.value
        const res = await fetch(`http://localhost:9001/api/v1/admin/deleteGame/${gameId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ gameId })
        })
        if (res.ok) {
            console.log('Jeu supprimé')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <legend>Supprimer un jeu</legend>
            <label htmlFor="gameId">Nom du jeu :</label>
            <select ref={gameIdRef} name="gameId" id="deleteGameId">
                {
                    games.map((game) => {
                        return (
                            <option key={game.id} value={game.id}>{game.game_name}</option>
                        )
                    })
                }
            </select>
            <input type="submit" value="Supprimer" />
        </form>
    )
}

export default DeleteGame