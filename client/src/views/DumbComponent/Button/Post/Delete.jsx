import React from 'react'
import PropType from 'prop-types'

function Delete({onClick}) {
    return (
        <button aria-label="Supprimer" onClick={onClick} className='action delete'>Supprimer</button>
    )
}

Delete.propTypes = {
    onClick: PropType.func.isRequired
}

export default Delete