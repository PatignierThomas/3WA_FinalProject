import React from 'react'
import PropTypes from 'prop-types'

function Hide({onClick}) {
    return (
        <button onClick={onClick}>Hide</button>
    )
}

Hide.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default Hide