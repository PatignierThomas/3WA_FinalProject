import React, { useEffect } from 'react'
import slugify from 'slugify'
import { Link, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { fetchGames } from '../../store/slices/game.js'
import { fetchSection } from '../../store/slices/section.js'
import { fetchPosts } from '../../store/slices/post.js'

function SectionPost() {
    const dispatch = useDispatch()
    const { posts } = useSelector(state => state.post)
    const { role } = useSelector(state => state.user)
    const { sectionId } = useParams()
    const param = useParams()

    useEffect(() => {
        dispatch(fetchPosts())
    }, [])

    // format the title to be used as a slug
    // function createSlug(title) {
    //     return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    // }

    return (
    <main>
        <Link to={`/new/${param.sectionId}/create-post` }>Create a post</Link>
        {posts.map((post) => (
            ((post.status === "ok" || post.status === "locked") || (post.status === "hidden" && (role === "admin" || role === "moderator"))) &&
            <div key={post.id}>
                {post.sub_forum_id === Number(sectionId) && <Link to={`/post/${slugify(post.title, {lower: true})}/${post.id}`}>{post.title}</Link>}
            </div>
        ))}
    </main>
    )
}

export default SectionPost