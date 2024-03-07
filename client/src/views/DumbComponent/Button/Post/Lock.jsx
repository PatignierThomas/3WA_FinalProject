import React from 'react'

function Lock({onClick}) {
    return (
        <button onClick={onClick} className='action'>Lock</button>
    )
}

export default Lock