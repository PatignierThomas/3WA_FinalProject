import React from 'react'
import PropType from 'prop-types'

function Show({onCLick}) {
    return (
        <button aria-label="Afficher" onClick={onCLick} className='action'>Afficher</button>
    )
}

Show.propTypes = {
    onClick: PropType.func.isRequired
}

export default Show