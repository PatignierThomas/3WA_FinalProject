import React from 'react'
import PropType from 'prop-types'

function Edit({onClick}) {
    return (
        <button aria-label="éditer la réponse" onClick={onClick} className='action'>Editer la réponse</button>
    )
}

Edit.propTypes = {
    onClick: PropType.func.isRequired
}

export default Edit