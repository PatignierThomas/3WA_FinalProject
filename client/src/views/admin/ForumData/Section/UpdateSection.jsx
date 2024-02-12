import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGames } from '../../../../store/slices/game'
import { fetchSection } from '../../../../store/slices/section'

function UpdateSection() {
    const dispatch = useDispatch()
    const { games } = useSelector(state => state.game)
    const { section } = useSelector(state => state.section)

    const [formValues, setFormValues] = useState({})

    useEffect(() => {
        dispatch(fetchGames())
        dispatch(fetchSection())
    }, [])

    const handleChange = (gameId, field, value) => {
        setFormValues(prev => ({ ...prev, [`${gameId}-${field}`]: value }))
    }

    const handleSubmit = async (e, gameId) => {
        e.preventDefault()
        const sectionId = formValues[`${gameId}-sectionId`]
        const sectionName = formValues[`${gameId}-sectionName`]
        console.log(sectionId, sectionName)
        const res = await fetch(`http://localhost:9001/api/v1/admin/updateSection/${sectionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ gameId, sectionName })
        })
        if (res.ok) {
            const data = await res.json()
            console.log(data)
        }
    }

    return (
    <>
        <h2>Modifier une section :</h2>
        {games.map((game) => (
            <form key={game.id} onSubmit={(e) => handleSubmit(e, game.id)}>
                <h2>{game.game_name}</h2>
                <label htmlFor={`sectionName-${game.id}`}>Nom de la section :</label>
                <select 
                    name={`sectionName-${game.id}`} 
                    id={`updateSectionName-${game.id}`}
                    onChange={(e) => handleChange(game.id, 'sectionId', e.target.value)}
                >
                    <option value="">--Please choose an option--</option>
                    {section
                        .filter(sec => sec.game_section_id === game.id)
                        .map((sec) => (
                            <option key={sec.id} value={sec.id}>{sec.subject}</option>
                        ))}
                </select>
                <label htmlFor={`newName-${game.id}`}>Nouveau nom :</label>
                <input 
                    type="text" 
                    name={`newName-${game.id}`} 
                    id={`updateSectionName-${game.id}`}
                    onChange={(e) => handleChange(game.id, 'sectionName', e.target.value)}
                />
                <button type="submit">Update Section</button>
            </form>
        ))}
    </>
    )
}

export default UpdateSection