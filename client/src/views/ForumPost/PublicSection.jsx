import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// Unsued , to be deleted
function PublicSection() {
    const dispatch = useDispatch()
    const { posts } = useSelector(state => state.post)
    const { role } = useSelector(state => state.user)

    useEffect(() => {
        dispatch(fetchPosts())
    }, [])

  return (
    <div>PublicPost</div>
  )
}

export default PublicSection