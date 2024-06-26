import React, { useRef, useState }from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import TextEditor from './TextEditor.jsx'
import useSubmitPost from '../../hooks/useSubmitPost.js';

function CreatePost() {
    const [value, setValue] = useState('')
    const [msg, setMsg] = useState('')
    const quillRef = useRef();
    const titleRef = useRef()

    const navigate = useNavigate()
    const param = useParams()

    const [images, setImages] = useState([])


    const handleSubmit = async (e) => {
        e.preventDefault()

        const title = titleRef.current.value
        const res = await fetch('http://localhost:9001/api/v1/post/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ title, content: quillRef.current.value, sectionId: param.sectionId})
        })
        if (!res.ok) {
            return setMsg("Erreur lors de la création du post")
        }

        const result = await res.json();
        const postId = result.data.id;
        
        const url = await useSubmitPost(images, postId, quillRef);
        
        const nextRes = await fetch(`http://localhost:9001/api/v1/post/editPost/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ title, content: quillRef.current.value, url})
        })
        if (nextRes.ok) {
            navigate(-1)
        } else {
            setMsg("Erreur lors de la création du post")
        }
    }

    return (
        <form onSubmit={handleSubmit} className='editor'>
            <fieldset>
                {msg && <p>{msg}</p>}
                <legend>Créer un post</legend>
                <label>Titre</label>
                <input ref={titleRef} type="text" name="title" id="title"/>
                <TextEditor value={value} setValue={setValue} quillRef={quillRef} images={images} setImages={setImages}/>
                <input type="submit" value="Créer" />
            </fieldset>
        </form>
    )
}

export default CreatePost