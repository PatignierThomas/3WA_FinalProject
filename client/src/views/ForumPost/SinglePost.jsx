import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import { fetchPost } from '../../store/slices/post.js'
import { fetchReply } from '../../store/slices/reply.js'

function SinglePost() {
    const dispatch = useDispatch()
    const { postId }= useParams()
    const { posts, loading} = useSelector(state => state.post)
    const { replies } = useSelector(state => state.reply)
    const { id } = useSelector(state => state.user)

    const [value, setValue] = useState('')

    console.log(id)

    // check token for a moderator or admin or dev
    useEffect(() => {
        dispatch(fetchPost(postId))
        dispatch(fetchReply(postId))
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch('http://localhost:9001/api/v1/data/post/createReply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ content: value, postId})
        })
        if (res.ok) {
            console.log('Réponse crée')
        }
    }

    // data received with React-quill will be writen in a Delta format, stringified into a JSON object, 
    // saved in DB, and parsed back to a Delta format when retrieved from DB
    
    return (
        <main>
            {!loading && posts.length > 0 && (
                <article>
                    <h1>{posts[0].title}</h1>
                    <p>{posts[0].username}</p>
                    <p>{posts[0].creation_date}</p>
                    {posts[0].last_update && <p>Modifié le {posts[0].last_update}</p>}
                    <div dangerouslySetInnerHTML={{ __html: posts[0].content }} />
                </article>
            )}
            {replies.map((reply) => (
                <article key={reply.id}>
                    <p>{reply.username}</p>
                    <p>{reply.reply_date}</p>
                    {reply.last_update && <p>Modifié le {reply.last_update}</p>}
                    <div dangerouslySetInnerHTML={{ __html: reply.content }} />
                </article>
            ))}
            <form onSubmit={handleSubmit}>
                <ReactQuill theme="snow" value={value} onChange={setValue} />
                <input type="submit" value="Répondre" />
            </form>

        </main>
    )
}

export default SinglePost