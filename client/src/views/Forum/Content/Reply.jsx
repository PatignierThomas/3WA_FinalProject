import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { fetchReply } from '../../../store/slices/reply.js'
import Edit from '../../DumbComponent/Button/Reply/Edit.jsx'
import Delete from '../../DumbComponent/Button/Reply/Delete.jsx'
import Show from '../../DumbComponent/Button/Post/Show.jsx'
import Hide from '../../DumbComponent/Button/Reply/Hide.jsx'
import ReplyContent from '../../DumbComponent/ReplyContent.jsx'
import DeleteModal from '../../DumbComponent/DeleteModal.jsx'


// props: key={reply.id} reply={reply} postId={postId} setValue={setValue} setEditingReply={setEditingReply}
function Reply({reply, setValue, setEditingReply, currentPage, replyPerPage}) {

    const dispatch = useDispatch()
    const { postId } = useParams()
    const { user } = useSelector(state => state.user)
    const { loading } = useSelector(state => state.post)

    const [showModal, setShowModal] = useState(false)

    const handleDeleteReply = async (replyId) => {
        const res = await fetch(`http://localhost:9001/api/v1/admin/deleteReply/${replyId}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            dispatch(fetchReply({postId, currentPage, replyPerPage}))
        }
    }
    
    const handleHideReply = async (replyId) => {
        const res = await fetch(`http://localhost:9001/api/v1/moderator/hideReply/${replyId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            dispatch(fetchReply({postId, currentPage, replyPerPage}))
        }
    }
    
    const handleShowReply = async (replyId) => {
        const res = await fetch(`http://localhost:9001/api/v1/moderator/showReply/${replyId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            dispatch(fetchReply({postId, currentPage, replyPerPage}))
        }
    }

    const handleShowModal = () => {
        setShowModal(true)
    }

    const handleReplyEdit = (reply) => {
        setValue(reply.content)
        setEditingReply(reply)
    }
    
    return (
        <>
            <article className='reply'>
                <div className='moderation'>
                    {((reply && user.username === reply.username) || user.role === "admin" || user.role === "moderator") && 
                        <Edit onClick={() => handleReplyEdit(reply)} />
                    }  
                    {((user.role === "admin" || user.role === "moderator") && !loading) &&
                    (reply.status === "hidden" ? 
                    <Show onClick={() => handleShowReply(reply.id)} /> 
                    : <Hide onClick={() => handleHideReply(reply.id)} />
                    )}
                    {((user.role === "admin" || user.role === "moderator") && !loading) &&
                        <Delete onClick={handleShowModal} />
                    }
                </div>
                <div className='reply-info'>
                    <ReplyContent reply={reply} />
                </div>
            </article>
            {showModal && (
                <DeleteModal handleDelete={() => handleDeleteReply(reply.id)} setShowModal={setShowModal} />
            )}
        </>
    )
}

export default Reply

Reply.propTypes = {
    reply: PropTypes.object,
    postId: PropTypes.number,
    setValue: PropTypes.func,
    setEditingReply: PropTypes.func,
    currentPage: PropTypes.number,
    replyPerPage: PropTypes.number
}