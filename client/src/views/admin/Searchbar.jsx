import React from 'react';
import PropType from 'prop-types';

const SearchForm = ({ searchTerm, handleSearchChange }) => {
    return (
        <>
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
            />
        </>
    );
};

SearchForm.propTypes = {
    searchTerm: PropType.string.isRequired,
    handleSearchChange: PropType.func.isRequired,
};

export default SearchForm;