import React, { useEffect, useRef, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchPost } from '../../store/slices/post.js';
import { useSelector } from 'react-redux';

import TextEditor from './TextEditor.jsx'

function UpdatePost() {
    const param = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [value, setValue] = useState('')
    const quillRef = useRef()

    useEffect(() => {
        const fetchPost = async () => { 
            const res = await fetch(`http://localhost:9001/api/v1/data/get/edit/post/${param.postId}`, {
                credentials: 'include'
                })
            const data = await res.json()
            if (!res.ok) {
                navigate('/404')
            }
            console.log(data)
            setTitle(data.title)
            setValue(data.content)
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
            body: JSON.stringify({ title, content: quillRef.current.value})
        })
        if (res.ok) {
            navigate(-1)
            console.log('Post édité')
        }
    }
    return (
    <form onSubmit={handleSubmit}>
        <label>Titre</label>
        <input type="text" name="title" id="title" value={title} onChange={e => setTitle(e.target.value)}/>
        <TextEditor value={value} setValue={setValue} quillRef={quillRef}/>
        <input type="submit" value="Editer" />
    </form>
    )
}

export default UpdatePost