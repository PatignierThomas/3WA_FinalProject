import React, { useEffect } from 'react'
import slugify from 'slugify'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGames } from '../../store/slices/game.js'
import { fetchSection } from '../../store/slices/section.js'

function Home() {
    const dispatch = useDispatch()
    const { games } = useSelector(state => state.game)
    const { isLogged, age } = useSelector(state => state.user)
    
    useEffect(() => {
        dispatch(fetchGames())
    }, [])

    return (
        <main>
            <h1>Home</h1>
            <p>Welcome to the Forum</p>

            <h2>Visiter nos forum: </h2>
            <section>
                <div>
                    <Link to="/news">News</Link>
                </div>
            {isLogged && 
                games.map((data) => (
                    age >= data.minimal_age ? 
                    <div key={data.id}>
                        <Link to={`/game/${slugify(data.game_name, {lower: true})}/${data.id}`}>{data.game_name}</Link>
                    </div>
                    : null
            ))}
            </section>
        </main>
    )
}

export default Home