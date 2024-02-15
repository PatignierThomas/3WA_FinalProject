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

    useEffect(() => {
        const getlastPost = async (gameId) => {
            const res = await fetch(`http://localhost:9001/api/v1/data/get/most/recent/post/${gameId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            const lastPost = await res.json();
            console.log(lastPost)
        }
        getlastPost(gameId)
    }
    , [gameId])

    return (
        <main>
        {section.map((section) => (
            <div key={section.id}>
                {(!isPublicRoute && section.game_section_id === Number(gameId)) ? 

                // TODO : get most recent post for each section
                <>
                    <Link to={`/section/${slugify(section.subject, {lower: true})}/${section.id}`}>{section.subject}</Link> 
                    <p>Posts: {section.post_count}</p>
                </>
                : section.game_section_id === Number(gameId) && 
                <>
                    <Link to={`/open/sec/${slugify(section.subject, {lower: true})}/${section.id}`}>{section.subject}</Link>
                    <p>Posts: {section.post_count}</p>
                </>
                }
            </div>
        ))}
        </main>
    )
}

export default GameForum