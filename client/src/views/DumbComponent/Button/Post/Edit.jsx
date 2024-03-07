import React from 'react'
import PropTypes from 'prop-types'

function Edit({onClick}) {
    return (
        <button onClick={onClick} className='action'>Edit</button>
    )
}

Edit.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default Edit