import React, { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchPost } from '../../store/slices/post.js';
import { useSelector } from 'react-redux';

function UpdatePost() {

    const param = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    useEffect(() => {
        const fetchPost = async () => { 
            const res = await fetch(`http://localhost:9001/api/v1/data/get/edit/post/${param.postId}`, {
                credentials: 'include'
                })
            const data = await res.json()
            if (!res.ok) {
                navigate('/404')
            }
            setContent(data.content)
            setTitle(data.title)
        }
        fetchPost()
    }, [param.postId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch(`http://localhost:9001/api/v1/data/post/editPost/${param.postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ title, content: content})
        })
        if (res.ok) {
            navigate(-1)
            console.log('Post crée')
        }
    }
    return (
    <form onSubmit={handleSubmit}>
        <label>Titre</label>
        <input type="text" name="title" id="title" value={title} onChange={e => setTitle(e.target.value)}/>
        <ReactQuill theme="snow" value={content} onChange={setContent}/>
        <input type="submit" value="Editer" />
    </form>
    )
}

export default UpdatePost