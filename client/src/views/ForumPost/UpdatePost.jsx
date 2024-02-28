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
    const [images, setImages] = useState([])
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

        const url = await submitPost(param.postId)

        const res = await fetch(`http://localhost:9001/api/v1/post/editPost/${param.postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ title, content: quillRef.current.value, url})
        })
        if (res.ok) {
            navigate(-1)
            console.log('Post édité')
        }
    }

    const submitPost = async (postId) => {
        // Upload all images
        const url = []
        for (const image of images) {
            const formData = new FormData();
            formData.append('postId', postId);
            formData.append('image', image.file);

            const res = await fetch('http://localhost:9001/api/v1/file/upload/image', {
                method: 'POST',
                body: formData, // update with your image data
                credentials: 'include'
            });
            const result = await res.json();
            if(res.ok) {
                url.push(result.data.url)
            }

            // Remove placeholder image
            quillRef.current.getEditor().deleteText(image.range.index, 1);

            // Insert uploaded image
            quillRef.current.getEditor().insertEmbed(image.range.index, 'image', result.data.url);

            // Move cursor to right side of image (easier to continue typing)
            quillRef.current.getEditor().setSelection(image.range.index + 1);
        }
        return url
    };

    return (
    <form onSubmit={handleSubmit}>
        <label>Titre</label>
        <input type="text" name="title" id="title" value={title} onChange={e => setTitle(e.target.value)} />
        <TextEditor value={value} setValue={setValue} quillRef={quillRef} images={images} setImages={setImages}/>
        <input type="submit" value="Editer" />
    </form>
    )
}

export default UpdatePost