import React, { useState } from 'react'
import { useRef } from 'react'

function CreateGame() {
    const gameNameRef = useRef(null)
    const gameAgeRef = useRef(null)
    const visibilityRef = useRef(null)
    const descriptionRef = useRef(null)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const gameName = gameNameRef.current.value
        const gameAge = gameAgeRef.current.value
        const visibility = visibilityRef.current.value
        const description = descriptionRef.current.value
        const res = await fetch('http://localhost:9001/api/v1/admin/createGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ gameName, gameAge, visibility, description })
        })
        const data = await res.json()
        if (res.ok) {
            console.log(data)
        } else {
            setError(data.errors)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <legend>Créer un jeu</legend>
            {error && <p>{error}</p>}
            <label htmlFor="gameName">Nom du jeu :</label>
            <input 
                ref={gameNameRef}
                type="text" 
                name="gameName" 
                id="createGameName" 
            />
            <label htmlFor="gameAge">Age minimum :</label>
            <input 
                ref={gameAgeRef}
                type="number" 
                name="gameAge"
                defaultValue="13"
                id="createGameAge"
                min="13"
            />
            <label htmlFor="visibility">Visibilité :</label>
            <select ref={visibilityRef} name="visibility" id="visibility">
                <option value="Public">Public</option>
                <option value="Private">Private</option>
            </select>

            <label htmlFor="description">Description :</label>
            <textarea ref={descriptionRef} name="description" id="description"></textarea>

            <input type="submit" value="Créer" />
        </form>
    )
}

export default CreateGame