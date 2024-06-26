import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import TextEditor from './TextEditor.jsx'
import useSubmitPost from '../../hooks/useSubmitPost.js';

function UpdatePost() {
    const param = useParams()
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [value, setValue] = useState('')
    const [images, setImages] = useState([])
    const [error, setError] = useState(null)
    const quillRef = useRef()

    useEffect(() => {
        const fetchPost = async () => { 
            const res = await fetch(`http://localhost:9001/api/v1/post/info/${param.postId}`, {
                credentials: 'include'
                })
            const result = await res.json()
            if (!res.ok) {
                navigate('/404')
            }
            setTitle(result.data.title)
            setValue(result.data.content)
        }
        fetchPost()
    }, [param.postId])

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        const url = await useSubmitPost(images, param.postId, quillRef);

        const res = await fetch(`http://localhost:9001/api/v1/post/editPost/${param.postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ title, content: quillRef.current.value, url})
        })
        const data = await res.json()
        if (res.ok) {
            navigate(-1)
        }
        else {
            setError(data.errors)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='editor'>
            <fieldset>
                <legend>Editer un post</legend>
                {error && <p>{error}</p>}
                <label>Titre</label>
                <input type="text" name="title" id="title" value={title} onChange={e => setTitle(e.target.value)} />
                <TextEditor value={value} setValue={setValue} quillRef={quillRef} images={images} setImages={setImages}/>
                <input type="submit" value="Editer" />
            </fieldset>
        </form>
    )
}

export default UpdatePost