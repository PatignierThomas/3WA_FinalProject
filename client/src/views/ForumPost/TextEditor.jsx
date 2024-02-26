import React, { useState, useRef, useCallback } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import PropTypes from 'prop-types'

function TextEditor({ value, setValue, quillRef, images, setImages}) {

    const imageHandler = useCallback(() => {
        const input = document.createElement('input');

        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            // const formData = new FormData();
        
            // formData.append('image', file);
        
            // // Create a local URL for the selected image file
            // const url = URL.createObjectURL(file);

            // // Save current cursor state
            // const range = quillRef.current.getEditor().getSelection(true);

            // quillRef.current.getEditor().insertEmbed(range.index, 'image', url);

            // // Insert temporary loading placeholder image
            // // quillRef.current.getEditor().insertEmbed(range.index, 'image', `${window.location.origin}/images/loaders/placeholder.gif`);

            // setImages(oldImages => [...oldImages, { file, range }]);

                        // Create a FileReader
            const reader = new FileReader();

            // Define the onload event handler
            reader.onload = () => {
                // The result attribute contains the Data URL
                const url = reader.result;

                // Save current cursor state
                const range = quillRef.current.getEditor().getSelection(true);

                // Insert the selected image
                quillRef.current.getEditor().insertEmbed(range.index, 'image', url);

                // Store the image file in the state
                setImages(oldImages => [...oldImages, { file, range }]);
            };

            reader.readAsDataURL(file);
            
            // // Start upload
            // const res = await fetch('http://localhost:9001/api/v1/data/upload/image', {
            //     method: 'POST',
            //     body: formData, // update with your image data
            //     credentials: 'include'
            // });
            // const data = await res.json();
            // if(res.ok) console.log(data)
            // else console.log(data.error)

            //         // Remove placeholder image
            // quillRef.current.getEditor().deleteText(range.index, 1);
            
            // // Insert uploaded image
            // quillRef.current.getEditor().insertEmbed(range.index, 'image', data.url);
            
            // // Move cursor to right side of image (easier to continue typing)
            // quillRef.current.getEditor().setSelection(range.index + 1);
        };
    }, [quillRef, setImages]);

    // const submitPost = async () => {
    //     // Upload all images
    //     for (const image of images) {
    //         const formData = new FormData();
    //         formData.append('image', image.file);

    //         const res = await fetch('http://localhost:9001/api/v1/data/upload/image', {
    //             method: 'POST',
    //             body: formData,
    //             credentials: 'include'
    //         });
    //         const data = await res.json();
    //         if(res.ok) console.log(data)
    //         else console.log(data.error)

    //         // Remove placeholder image
    //         quillRef.current.getEditor().deleteText(image.range.index, 1);

    //         // Insert uploaded image
    //         quillRef.current.getEditor().insertEmbed(image.range.index, 'image', data.url);

    //         // Move cursor to right side of image (easier to continue typing)
    //         quillRef.current.getEditor().setSelection(image.range.index + 1);
    //     }

    //     // Submit the post...
    // };


    const modules = {
    toolbar: {
        container: [
                ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                [{ 'direction': 'rtl' }],                         // text direction
                [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                [{ 'font': [] }],
                [{ 'align': [] }],
                ['clean'],                                         // remove formatting button
                ['link', 'image', 'video']                         // link and image, video
            ],
            handlers: {
                'image': imageHandler
            }
        }
    };

    return (
        <ReactQuill ref={quillRef} theme="snow" modules={modules} value={value} onChange={setValue}/>
    )
}

// Vite prop's reception
TextEditor.propTypes = {
    value: PropTypes.string,
    setValue: PropTypes.func,
    quillRef: PropTypes.object,
    images: PropTypes.array,
    setImages: PropTypes.func
}

export default TextEditor