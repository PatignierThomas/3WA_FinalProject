import React from 'react'
import PropType from 'prop-types'
import { Link } from 'react-router-dom'

function UserBoard({paginatedUser}) {
    return (
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr> 
            </thead>
            <tbody>
                {paginatedUser.map((user) => (
                    <tr key={user.id}>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role_id}</td>
                        <td>{user.account_status}</td>
                        <td>
                            <Link to={`/admin/modifier-utilisateur/${user.id}`}>Modifier</Link>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

UserBoard.propTypes = {
  paginatedUser: PropType.array.isRequired
}

export default UserBoard