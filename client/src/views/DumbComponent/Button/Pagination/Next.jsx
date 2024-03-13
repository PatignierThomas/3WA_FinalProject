import React from 'react'
import PropType from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

function Next({onClick}, currentPage, numberOfPages) {
    return (
        <button aria-label="page suivante" onClick={onClick} disabled={currentPage === numberOfPages}><FontAwesomeIcon icon={faChevronRight} /></button>
    )
}

Next.propTypes = {
    onClick: PropType.func.isRequired,
    currentPage: PropType.number.isRequired,
    numberOfPages: PropType.number.isRequired
}

export default Next