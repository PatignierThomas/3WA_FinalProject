import React from 'react'
import PropType from 'prop-types'

function Hide({onClick}) {
    return (
        <button onClick={onClick} className='action'>Masquer</button>
    )
}

export default Hide