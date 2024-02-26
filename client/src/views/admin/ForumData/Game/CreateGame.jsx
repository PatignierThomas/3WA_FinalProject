import React, { useState } from 'react'
import { useRef } from 'react'

// SELECT p.id as postID, pr.id, pr.reply_date, p.title, p.creation_date, p.views, p.user_id
//     FROM post_reply pr
//     JOIN post p ON p.id = pr.post_id
//     JOIN (
//         SELECT post_id, MAX(reply_date) as max_reply_date
//         FROM post_reply
//         WHERE status = 'ok'
//         GROUP BY post_id
//     ) pr_max ON pr.post_id = pr_max.post_id AND pr.reply_date = pr_max.max_reply_date
//     WHERE p.sub_forum_id = ?
//     ORDER BY pr.reply_date DESC;

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

    console.log(error)
    return (
        <main>
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
        </main>
    )
}

export default CreateGame