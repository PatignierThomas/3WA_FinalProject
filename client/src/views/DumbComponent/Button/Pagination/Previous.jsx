import React from 'react'
import PropType from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

function Previous({onClick}, currentPage, numberOfPages) {
    return (
        <button aria-label="page précédente" onClick={onClick} disabled={currentPage === numberOfPages}><FontAwesomeIcon icon={faChevronLeft} /></button>
    )
}

Previous.propTypes = {
    onClick: PropType.func.isRequired,
    currentPage: PropType.number.isRequired,
    numberOfPages: PropType.number.isRequired
}

export default Previous