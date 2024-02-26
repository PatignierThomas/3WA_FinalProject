import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import { fetchPost } from '../../store/slices/post.js'
import { fetchReply } from '../../store/slices/reply.js'
import TextEditor from './TextEditor.jsx'

function SinglePost() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { postId } = useParams()
    const { user, isLogged } = useSelector(state => state.user)
    const { posts, loading} = useSelector(state => state.post)
    const { replies } = useSelector(state => state.reply)

    const [images, setImages] = useState([])

    const [value, setValue] = useState('');
    const quillRef = useRef(); // Create a Ref
    
    const [editingReply, setEditingReply] = useState(null);
    const [isLocked, setIsLocked] = useState(false);

    // check token for a moderator or admin or dev
    useEffect(() => {
        dispatch(fetchPost(postId))
        dispatch(fetchReply(postId))
    }, [])
    
    const handleSubmit = async (e) => {
        e.preventDefault()

        const url = await submitPost();

        console.log(url)

        if (!editingReply) {
            const res = await fetch('http://localhost:9001/api/v1/data/post/createReply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ postId, url, content: quillRef.current.value})
            })
            if (res.ok) {
                console.log(quillRef.current.value)
            }
        } 
        if (editingReply) {
            const res = await fetch(`http://localhost:9001/api/v1/data/post/editReply/${editingReply.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ postId, url, content: quillRef.current.value})
            })
            if (res.ok) {
                console.log('Réponse éditée')
            }
        }
        
        dispatch(fetchReply(postId))
        setEditingReply(null)
        setValue('')
        setImages([])
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

    const handleShowPost = async () => {
        const res = await fetch(`http://localhost:9001/api/v1/moderator/showPost/${postId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            console.log('Post has been shown')
            navigate(-1);
        }
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
    
    const handleHideReply = async (replyId) => {
        const res = await fetch(`http://localhost:9001/api/v1/moderator/hideReply/${replyId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            console.log('Réponse cachée')
            dispatch(fetchReply(postId))
        }
    }
    
    const handleShowReply = async (replyId) => {
        const res = await fetch(`http://localhost:9001/api/v1/moderator/showReply/${replyId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            console.log('Réponse affichée')
            dispatch(fetchReply(postId))
        }
    }

    // format url to avoid spaces and special characters
    const handleEdit = () => {
        navigate(`/edit/${postId}/${posts[0].title}`)
    }

    const handleReplyEdit = (reply) => {
        setValue(reply.content)
        setEditingReply(reply)
    }

    const cancel = () => {
        setEditingReply(null)
        setValue('')
    }

    const submitPost = async () => {
        // Upload all images
        const url = []
        for (const image of images) {
            const formData = new FormData();
            formData.append('postId', postId);
            formData.append('image', image.file);

            const res = await fetch('http://localhost:9001/api/v1/data/upload/image', {
                method: 'POST',
                body: formData, // update with your image data
                credentials: 'include'
            });
            const data = await res.json();
            if(res.ok) {
                url.push(data.url)
            }
            else console.log(data.error)

            // Remove placeholder image
            quillRef.current.getEditor().deleteText(image.range.index, 1);

            // Insert uploaded image
            quillRef.current.getEditor().insertEmbed(image.range.index, 'image', data.url);

            // Move cursor to right side of image (easier to continue typing)
            quillRef.current.getEditor().setSelection(image.range.index + 1);
        }
        return url
    };
    // const [value, setValue] = useState('');
    
    // data received with React-quill will be writen in a Delta format, stringified into a JSON object, 
    // saved in DB, and parsed back to a Delta format when retrieved from DB
    
    return (
        <main>
            {loading && <p>Chargement...</p>}
            { (posts[0] && (user.username === posts[0].username || (user.role === "admin" || user.role === "moderator"))  && !loading) && (
                <button onClick={handleEdit}>Editer</button>
                )
            }
            { ((user.role === "admin" || user.role === "moderator") && !loading) && (
                <>
                    {posts[0].status === "locked" ? 
                        <button onClick={handleUnlock}>Unlock</button> : 
                        <button onClick={handleLock}>Lock</button>
                    }
                    {posts[0].status === "hidden" ?
                        <button onClick={handleShowPost}>Show</button> :
                        <button onClick={handleHidePost}>Hide</button>
                    }
                </>
            )}
            { (user.role === "admin" && !loading) && (
                <button onClick={handleDeletePost}>Delete</button>
            )}
            {!loading && posts.length > 0 && (
                <article>
                    <h1>{posts[0].title}</h1>
                    <p>{posts[0].username}</p>
                    {posts[0].src === null ? 
                    <img src={`http://localhost:9001/public/assets/img/avatar/default.png`} alt={`Avatar de ${posts[0].username}`} /> 
                    : <img src={posts[0].src} alt={`Avatar de ${posts[0].username}`} />}
                    <p>{posts[0].creation_date}</p>
                    {posts[0].last_update && <p>Modifié le {posts[0].last_update}</p>}
                    <div dangerouslySetInnerHTML={{ __html: posts[0].content }} />
                </article>
            )}
            {(user.role === "admin" || user.role === "moderator" ? replies : replies.filter(reply => reply.status === "ok")).map((reply) => {
                return (
                    <article key={reply.id}>
                        {((reply && user.username === reply.username) || user.role === "admin" || user.role === "moderator") && 
                            <button onClick={() => handleReplyEdit(reply)}>Editer réponse</button>}  
                        {((user.role === "admin" || user.role === "moderator") && !loading) &&
                            <button onClick={() => handleDeleteReply(reply.id)}>Supprimer réponse</button>
                        }
                        {((user.role === "admin" || user.role === "moderator") && !loading) &&
                        (reply.status === "hidden" ? 
                            <button onClick={() => handleShowReply(reply.id)}>Afficher réponse</button> : 
                            <button onClick={() => handleHideReply(reply.id)}>Cacher réponse</button>
                        )}

                        <p>{reply.username}</p>
                        {reply.src === null ? 
                            <img src={`http://localhost:9001/public/assets/img/avatar/default.png`} alt={`Avatar de ${reply.username}`} /> 
                            : <img src={reply.src} alt={`Avatar de ${reply.username}`} />}
                        <p>{reply.reply_date}</p>
                        {reply.last_update && <p>Modifié le {reply.last_update}</p>}
                        <div dangerouslySetInnerHTML={{ __html: reply.content }} />
                    </article>
                );
            })}
            {(!loading && posts[0] && posts[0].status !== "locked" && isLogged) &&
            <form onSubmit={handleSubmit}>
                {editingReply && <p>You are editing a reply. <button onClick={() => cancel()}>Cancel</button></p>}
                <TextEditor value={value} setValue={setValue} quillRef={quillRef} images={images} setImages={setImages}/>
                <button type="submit">{editingReply ? 'Update Reply' : 'Reply'}</button>
            </form>}
        </main>
    )
}

export default SinglePost