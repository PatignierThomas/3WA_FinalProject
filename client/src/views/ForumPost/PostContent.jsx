import React from 'react'
import PropTypes from 'prop-types'

function PostContent({post}) {
    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.username}</p>
            {post.src === null ? 
            <img src={`http://localhost:9001/public/assets/img/avatar/default.png`} alt={`Avatar de ${post.username}`} /> 
            : <img src={post.src} alt={`Avatar de ${post.username}`} />}
            <p>{post.creation_date}</p>
            {post.last_update && <p>Modifié le {post.last_update}</p>}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
    )
}

export default PostContent

PostContent.propTypes = {
    post: PropTypes.object,
}