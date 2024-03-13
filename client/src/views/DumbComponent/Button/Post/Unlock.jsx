import React from 'react'

function Unlock({onClick}) {
    return (
        <button aria-label="Déverrouiller" onClick={onClick} className='action'>Déverrouiller</button>
    )
}

export default Unlock