export default async function useSubmitPost(images, postId, quillRef) {
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
        else console.log(data.error)

        // Remove placeholder image
        quillRef.current.getEditor().deleteText(image.range.index, 1);

        // Insert uploaded image
        quillRef.current.getEditor().insertEmbed(image.range.index, 'image', result.data.url);

        // Move cursor to right side of image (easier to continue typing)
        quillRef.current.getEditor().setSelection(image.range.index + 1);
    }
    return url
}