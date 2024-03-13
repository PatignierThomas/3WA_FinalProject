import React from 'react'
import PropTypes from 'prop-types'

function Show({onClick}) {
    return (
        <button aria-label="Afficher la réponse" onClick={onClick} className='action'>Afficher</button>
    )
}

Show.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default Show