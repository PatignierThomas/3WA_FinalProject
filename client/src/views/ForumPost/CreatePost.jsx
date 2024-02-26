import React, { useRef, useState }from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import TextEditor from './TextEditor.jsx'

function CreatePost() {
    const [value, setValue] = useState('')
    const quillRef = useRef();

    const navigate = useNavigate()
    const param = useParams()

    const [images, setImages] = useState([])

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
            body: JSON.stringify({ title, content: quillRef.current.value, sectionId: param.sectionId})
        })
        if (res.ok) {
            console.log('Post crée')
        }

        // Get the post ID
        const post = await res.json();
        const postId = post.postId;
        
        const url = await submitPost(postId);
        
        const nextRes = await fetch(`http://localhost:9001/api/v1/data/post/editPost/${postId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ title, content: quillRef.current.value, url})
        })
        if (nextRes.ok) {
            navigate(-1)
            console.log('Post created')
        }
        
    }
    
    const submitPost = async (postId) => {
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

    return (
    <form onSubmit={handleSubmit}>
        <label>Titre</label>
        <input ref={titleRef} type="text" name="title" id="title"/>
        <TextEditor value={value} setValue={setValue} quillRef={quillRef} images={images} setImages={setImages}/>
        <input type="submit" value="Créer" />
    </form>
    )
}

export default CreatePost