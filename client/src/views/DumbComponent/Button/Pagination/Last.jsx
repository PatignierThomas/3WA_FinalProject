import React from 'react'
import PropType from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faForwardStep } from '@fortawesome/free-solid-svg-icons'

function Last({onClick}, currentPage) {
    return (
        <button onClick={onClick} disabled={currentPage === 1}><FontAwesomeIcon icon={faForwardStep} /></button>
    )
}

Last.propTypes = {
    onClick: PropType.func.isRequired,
    currentPage: PropType.number.isRequired,
}

export default Last