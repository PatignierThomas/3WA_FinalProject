import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function UpdateUser() {
    const param = useParams();

    const [user, setUser] = useState({});

    useEffect(() => {
        const getUser = async () => {
            const response = await fetch(`http://localhost:9001/api/v1/admin/user/${param.userId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const data = await response.json();
            setUser(data);
        }
        getUser();
    }, [])

    const changeUserInfo = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:9001/api/v1/admin/user/info/${param.userId}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: param.id, username: user.username, email: user.email, role: user.role, account_status: user.account_status})
        });
        const data = await response.json();
    }


    return (
        <form onSubmit={changeUserInfo}>
            <label>Username</label>
            <input type="text" name="username" id="username" value={user.username} onChange={e => setUser({...user, username: e.target.value})}/>
            <label>Email</label>
            <input type="email" name="email" id="email" value={user.email} onChange={e => setUser({...user, email: e.target.value})}/>
            <label>Role</label>
            <select name="role" id="role" value={user.role} onChange={e => setUser({...user, role: e.target.value})}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="developer">Developer</option>
            </select>
            <label>Account Status</label>
            <select name="account_status" id="account_status" value={user.account_status} onChange={e => setUser({...user, account_status: e.target.value})}>
                <option value="ok">Ok</option>
                <option value="banned">Banned</option>
            </select>
            <button type="submit">Update</button>
        </form>
    )
}

export default UpdateUser