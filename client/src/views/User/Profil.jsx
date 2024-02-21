import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

function Profil() {
    const { user } = useSelector(state => state.user)
    const [userInfo, setUserInfo] = useState(user)

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
            body: JSON.stringify(userInfo)
        })
        if (res.ok) {
            // {error: "Mot de passe incorrect"}
            const data = await res.json()
        }
    }

 

    return (
        <form onSubmit={handleSubmit}>
            <legend>Profil</legend>
            <label htmlFor="username">Nom d'utilisateur :</label>
            <input type="text" name="username" id="username" value={userInfo.username} onChange={e => setUserInfo({...userInfo, username: e.target.value}) }/>

            <label htmlFor="email">Adresse email :</label>
            <input type="email" name="email" id="email" value={userInfo.email} onChange={e => setUserInfo({...userInfo, email: e.target.value})}/>

            {/* <label name="avatar">Avatar</label>
            <input type="file" name="avatar" id="avatar" /> */}

            <label name="currenPassword">Mot de passe</label>
            <input type="password" name="currentPassword" id="password" onChange={e => setUserInfo({...userInfo, currentPassword: e.target.value})}/>

            <label name="newPassword">Nouveau mot de passe</label>
            <input type="password" name="newPassword" id="new-password" onChange={e => setUserInfo({...userInfo, newPassword: e.target.value})}/>

            <label name="confirm-password">Confirmer le mot de passe</label>
            <input type="password" name="confirmPassword" id="confirm-password" />

            <button type="submit">Enregistrer</button>
        </form>
    )
}

export default Profil