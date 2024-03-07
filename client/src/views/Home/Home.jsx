import React, { useEffect, useState } from 'react'
import slugify from 'slugify'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGames } from '../../store/slices/game.js'

function Home() {
    const dispatch = useDispatch()
    const { games } = useSelector(state => state.game)
    const { user, isLogged } = useSelector(state => state.user)
    const [age, setAge] = useState(0)
    
    // calculer l'age via la date de naissance de user 
    useEffect(() => {
        const today = new Date()
        const birthdate = new Date(user.birthdate)
        let age = today.getFullYear() - birthdate.getFullYear()
        const month = today.getMonth() - birthdate.getMonth()
        if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
            age--
        }
        setAge(age)
    }, [user.birthdate])
    
    useEffect(() => {
        dispatch(fetchGames())
    }, [])

    return (
        <main>
            <section className='intro'>
                <h1>Home</h1>
                <p>Bienvenue sur le Forum de Ctrl Freak Studio ! Ici vous pouvez communiquer avec notre communauté de joueurs et retrouver les dernières informations concernant nos jeux.</p>
            </section>
            <section className='public'>
                <h2>Public Games</h2>
                <ul>
                {games
                    .filter((data) => data.visibility === 'Public')
                    .map((data) => (
                    <li key={data.id}>
                        <Link to={`/commun/theme/${slugify(data.game_name, {lower: true})}/${data.id}`}>{data.game_name}</Link>
                        <p>{data.description}</p>
                    </li>
                    ))}
                </ul>
            </section>
        {isLogged && (
            <section className='private'>
                <h2>Private Games</h2>
                <ul>
                {games
                .filter((data) => data.visibility === 'Private' && age >= data.minimal_age)
                .map((data) => (
                    <li key={data.id}>
                        <Link to={`/jeu/${slugify(data.game_name, {lower: true})}/${data.id}`}>{data.game_name}</Link>
                        <p>{data.description}</p>
                    </li>
                ))}
                </ul>
            </section>
        )}
      </main>
    )
}

export default Home