import React from 'react'
import PropType from 'prop-types'

function Hide({onClick}) {
    return (
        <button aria-label="Masquer la réponse" onClick={onClick} className='action'>Masquer</button>
    )
}

export default Hide