import React, { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { fetchGames } from '../../store/slices/game.js'
import { fetchSection } from '../../store/slices/section.js'
import post, { fetchPost } from '../../store/slices/post.js'

function SinglePost() {
    const dispatch = useDispatch()
    const { posts, loading} = useSelector(state => state.post)
    const { postId }= useParams()

    // check token for a moderator or admin or dev
    useEffect(() => {
        dispatch(fetchPost(postId))
    }, [])
    
    return (
        <main>
            {!loading && posts.length > 0 && (
                <>
                    <h1>{posts[0].title}</h1>
                    <p>{posts[0].content}</p>
                </>
            )}
        </main>
    )
}

export default SinglePost