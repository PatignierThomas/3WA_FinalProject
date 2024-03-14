import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function Profil() {
    const { user } = useSelector(state => state.user)
    const [userInfo, setUserInfo] = useState(user)
    const [error, setError] = useState(null);

    useEffect(() => {
        setUserInfo(user)
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const res = await fetch(`http://localhost:9001/api/v1/data/user/info/${user.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(userInfo)
        })
        if (res.ok) {
            const data = await res.json()
        }
        else {
            const data = await res.json()
            setError(data.error)
        }
    }

    const handleAvatar = async (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('type', 'avatar')
        formData.append('image', e.target["image"].files[0])
        const res = await fetch('http://localhost:9001/api/v1/file/upload/avatar', {
            method: 'POST',
            credentials: 'include',
            body: formData
        })
        if (res.ok) {
            const result = await res.json()
        }
    }

    const handleDeleteAvatar = async (e) => {
        e.preventDefault()
        const res = await fetch(`http://localhost:9001/api/v1/file/delete/avatar/${user.id}`, {
            method: 'DELETE',
            credentials: 'include'
        })
        if (res.ok) {
            const data = await res.json()
        }
    }

    return ( 
    <>
        <form onSubmit={handleSubmit}>
            <fieldset>
                {error && <p>{error}</p>}
                <legend>Profil</legend>
                <label htmlFor="email">Adresse email :</label>
                <input type="email" name="email" id="email" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})}/>

                <label name="currenPassword">Mot de passe</label>
                <input type="password" name="currentPassword" id="password" onChange={e => setUserInfo({...userInfo, currentPassword: e.target.value})}/>

                <label name="newPassword">Nouveau mot de passe</label>
                <input type="password" name="newPassword" id="new-password" onChange={e => setUserInfo({...userInfo, newPassword: e.target.value})}/>

                <label name="confirm-password">Confirmer le mot de passe</label>
                <input type="password" name="confirmPassword" id="confirm-password" />

                <button type="submit">Enregistrer</button>
            </fieldset>
        </form>
        
        <form onSubmit={handleAvatar} encType='multipart/form-data'>
            <fieldset>
                <legend>Ajouter un avatar</legend>
                <input type="file" name="image" id="image" />
                <button type="submit">Ajouter</button>
            </fieldset>
        </form>

        <form onSubmit={handleDeleteAvatar}>
            <fieldset>
                <legend>Supprimer l'avatar</legend>
                <button type="submit">Supprimer</button>
            </fieldset>
        </form>
    </>
    )
}

export default Profil