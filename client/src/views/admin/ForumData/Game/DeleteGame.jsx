import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGames } from '../../../../store/slices/game'

function DeleteGame() {
    const dispatch = useDispatch()
    const { games } = useSelector(state => state.game)
    const gameIdRef = useRef(null)
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        dispatch(fetchGames())
    }, [])

    const handleDelete = async (e) => {
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

    const handleSubmit = (e) => {
        e.preventDefault()
        setShowModal(true)
        dispatch(fetchGames())
    }

    return (
    <>
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
        {showModal && (
            <div>
                <p>Êtes-vous sûr de vouloir supprimer ce jeu ?</p>
                <button onClick={handleDelete}>Oui</button>
                <button onClick={() => setShowModal(false)}>Non</button>
            </div>
        )}
    </>
    )
}

export default DeleteGame