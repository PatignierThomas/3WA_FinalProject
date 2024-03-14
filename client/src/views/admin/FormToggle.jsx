import React from 'react'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import CreateGame from './ForumData/Game/CreateGame'
import UpdateGame from './ForumData/Game/UpdateGame'
import DeleteGame from './ForumData/Game/DeleteGame'
import CreateSection from './ForumData/Section/CreateSection'
import UpdateSection from './ForumData/Section/UpdateSection'
import DeleteSection from './ForumData/Section/DeleteSection'

function FormToggle() {

    const [showCreateGame, setShowCreateGame] = useState(false);
    const [showUpdateGame, setShowUpdateGame] = useState(false);
    const [showDeleteGame, setShowDeleteGame] = useState(false);
    const [showCreateSection, setShowCreateSection] = useState(false);
    const [showUpdateSection, setShowUpdateSection] = useState(false);
    const [showDeleteSection, setShowDeleteSection] = useState(false);

    return (
        <section className='crud'>
            <div onClick={() => setShowCreateGame(!showCreateGame)} className={`crud-menu ${showCreateGame ? 'active' : ''}`}>
                {showCreateGame ? 
                <>
                <h2>Masquer la création d'un nouveau jeu</h2>
                <FontAwesomeIcon icon={faChevronDown} />
                </> : 
                <>
                <h2>Afficher la création d'un nouveau jeu</h2>
                <FontAwesomeIcon icon={faChevronRight} />
                </>}
            </div>
            <div className={`content ${showCreateGame ? 'active' : ''}`}>
                <CreateGame />
            </div>

            <div onClick={() => setShowUpdateGame(!showUpdateGame)} className={`crud-menu ${showUpdateGame ? 'active' : ''}`}>
                {showUpdateGame ? 
                <>
                <h2>Masquer l'édition d'un jeu</h2>
                <FontAwesomeIcon icon={faChevronDown} />
                </> : 
                <>
                <h2>Afficher l'édition d'un jeu</h2>
                <FontAwesomeIcon icon={faChevronRight} />
                </>}
            </div>
            <div className={`content ${showUpdateGame ? 'active' : ''}`}>
                <UpdateGame />
            </div>

            <div onClick={() => setShowDeleteGame(!showDeleteGame)} className={`crud-menu ${showDeleteGame ? 'active' : ''}`}>
                {showDeleteGame ? 
                <>
                <h2>Masquer la suppression d'un jeu</h2>
                <FontAwesomeIcon icon={faChevronDown} />
                </> : 
                <>
                <h2>Afficher la suppression d'un jeu</h2>
                <FontAwesomeIcon icon={faChevronRight} />
                </>}
            </div>
            <div className={`content ${showDeleteGame ? 'active' : ''}`}>
                <DeleteGame />
            </div>

            <div onClick={() => setShowCreateSection(!showCreateSection)} className={`crud-menu ${showCreateSection ? 'active' : ''}`}>
                {showCreateSection ? 
                <>
                <h2>Masquer la création d'une nouvelle catégorie</h2>
                <FontAwesomeIcon icon={faChevronDown} />
                </> : 
                <>
                <h2>Afficher la création d'une nouvelle catégorie</h2>
                <FontAwesomeIcon icon={faChevronRight} />
                </>}
            </div>
            <div className={`content ${showCreateSection ? 'active' : ''}`}>
                <CreateSection />
            </div>

            <div onClick={() => setShowUpdateSection(!showUpdateSection)} className={`crud-menu ${showUpdateSection ? 'active' : ''}`}>
                {showUpdateSection ? 
                <>
                <h2>Masquer l'édition d'une catégorie</h2>
                <FontAwesomeIcon icon={faChevronDown} />
                </> : 
                <>
                <h2>Afficher l'édition d'une catégorie</h2>
                <FontAwesomeIcon icon={faChevronRight} />
                </>}
            </div>
            <div className={`content ${showUpdateSection ? 'active' : ''}`}>
                <UpdateSection />
            </div>

            <div onClick={() => setShowDeleteSection(!showDeleteSection)} className={`crud-menu ${showDeleteSection ? 'active' : ''}`}>
                {showDeleteSection ? 
                <>
                <h2>Masquer la suppression d'une catégorie</h2>
                <FontAwesomeIcon icon={faChevronDown} />
                </> : 
                <>
                <h2>Afficher la suppression d'une catégorie</h2>
                <FontAwesomeIcon icon={faChevronRight} />
                </>}
            </div>
            <div className={`content ${showDeleteSection ? 'active' : ''}`}>
                <DeleteSection />
            </div>
        </section>
    )
}

export default FormToggle