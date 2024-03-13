import React from 'react'
import PropType from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackwardStep } from '@fortawesome/free-solid-svg-icons'

function First({onClick}, currentPage) {
    return (
        <button aria-label="Retour à la première page" onClick={onClick} disabled={currentPage === 1}><FontAwesomeIcon icon={faBackwardStep} /></button>
    )
}

First.propTypes = {
    onClick: PropType.func.isRequired,
    currentPage: PropType.number.isRequired,
}

export default First