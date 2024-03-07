import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Pagination from '../Forum/Pagination'
import FormToggle from './FormToggle'
import UserBoard from './UserBoard'
import SearchForm from './Searchbar'


function Panel() {
    
    const [searchTerm, setSearchTerm] = useState('');
    const [paginatedUser, setPaginatedUser] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [numberOfPages, setNumberOfPages] = useState(0);
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
    }, [])

    useEffect(() => {
    const getAllUsers = async (searchTerm = '', page = 1, limit = 5) => {
        const res = await fetch(`http://localhost:9001/api/v1/admin/all/users?${searchTerm ? `search=${searchTerm}&` : ''}page=${page}&limit=${limit}`, {
            method: 'GET',
            credentials: 'include'
        })
        if (res.ok) {
            const result = await res.json()
            setPaginatedUser(result.data.user)
            setNumberOfPages(Math.ceil(result.data.count / itemsPerPage))
        }}
        getAllUsers(searchTerm, currentPage, itemsPerPage)
    }, [searchTerm, currentPage])

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <>
            <section className='stats'>
                <h1>Panel</h1>
                {
                    data && data[0] && (
                        <>
                            <p>Nombre d'utilisateurs: {data[0].total_users}</p>
                            <p>Nombre de réponses: {data[0].total_replies}</p>
                            <p>Nombre de posts: {data[0].total_posts}</p>
                        </>
                    )
                }
            </section>
            
            <FormToggle />

            <section className='user-Management'>
                <h2>Gestion des utilisateurs</h2>
                <SearchForm searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
                <UserBoard paginatedUser={paginatedUser} />
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} numberOfPages={numberOfPages}/>
            </section>
        </>
    )
}

export default Panel