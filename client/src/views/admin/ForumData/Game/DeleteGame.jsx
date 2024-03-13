import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGames } from '../../../../store/slices/game'

import DeleteModal from '../../../DumbComponent/DeleteModal.jsx'

function DeleteGame() {
    const dispatch = useDispatch()
    const { games } = useSelector(state => state.game)
    const gameIdRef = useRef(null)
    const [showModal, setShowModal] = useState(false)
    const [msg, setMsg] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        dispatch(fetchGames())
    }, [])

    const handleDelete = async (e) => {
        e.preventDefault()
        setError('')
        setMsg('')
        const gameID = gameIdRef.current.value
        const res = await fetch(`http://localhost:9001/api/v1/admin/deleteGame/${gameID}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        const data = await res.json()
        if (res.ok) {
            setShowModal(false)
            setMsg(data.message)
            dispatch(fetchGames())
        }
        else {
            setShowModal(false)
            setError(data.errors)
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
            {msg && <p className='success'>{msg}</p>}
            {error && <p className='error'>{error}</p>}
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
            <DeleteModal handleDelete={handleDelete} setShowModal={setShowModal} />
        )}
    </>
    )
}

export default DeleteGame