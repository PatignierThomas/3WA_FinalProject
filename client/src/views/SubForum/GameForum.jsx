import React, { useEffect } from 'react'
import slugify from 'slugify'
import { Link, useParams, useMatch } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSection } from '../../store/slices/section.js'

function GameForum() {
    const matchPublic = useMatch('/open/main/:game/:gameId');
    const isPublicRoute = matchPublic != null;
    const dispatch = useDispatch();
    const { section } = useSelector(state => state.section);
    const { gameId } = useParams();
    
    useEffect(() => {
        dispatch(fetchSection())
    }, []);

    return (
        <main>
        {section.map((section) => (
            <div key={section.id}>
                {(!isPublicRoute && section.game_section_id === Number(gameId)) ? 
                <Link to={`/section/${slugify(section.subject, {lower: true})}/${section.id}`}>{section.subject}</Link> 
                : section.game_section_id === Number(gameId) && 
                <Link to={`/open/sec/${slugify(section.subject, {lower: true})}/${section.id}`}>{section.subject}</Link>}
            </div>
        ))}
        </main>
    )
}

export default GameForum