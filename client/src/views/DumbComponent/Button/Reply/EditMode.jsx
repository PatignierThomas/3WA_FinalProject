import React from 'react'
import PropType from 'prop-types'

function EditMode({onClick}) {
  return (
    <>
        <p>Mode édition</p>
        <button onClick={onClick} aria-label="Annuler l'édition de la réponse" className='action'>Annuler</button>
    </>)
}

EditMode.propTypes = {
    onClick: PropType.func.isRequired
}

export default EditMode