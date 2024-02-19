import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGames } from '../../../../store/slices/game'
import { fetchSection } from '../../../../store/slices/section'

function DeleteSection() {
    const dispatch = useDispatch()
    const { section } = useSelector(state => state.section)
    const { games } = useSelector(state => state.game)

    const [formValues, setFormValues] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [selectedGameId, setSelectedGameId] = useState(null)

    useEffect(() => {
        dispatch(fetchGames())
        dispatch(fetchSection())
    }, [])

    const handleChange = (gameId, field, value) => {
        setFormValues(prev => ({ ...prev, [`${gameId}-${field}`]: value }))
    }

    const handleDelete = async () => {
        const sectionId = formValues[`${selectedGameId}-sectionId`]
        const res = await fetch(`http://localhost:9001/api/v1/admin/deleteSection/${sectionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ sectionId })
        })
        if (res.ok) {
            setShowModal(false)
            dispatch(fetchSection())

        }
    }

    const handleSubmit = (e, gameId) => {
        e.preventDefault()
        setShowModal(true)
        setSelectedGameId(gameId)
    }

    return (
        <>
        <h2>Supprimer une section :</h2>
        {games.map((game) => (
            <form key={game.id} onSubmit={(e) => handleSubmit(e, game.id)} > 
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
                <button type="submit">Delete Section</button>
            </form>
        ))}
        {showModal && (
            <div className="modal">
                <p>Are you sure you want to delete this section?</p>
                <button onClick={handleDelete}>Yes</button>
                <button onClick={() => setShowModal(false)}>No</button>
            </div>
        )}
    </>
    )
}

export default DeleteSection