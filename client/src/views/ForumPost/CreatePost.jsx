import React, { useRef, useState }from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useParams } from 'react-router-dom';

function CreatePost() {
    const [value, setValue] = useState('')

    const navigate = useNavigate()
    const param = useParams()

    const titleRef = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault()
        const title = titleRef.current.value
        const res = await fetch('http://localhost:9001/api/v1/data/post/createPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ title, content: value, sectionId: param.sectionId})
        })
        if (res.ok) {
            navigate(-1)
            console.log('Post crée')
        }
    }

    return (
    <form onSubmit={handleSubmit}>
        <label>Titre</label>
        <input ref={titleRef} type="text" name="title" id="title"/>
        <ReactQuill theme="snow" value={value} onChange={setValue}/>
        <input type="submit" value="Créer" />
    </form>
    )
}

export default CreatePost