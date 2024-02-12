import React, { useEffect } from 'react'
import slugify from 'slugify'
import { Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGames } from '../../store/slices/game.js'
import { fetchSection } from '../../store/slices/section.js'

function ColorfullWorld() {
    const dispatch = useDispatch()
    const { section } = useSelector(state => state.section)
    const { gameId } = useParams()
    
    useEffect(() => {
        dispatch(fetchSection())
    }, [])

    return (
        <main>
        {section.map((section) => (
            <div key={section.id}>
                {section.game_section_id === Number(gameId) ? <Link to={`/section/${slugify(section.subject, {lower: true})}/${section.id}`}>{section.subject}</Link> : null}
            </div>
        ))}
        </main>
    )
}

export default ColorfullWorld