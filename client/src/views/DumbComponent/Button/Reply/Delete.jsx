import React from 'react'
import PropType from 'prop-types'

function Delete({onClick}) {
    return (
        <button aria-label="Supprimer la réponse" onClick={onClick} className='action delete'>Supprimer la réponse</button>
    )
}

Delete.propTypes = {
    onClick: PropType.func.isRequired
}

export default Delete