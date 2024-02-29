import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import DeleteGame from './ForumData/Game/DeleteGame'
import DeleteSection from './ForumData/Section/DeleteSection'
import UpdateSection from './ForumData/Section/UpdateSection'
import CreateGame from './ForumData/Game/CreateGame'
import UpdateGame from './ForumData/Game/UpdateGame'
import CreateSection from './ForumData/Section/CreateSection'


function Panel() {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [allUsers, setAllusers] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState(null)
    
    const itemsPerPage = 5; 

    useEffect(() => {
        const getStats = async () => {
            const res = await fetch('http://localhost:9001/api/v1/admin/stats', {
                method: 'GET',
                credentials: 'include'
            })
            const result = await res.json()
            if (res.ok) {
                setData(result.data)
            }
        }
        getStats()
        getAllUsers()
    }, [])

    const getAllUsers = async () => {
        const res = await fetch('http://localhost:9001/api/v1/admin/all/users', {
            method: 'GET',
            credentials: 'include'
        })
        if (res.ok) {
            const result = await res.json()
            setAllusers(result.data)
        }
    }

    // Pagination and search

    const filteredUsers = allUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePreviousPageTable = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };
    
    const handleNextPageTable = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const numberOfPages = Math.ceil(filteredUsers.length / itemsPerPage);

    return (
        <>
            <h1>Panel</h1>
            {
                data && data[0] && (
                    <>
                        <div>Nombre d'utilisateurs: {data[0].total_users}</div>
                        <div>Nombre de posts: {data[0].total_posts}</div>
                        <div>Nombre de réponses: {data[0].total_replies}</div>
                    </>
                )
            }
            
            <CreateGame />
            <UpdateGame />
            <DeleteGame />
            
            <br></br>
            <CreateSection />
            <UpdateSection />
            <DeleteSection />

            <section className='user-Management'>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
                <button onClick={handlePreviousPageTable}  disabled={currentPage === 1}>Previous</button>
                <button onClick={handleNextPageTable} disabled={currentPage === numberOfPages}>Next</button>
                <div>
                    Page {currentPage} of {numberOfPages}
                </div>
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
                        {paginatedUsers.map((user) => (
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
            </section>
        </>
    )
}

export default Panel