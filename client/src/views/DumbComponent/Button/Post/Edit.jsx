import React from 'react'
import PropTypes from 'prop-types'

function Edit({onClick}) {
    return (
        <button aria-label="éditer" onClick={onClick} className='action'>Editer</button>
    )
}

Edit.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default Edit