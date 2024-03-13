import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import 'react-quill/dist/quill.snow.css'
import slugify from 'slugify'

import { fetchPost } from '../../../store/slices/post.js'
import { fetchReply } from '../../../store/slices/reply.js'
import useSubmitPost from '../../../hooks/useSubmitPost.js'
import TextEditor from '../TextEditor.jsx'
import PostContent from '../../DumbComponent/PostContent.jsx'
import Reply from './Reply.jsx'
import ModerationButtons from '../ModerationButtons.jsx'
import Edit from '../../DumbComponent/Button/Post/Edit.jsx'
import Delete from '../../DumbComponent/Button/Post/Delete.jsx'
import EditMode from '../../DumbComponent/Button/Reply/EditMode.jsx'
import Pagination from '../Pagination.jsx'
import DeleteModal from '../../DumbComponent/DeleteModal.jsx'

function Post() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { postId } = useParams()
    
    const [currentPage, setCurrentPage] = useState(1);
    const replyPerPage = 3;
    
    const { user, isLogged } = useSelector(state => state.user)
    const { posts, loading} = useSelector(state => state.post)
    const { replies, totalReplies } = useSelector(state => state.reply)

    const [images, setImages] = useState([])
    const [value, setValue] = useState('');
    const [editingReply, setEditingReply] = useState(null);

    const [showModal, setShowModal] = useState(false)

    const numberOfPages = Math.ceil(totalReplies / replyPerPage);
    
    const quillRef = useRef();

    useEffect(() => {
        dispatch(fetchPost(postId))
        dispatch(fetchReply({postId, currentPage, replyPerPage}))
    }, [currentPage, postId])
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        const url = await useSubmitPost(images, postId, quillRef)
        if (!editingReply) {
            const res = await fetch('http://localhost:9001/api/v1/reply/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ postId, url, content: quillRef.current.value})
            })
        } 
        if (editingReply) {
            const res = await fetch(`http://localhost:9001/api/v1/reply/edit/${editingReply.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ postId, url, content: quillRef.current.value})
            })
        }
        dispatch(fetchReply({postId, currentPage, replyPerPage}))
        setEditingReply(null)
        setValue('')
        setImages([])
    }
    
    const handleDeletePost = async () => {
        const res = await fetch(`http://localhost:9001/api/v1/admin/deletePost/${postId}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        setShowModal(false)
        if (res.ok) {
            navigate(-1);
        }
    }

    const handleShowModal = () => {
        setShowModal(true)
    }

    // format url to avoid spaces and special characters
    const handleEdit = () => {
        navigate(`/edit/${postId}/${slugify(posts[0].title, {lower: true})}`)
    }
    
    const cancel = () => {
        setEditingReply(null)
        setValue('')
    }

    return (
        <>
            <section className="post">
                {loading && <p>Chargement...</p>}
                { (posts[0] && (user.username === posts[0].username || (user.role === "admin" || user.role === "moderator"))  && !loading) && (
                    <Edit onClick={handleEdit} />
                    )
                }
                { ((user.role === "admin" || user.role === "moderator") && !loading && posts.length > 0) && (
                    <ModerationButtons />
                )}
                { (user.role === "admin" && !loading) && (
                    <Delete onClick={handleShowModal} />
                )}
                {!loading && posts.length > 0 && (
                    <PostContent post={posts[0]}/>
                )}
            </section>
            <section className="replies">
                {(user.role === "admin" || user.role === "moderator" ? replies : replies.filter(reply => reply.status === "ok")).map((reply) => {
                    return (
                        <Reply 
                            key={reply.id} 
                            reply={reply} 
                            setValue={setValue} 
                            setEditingReply={setEditingReply}
                            currentPage={currentPage}
                            replyPerPage={replyPerPage}
                        />
                    );
                })}
            </section>
            {replies.length !== 0 &&  
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} numberOfPages={numberOfPages}/>          
            }
            {(!loading && posts[0] && posts[0].status !== "locked" && isLogged) &&
            <form onSubmit={handleSubmit} className='editor'>
                {editingReply && <EditMode onClick={cancel} />}
                <TextEditor value={value} setValue={setValue} quillRef={quillRef} images={images} setImages={setImages}/>
                <button type="submit">{editingReply ? 'Modifier la réponse' : 'Répondre'}</button>
            </form>}
            {showModal && (
                <DeleteModal handleDelete={handleDeletePost} setShowModal={setShowModal} />
            )}
        </>
    )
}

export default Post