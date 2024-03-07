import React from 'react'
import PropTypes from 'prop-types'

function Show({onClick}) {
    return (
        <button onClick={onClick} className='action'>Show</button>
    )
}

Show.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default Show