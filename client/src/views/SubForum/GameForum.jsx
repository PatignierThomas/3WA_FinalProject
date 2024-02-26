import React, { useEffect, useState } from 'react'
import slugify from 'slugify'
import { Link, useParams, useMatch } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSection } from '../../store/slices/section.js'
import { mostRecentPost } from '../../store/slices/post.js'

function GameForum() {
    const matchPublic = useMatch('/open/main/:game/:gameId');
    const isPublicRoute = matchPublic != null;
    const dispatch = useDispatch();
    const { section } = useSelector(state => state.section);
    const { posts } = useSelector(state => state.post);
    const { gameId } = useParams();

    const [ recentPosts, setRecentPosts ] = useState([])
    
    useEffect(() => {
        dispatch(fetchSection(gameId))
    }, []);

    useEffect(() => {
        dispatch(mostRecentPost(gameId))
    }
    , [gameId])

    useEffect(() => {
        setRecentPosts(posts)
    }, [posts])

    return (
        <main>
        {section.map((section) => 
            {const recentPost = recentPosts.find(post => post.subID === section.id);
         return (
            <div key={section.id}>
                {(!isPublicRoute && section.game_section_id === Number(gameId)) ? 
                <>
                    <Link to={`/section/${slugify(section.subject, {lower: true})}/${section.id}`}>{section.subject}</Link> 
                    <p>Posts: {section.post_count}</p>
                    {recentPost && <p>Latest Post: {recentPost.title}</p>}
                    {recentPost && <p>Author: {recentPost.username}</p>}
                </>
                : section.game_section_id === Number(gameId) && 
                <>
                    <Link to={`/open/sec/${slugify(section.subject, {lower: true})}/${section.id}`}>{section.subject}</Link>
                    <p>Posts: {section.post_count}</p>
                    {recentPost && <p>Latest Post: {recentPost.title} </p>}
                    {recentPost && <p>Author: {recentPost.username} </p>}

                </>
                }
            </div>
            )}
        )}
        </main>
    )
}

export default GameForum