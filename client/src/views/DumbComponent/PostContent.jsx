import React from 'react'
import PropTypes from 'prop-types'

function PostContent({post}) {
    return (
        <article className='post-info'>
            <h2>{post.title}</h2>
            <p>écrit par {post.username}</p>
            {post.src === null ? 
            <img src={`http://localhost:9001/public/assets/img/avatar/default.png`} alt={`Avatar de ${post.username}`} /> 
            : <img src={post.src} alt={`Avatar de ${post.username}`} />}
            <p>{post.creation_date}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} className='content' />
            {post.last_update && <p className='update'>Modifié le {post.last_update}</p>}
        </article>
    )
}

PostContent.propTypes = {
    post: PropTypes.object.isRequired
}

export default PostContent