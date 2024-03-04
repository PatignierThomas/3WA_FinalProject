import React from 'react'
import PropType from 'prop-types'

function Delete({onClick}) {
    return (
        <button onClick={onClick}>Delete</button>
    )
}

Delete.propTypes = {
    onClick: PropType.func.isRequired
}

export default Delete