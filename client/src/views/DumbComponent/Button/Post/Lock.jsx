import React from 'react'

function Lock({onClick}) {
    return (
        <button aria-label="Verrouiller" onClick={onClick} className='action'>Verrouiller</button>
    )
}

export default Lock