import React from 'react'

function Lock({onClick}) {
    return (
        <button onClick={onClick} className='action'>Verrouiller</button>
    )
}

export default Lock