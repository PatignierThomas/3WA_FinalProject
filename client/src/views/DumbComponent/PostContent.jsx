import React from 'react'
import PropTypes from 'prop-types'

function PostContent({post}) {
    return (
        <article className='post-info'>
            <h2>{post.title}</h2>
            {post.src === null ? 
            <img src={`http://localhost:9001/public/assets/img/avatar/default.png`} alt={`Avatar de ${post.username}`} /> 
            : <img src={post.src} alt={`Avatar de ${post.username}`} />}
            <p>écrit par {post.username}</p>
            <p>{post.creation_date}</p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} className='content' />
            {post.last_update && <p className='update'>Dernière modification le {post.last_update}</p>}
        </article>
    )
}

PostContent.propTypes = {
    post: PropTypes.object.isRequired
}

export default PostContent