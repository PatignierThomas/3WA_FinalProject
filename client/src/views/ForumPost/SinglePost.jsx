import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import { fetchPost } from '../../store/slices/post.js'
import { fetchReply } from '../../store/slices/reply.js'

function SinglePost() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { postId }= useParams()
    const { isLogged, role } = useSelector(state => state.user)
    const { posts, loading} = useSelector(state => state.post)
    const { replies } = useSelector(state => state.reply)

    const [value, setValue] = useState('');
    const [isLocked, setIsLocked] = useState(false);


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

    const handleLock = async () => {
        const res = await fetch(`http://localhost:9001/api/v1/moderator/lockPost/${postId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            console.log('Post has been locked')
            setIsLocked(true);
            navigate(-1);
        }
    }

    const handleUnlock = async () => {
        const res = await fetch(`http://localhost:9001/api/v1/moderator/unlockPost/${postId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            console.log('Post has been unlocked')
            setIsLocked(false);
            navigate(-1);
        }
    }

    const handleDeletePost = async () => {
        const res = await fetch(`http://localhost:9001/api/v1/admin/deletePost/${postId}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            console.log("post has been deleted")
            navigate(-1);
        }
    }

    const handleHidePost = async () => {
        const res = await fetch(`http://localhost:9001/api/v1/moderator/hidePost/${postId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            console.log('Post has been hidden')
            navigate(-1);
        }
    }
    const handleEdit = () => {
        navigate(`/forum/post/edit/${postId}`)
    }

    const handleDeleteReply = async (replyId) => {
        const res = await fetch(`http://localhost:9001/api/v1/admin/deleteReply/${replyId}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            console.log('Réponse supprimée')
            dispatch(fetchReply(postId))
        }
    }


    // data received with React-quill will be writen in a Delta format, stringified into a JSON object, 
    // saved in DB, and parsed back to a Delta format when retrieved from DB
    
    return (
        <main>
            { ((role === "admin" || role === "moderator") && !loading) && (
                <>
                    {posts[0].status === "locked" ? (<button onClick={handleUnlock}>Unlock</button>) 
                    : (<button onClick={handleLock}>Lock</button>)}
                    <button onClick={handleHidePost}>Hide</button>
                </>
            )}
            { (role === "admin" && !loading) && (
                <button onClick={handleDeletePost}>Delete</button>
            )}
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
            {(!loading && posts[0] && posts[0].status !== "locked") &&
            <form onSubmit={handleSubmit}>
                <ReactQuill theme="snow" value={value} onChange={setValue} />
                <input type="submit" value="Répondre" />
            </form>}
        </main>
    )
}

export default SinglePost