import React from 'react'
import PropTypes from 'prop-types'

function ReplyContent({reply}) {
    return (
        <>
            <div className='user-info'>
                {reply.src === null ? 
                    <img src={`http://localhost:9001/public/assets/img/avatar/default.png`} alt={`Avatar par défaut`} /> 
                    : <img src={reply.src} alt={`Avatar de ${reply.username}`} />}
                <p>{reply.username}</p>
            </div>
            <p>{reply.reply_date}</p>
            <div dangerouslySetInnerHTML={{ __html: reply.content }} className='content ql-editor'/>
            <div className='edit-info'>
                {reply.last_update !== "Invalid Date" ?  <p>Modifié le {reply.last_update}</p> : null}
            </div>
        </>
    )
}

ReplyContent.propTypes = {
    reply: PropTypes.object.isRequired
}

export default ReplyContent