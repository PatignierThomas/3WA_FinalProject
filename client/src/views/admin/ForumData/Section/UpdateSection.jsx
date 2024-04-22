import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGames } from '../../../../store/slices/game'
import { fetchAllSections } from '../../../../store/slices/section'

function UpdateSection() {
    const dispatch = useDispatch()
    const { games } = useSelector(state => state.game)
    const { section } = useSelector(state => state.section)
    const [msg, setMsg] = useState('')
    const [error, setError] = useState(null)

    const [formValues, setFormValues] = useState({})
    const [selectedGame, setSelectedGame] = useState(null);


    useEffect(() => {
        dispatch(fetchGames())
        dispatch(fetchAllSections())
    }, [])

    const handleChange = (field, value) => {
        setFormValues(prev => ({ ...prev, [field]: value }))
    }
    

    const handleSubmit = async (e, gameId) => {
        e.preventDefault()
        const sectionId = formValues['sectionId']
        const sectionName = formValues['newName']
        const description = formValues['newDescription']
        const res = await fetch(`http://localhost:9001/api/v1/admin/updateSection/${sectionId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ gameId, sectionName, description })
        })
        const result = await res.json()
        if (res.ok) {
            setMsg(result.message)
            dispatch(fetchAllSections())
        }
        else {
            setError(result.errors)
        }
    }
    const handleSectionChange = (e, gameId) => {
        const selectedSectionId = e.target.value;
        const selectedSection = section.find(sec => sec.id === Number(selectedSectionId));
        if (selectedSection) {
            setFormValues(prev => ({
                ...prev,
                sectionId: selectedSection.id,
                newName: selectedSection.subject,
                newDescription: selectedSection.description,
            }));
        } else {
            setFormValues(prev => ({
                ...prev,
                sectionId: '',
                newName: '',
                newDescription: '',
            }));
        }
    }

    const handleGameChange = (e) => {
        const selectedGame = e.target.value;
        setSelectedGame(selectedGame);
        setFormValues(prev => ({ ...prev, gameId: selectedGame }));
    }

    return (
        <form onSubmit={(e) => handleSubmit(e, selectedGame)}>
            <fieldset>
                <legend>Modifier une section :</legend>
                {msg && <p className='success'>{msg}</p>}
                {error && <p className='error'>{error}</p>}
                <label htmlFor="game">Game:</label>
                <select id="game" onChange={handleGameChange}>
                    <option value="">--Please choose a game--</option>
                    {games.map((game) => (
                        <option key={game.id} value={game.id}>{game.game_name}</option>
                    ))}
                </select>
                {selectedGame && (
                    <>
                        {error && <p>{error}</p>}
                        <label htmlFor="sectionName">Nom de la section :</label>
                        <select 
                            name="sectionId" 
                            id="updateSectionName"
                            onChange={handleSectionChange}
                        >
                            <option value="">--Please choose an option--</option>
                            {section
                                .filter(sec => sec.game_section_id === Number(selectedGame))
                                .map((sec) => (
                                    <option key={sec.id} value={sec.id}>{sec.subject}</option>
                                ))}
                        </select>
                        <label htmlFor="newName">Nouveau nom :</label>
                        <input 
                            type="text" 
                            name="newName" 
                            id="newName"
                            value={formValues['newName'] || ''}
                            onChange={(e) => handleChange('newName', e.target.value)}
                        />
                        <label htmlFor="newDescription">Nouvelle description :</label>
                        <textarea 
                            name="newDescription"
                            id="newSectionDescription"
                            value={formValues['newDescription'] || ''}
                            onChange={(e) => handleChange('newDescription', e.target.value)}
                        ></textarea>
                        <button type="submit">Update Section</button>
                    </>
                )}
            </fieldset>
        </form>
    )
}

export default UpdateSection