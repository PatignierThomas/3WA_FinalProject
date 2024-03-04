import React from 'react'
import PropTypes from 'prop-types'

function ReplyContent({reply}) {
    return (
        <>
            <p>{reply.username}</p>
            {reply.src === null ? 
                <img src={`http://localhost:9001/public/assets/img/avatar/default.png`} alt={`Avatar de ${reply.username}`} /> 
                : <img src={reply.src} alt={`Avatar de ${reply.username}`} />}
            <p>{reply.reply_date}</p>
            {reply.last_update && <p>Modifié le {reply.last_update}</p>}
            <div dangerouslySetInnerHTML={{ __html: reply.content }} />
        </>
    )
}

ReplyContent.propTypes = {
    reply: PropTypes.object.isRequired
}

export default ReplyContent