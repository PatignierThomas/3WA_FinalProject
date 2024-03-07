import React from 'react'
import PropType from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBackwardStep, faChevronLeft, faChevronRight, faForwardStep } from '@fortawesome/free-solid-svg-icons'
import First from '../DumbComponent/Button/Pagination/First'
import Last from '../DumbComponent/Button/Pagination/Last'
import Next from '../DumbComponent/Button/Pagination/Next'
import Previous from '../DumbComponent/Button/Pagination/Previous'

function Pagination({currentPage, setCurrentPage, numberOfPages}) {

    const handleFirstPage = () => {
        setCurrentPage(1)
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    
    const handleNextPage = () => {
        if (currentPage < numberOfPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleLastPage = () => {
        setCurrentPage(numberOfPages)
    }
    
    return (
        <div className='pagination'>
            <First onClick={handleFirstPage} currentPage={currentPage} />
            <Previous onClick={handlePreviousPage} currentPage={currentPage} numberOfPages={numberOfPages}/>
            <p>Page {currentPage} of {numberOfPages}</p>
            <Next onClick={handleNextPage} currentPage={currentPage} numberOfPages={numberOfPages}/>
            <Last onClick={handleLastPage} currentPage={currentPage} />
        </div>
    )
}

Pagination.propTypes = {
    currentPage: PropType.number.isRequired,
    setCurrentPage: PropType.func.isRequired,
    numberOfPages: PropType.number.isRequired
}

export default Pagination