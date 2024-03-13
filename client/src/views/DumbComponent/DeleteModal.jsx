import React from 'react'
import PropType from 'prop-types'

function DeleteModal({handleDelete, setShowModal}) {
  return (
    <div className="modal">
        <div className='modal-content'>
            <p>Voulez-vous vraiment supprimer cet élément ?</p>
            <div className='modal-btn'>
                <button onClick={handleDelete} className='positive'>Oui, supprimer</button>
                <button onClick={() => setShowModal(false)} className='negative'>Non</button>
            </div>
        </div>
    </div>
  )
}

export default DeleteModal

DeleteModal.propTypes = {
    handleDelete: PropType.func.isRequired,
    setShowModal: PropType.func.isRequired
}

