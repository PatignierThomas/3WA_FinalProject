import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { fetchSection } from '../../store/slices/section.js'
import slugify from 'slugify'

// Unsued , to be deleted
function PublicForum() {
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

export default PublicForum