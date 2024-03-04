import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Lock from '../DumbComponent/Button/Post/Lock'
import Unlock from '../DumbComponent/Button/Post/Unlock'
import Hide from '../DumbComponent/Button/Post/Hide'
import Show from '../DumbComponent/Button/Post/Show'

function ModerationButtons() {

    const navigate = useNavigate()
    const { postId } = useParams()
    const { posts } = useSelector(state => state.post)

    const handleLock = async () => {
        const res = await fetch(`http://localhost:9001/api/v1/moderator/lockPost/${postId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            navigate(-1);
        }
    }

    const handleUnlock = async () => {
        const res = await fetch(`http://localhost:9001/api/v1/moderator/unlockPost/${postId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            navigate(-1);
        }
    }

    const handleHidePost = async () => {
        const res = await fetch(`http://localhost:9001/api/v1/moderator/hidePost/${postId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            navigate(-1);
        }
    }
    
    const handleShowPost = async () => {
        const res = await fetch(`http://localhost:9001/api/v1/moderator/showPost/${postId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        })
        if (res.ok) {
            navigate(-1);
        }
    }

    return (
        <>
            {posts[0].status === "locked" ? 
                <Unlock onClick={handleUnlock}/> :
                <Lock onClick={handleLock}/>
            }
            {posts[0].status === "hidden" ?
                <Show onClick={handleShowPost} /> :
                <Hide onClick={handleHidePost} />
            }
        </>
    )
}

export default ModerationButtons