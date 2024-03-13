import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { fetchGames } from '../../../../store/slices/game.js'


// preload form with game data
function UpdateGame() {
    const dispatch = useDispatch()
    const { games } = useSelector(state => state.game)
    const [selectedGame, setSelectedGame] = useState({})
    const [msg, setMsg] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        dispatch(fetchGames())
    }, [])

    const newGameNameRef = useRef(null)
    const gameAgeRef = useRef(null)
    const gameIdRef = useRef(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMsg('')
        const gameId = selectedGame.id
        const gameName = selectedGame.game_name
        const gameAge = selectedGame.minimal_age
        const visibility = selectedGame.visibility
        const description = selectedGame.description

        const res = await fetch(`http://localhost:9001/api/v1/admin/updateGame/${gameId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ gameName, gameAge, visibility, description})
        })
        const data = await res.json()
        if (res.ok) {
            setMsg(data.message)
        }
        else {
            setError(data.errors)
        }
    }

    const handleGameChange = (e) => {
        const selectedGameId = e.target.value;
        const selectedGame = games.find(game => game.id === Number(selectedGameId));
        setSelectedGame(selectedGame || {});
    }

    return (
        <form onSubmit={handleSubmit}>
            <legend>Modifier un jeu :</legend>
            {msg && <p className='success'>{msg}</p>}
            {error && <p className='error'>{error}</p>}
            <label htmlFor="gameName">Nom du jeu :</label>
            <select onChange={handleGameChange} name="gameName" id="updateGameName">
                <option value="">--Please choose an option--</option>
                {games.map((data) => (
                    <option key={data.id} value={data.id}>{data.game_name}</option>
                ))}
            </select>
            <label htmlFor="newName">Nouveau nom :</label>
            <input 
                type="text" 
                name="newName" 
                id="updateGameName"
                value={selectedGame.game_name || ''}
                onChange={(e) => setSelectedGame({...selectedGame, game_name: e.target.value})}
            />
            <label htmlFor="gameAge">Age minimal :</label>
            <input 
                type="number" 
                name="gameAge" 
                id="updateGameAge"
                min="13"
                value={selectedGame.minimal_age|| ''}
                onChange={(e) => setSelectedGame({...selectedGame, minimal_age: e.target.value})}
            />
            <label htmlFor="visibility">Visibilité :</label>
            <select name="visibility" id="visibility" value={selectedGame.visibility || ''} onChange={(e) => setSelectedGame({...selectedGame, visibility: e.target.value})}>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
            </select>

            <label htmlFor="description">Description :</label>
            <textarea 
                name="description" 
                id="description" 
                value={selectedGame.description || ''} 
                onChange={(e) => setSelectedGame({...selectedGame, description: e.target.value})}
            >
            </textarea>
            <input type="submit" value="Modifier" />
        </form>
    )
}

export default UpdateGame