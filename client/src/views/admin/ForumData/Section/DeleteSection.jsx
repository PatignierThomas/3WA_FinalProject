import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGames } from '../../../../store/slices/game'
import { fetchAllSections } from '../../../../store/slices/section'

import DeleteModal from '../../../DumbComponent/DeleteModal.jsx'

function DeleteSection() {
    const dispatch = useDispatch()
    const { section } = useSelector(state => state.section)
    const { games } = useSelector(state => state.game)
    const [formValues, setFormValues] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [msg, setMsg] = useState('')
    const [error, setError] = useState('')


    useEffect(() => {
        dispatch(fetchGames())
        dispatch(fetchAllSections())
    }, [])

    const handleChange = (field, value) => {
        setFormValues(prev => ({ ...prev, [field]: value }))
    }

    const handleDelete = async () => {
        const sectionId = formValues['sectionId']
        const res = await fetch(`http://localhost:9001/api/v1/admin/deleteSection/${sectionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ sectionId })
        })
        const data = await res.json()
        if (res.ok) {
            setShowModal(false)
            setMsg(data.message)
            dispatch(fetchAllSections())
        }
        else {
            setShowModal(false)
            setError(data.errors)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setShowModal(true)
    }

    return (
        <>
            <form onSubmit={handleSubmit}> 
                <legend>Supprimer une section :</legend>
                {msg && <p className='success'>{msg}</p>}
                {error && <p className='error'>{error}</p>}
                <label htmlFor="gameId">Game:</label>
                <select 
                    name="gameId" 
                    id="gameId"
                    onChange={(e) => handleChange('gameId', e.target.value)}
                >
                    <option value="">--Please choose an option--</option>
                    {games.map((game) => (
                        <option key={game.id} value={game.id}>{game.game_name}</option>
                    ))}
                </select>
                {formValues.gameId && (
                <>
                    <label htmlFor="sectionId">Nom de la section :</label>
                    <select 
                        name="sectionId" 
                        id="sectionId"
                        onChange={(e) => handleChange('sectionId', e.target.value)}
                    >
                        <option value="">--Please choose an option--</option>
                        {section
                            .filter(sec => sec.game_section_id === Number(formValues.gameId))
                            .map((sec) => (
                                <option key={sec.id} value={sec.id}>{sec.subject}</option>
                            ))}
                    </select>
                </>
            )}
                <button type="submit">Delete Section</button>
            </form>
            {showModal && (
                <DeleteModal handleDelete={handleDelete} setShowModal={setShowModal} />
            )}
        </>
    )
}

export default DeleteSection