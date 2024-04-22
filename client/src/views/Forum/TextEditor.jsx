import React, { useState, useRef, useCallback } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import PropTypes from 'prop-types'

function TextEditor({ value, setValue, quillRef, images, setImages}) {
    // This function is called when the user clicks on the image button in the toolbar
    // It opens a file input dialog and allows the user to select an image
    // The selected image is then inserted into the editor
    const imageHandler = useCallback(() => {
        const input = document.createElement('input');

        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];

            // Create a FileReader
            const reader = new FileReader();

            // Define the onload event handler
            reader.onload = () => {
                // The result attribute contains the Data URL
                const url = reader.result;

                // Save current cursor state DON'T REMOVE works with hooks useSubmitPost
                const range = quillRef.current.getEditor().getSelection(true);

                // Insert the selected image
                quillRef.current.getEditor().insertEmbed(range.index, 'image', url);

                // Store the image file in the state
                setImages(oldImages => [...oldImages, { file, range }]);
            };

            reader.readAsDataURL(file);
        };
    }, [quillRef, setImages]);

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
                // [{ 'font': [] }],
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

TextEditor.propTypes = {
    value: PropTypes.string,
    setValue: PropTypes.func,
    quillRef: PropTypes.object,
    images: PropTypes.array,
    setImages: PropTypes.func
}

export default TextEditor