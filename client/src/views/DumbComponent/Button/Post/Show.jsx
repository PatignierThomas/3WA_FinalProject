import React from 'react'
import PropType from 'prop-types'

function Show({onCLick}) {
    return (
        <button onClick={onCLick}>Show</button>
    )
}

Show.propTypes = {
    onClick: PropType.func.isRequired
}

export default Show