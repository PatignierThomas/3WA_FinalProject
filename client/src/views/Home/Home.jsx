import React, { useEffect } from 'react'
import slugify from 'slugify'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGames } from '../../store/slices/game.js'

function Home() {
    const dispatch = useDispatch()
    const { games } = useSelector(state => state.game)
    const { user, isLogged } = useSelector(state => state.user)
    
    useEffect(() => {
        dispatch(fetchGames())
    }, [])

    return (
        <main>
            <section className='intro'>
                <h1>Home</h1>
                <p>Welcome to the Forum</p>
            </section>
            <section className='public'>
            <h2>Public Games</h2>
            {games
                .filter((data) => data.visibility === 'Public')
                .map((data) => (
                <article key={data.id}>
                    <Link to={`/open/main/${slugify(data.game_name, {lower: true})}/${data.id}`}>{data.game_name}</Link>
                    <p>{data.description}</p>
                </article>
                ))}
            </section>
        {isLogged && (
            <section className='private'>
                <h2>Private Games</h2>
                {games
                .filter((data) => data.visibility === 'Private' && user.age >= data.minimal_age)
                .map((data) => (
                    <article key={data.id}>
                    <Link to={`/game/${slugify(data.game_name, {lower: true})}/${data.id}`}>{data.game_name}</Link>
                    </article>
                ))}
            </section>
        )}
      </main>
    )
}

export default Home