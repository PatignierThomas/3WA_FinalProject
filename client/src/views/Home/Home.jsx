import React, { useEffect } from 'react'
import slugify from 'slugify'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGames } from '../../store/slices/game.js'
import { fetchSection } from '../../store/slices/section.js'

function Home() {
    const dispatch = useDispatch()
    const { games } = useSelector(state => state.game)
    
    useEffect(() => {
        dispatch(fetchGames())
    }, [])

    return (
        <main>
            <h1>Home</h1>
            <p>Welcome to the Forum</p>

            <h2>Visiter notre forum: </h2>
            {games.map((data) => (
                <div key={data.id}>
                    {/* <h3>{data.game_name}</h3> */}
                    <Link to={`/game/${slugify(data.game_name, {lower: true})}/${data.id}`}>{data.game_name}</Link>
                    {/* {section && section.map((section) => (
                        section.game_section_id === data.id ? <p>hello</p> : null
                    ))} */}
                </div>
            ))}
        </main>
    )
}

export default Home