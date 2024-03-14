import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGames } from '../../../../store/slices/game.js'

function CreateSection() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { games } = useSelector(state => state.game)
    const [msg, setMsg] = useState('')
    const [error, setError] = useState('')
    const sectionNameRef = useRef(null)
    const descriptionRef = useRef(null)

    useEffect(() => {
        dispatch(fetchGames())
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMsg('')
        const description = descriptionRef.current.value
        const sectionName = sectionNameRef.current.value
        const gameId = e.target.game_section_id.value
        const res = await fetch('http://localhost:9001/api/v1/admin/createSection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ sectionName, description, gameId })
        })
        const data = await res.json()
        if (res.ok) {
            setMsg(data.message)
        } else {
            setError(data.errors)
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <fieldset>
                <legend>Créer une catégorie :</legend>
                {msg && <p className='success'>{msg}</p>}
                {error && <p className='error'>{error}</p>}
                <label htmlFor="sectionName">Nom de la catégorie :</label>
                <input 
                    ref={sectionNameRef}
                    type="text" 
                    name="gameName" 
                    id="gameName" 
                />
                <label htmlFor='description'>Description :</label>
                <textarea 
                    ref={descriptionRef}
                    name='description' 
                    id='newSectionDescription'
                    ></textarea>
                <label htmlFor="game_section_id">Jeu associé :</label>
                <select name="game_section_id" id="game_section_id">
                    {games.map((game) => (
                        <option key={game.id} value={game.id}>{game.game_name}</option>
                    ))}
                </select>

                <input type="submit" value="Créer" />
            </fieldset>
        </form>
    )
}

export default CreateSection