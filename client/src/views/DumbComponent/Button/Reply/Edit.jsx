import React from 'react'
import PropType from 'prop-types'

function Edit({onClick}) {
    return (
        <button onClick={onClick}>Editer la réponse</button>
    )
}

Edit.propTypes = {
    onClick: PropType.func.isRequired
}

export default Edit