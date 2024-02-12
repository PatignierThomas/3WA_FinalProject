import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGames } from '../../../../store/slices/game.js'

function CreateSection() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { games } = useSelector(state => state.game)
    const sectionNameRef = useRef(null)

    useEffect(() => {
        dispatch(fetchGames())
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const sectionName = sectionNameRef.current.value
        const gameId = e.target.game_section_id.value
        const res = await fetch('http://localhost:9001/api/v1/admin/createSection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ sectionName, gameId })
        })
        if (res.ok) {
            console.log('Section crée')
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <legend>Créer une catégorie :</legend>
            <label htmlFor="sectionName">Nom de la catégorie :</label>
            <input 
                ref={sectionNameRef}
                type="text" 
                name="gameName" 
                id="gameName" 
            />
            <label htmlFor="game_section_id">Jeu associé :</label>
            <select name="game_section_id" id="game_section_id">
                {games.map((game) => (
                    <option key={game.id} value={game.id}>{game.game_name}</option>
                ))}
            </select>

            <input type="submit" value="Créer" />
        </form>
    )
}

export default CreateSection