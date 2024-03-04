import React, { useEffect, useState } from 'react'
import slugify from 'slugify'
import { Link, useParams, useMatch } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchSection } from '../../../store/slices/section.js'
import { mostRecentPost } from '../../../store/slices/post.js'

function GameForum() {
    const matchPublic = useMatch('/commun/theme/:game/:gameId');
    const isPublicRoute = matchPublic != null;
    const dispatch = useDispatch();
    const { section } = useSelector(state => state.section);
    const { posts } = useSelector(state => state.post);
    const { gameId } = useParams();

    const [ recentPosts, setRecentPosts ] = useState([])
    
    useEffect(() => {
        dispatch(fetchSection(gameId))
    }, []);

    useEffect(() => {
        dispatch(mostRecentPost(gameId))
    }
    , [gameId])

    useEffect(() => {
        setRecentPosts(posts)
    }, [posts])

    return (
        <main>
            <section className="cat-list">
        {section.map((section) => 
            {const recentPost = recentPosts.find(post => post.subID === section.id);
         return (
            <article key={section.id}>
                {(!isPublicRoute && section.game_section_id === Number(gameId)) ? 
                    <>
                    <div className='cat-box'>
                        <Link to={`/categorie/${slugify(section.subject, {lower: true})}/${section.id}`}>{section.subject}</Link>
                        <p>Posts: {section.post_count}</p>
                    </div>
                    <div className='post-box'>
                        {recentPost && <Link to={`/poste/${slugify(recentPost.title, {lower: true})}/${recentPost.postID}`}>{recentPost.title}</Link>}
                        {recentPost &&
                            <div className='recent-info'>
                                {recentPost.src ? <img src={recentPost.src} alt={`Avatar de ${recentPost.username}`} />
                                    : <img src={"http://localhost:9001/public/assets/img/avatar/default.png"} alt={"Avatar par défault"}></img>
                                }
                                <p>{recentPost.username}</p>
                                <p>{recentPost.creation_date}</p>
                            </div>
                        }
                    </div>
                </>
                : section.game_section_id === Number(gameId) && 
                <>
                    <div className='cat-box'>
                        <Link to={`/commun/categorie/${slugify(section.subject, {lower: true})}/${section.id}`}>{section.subject}</Link>
                        <p>Posts: {section.post_count}</p>
                    </div>
                    <div className='post-box'>
                        {recentPost && <Link to={`/commun/poste/${slugify(recentPost.title, {lower: true})}/${recentPost.postID}`}>{recentPost.title}</Link>}
                        {recentPost && 
                        <div className='recent-info'>
                            {recentPost.src ? <img src={recentPost.src} alt={`Avatar de ${recentPost.username}`} /> 
                            : <img src={"http://localhost:9001/public/assets/img/avatar/default.png"} alt={"Avatar par défault"}></img>
                            } 
                            <p>{recentPost.username}</p> 
                            <p>{recentPost.creation_date}</p>
                        </div> 
                        }               
                    </div>
                </>
                }
            </article>
            )}
        )}
            </section>
        </main>
    )
}

export default GameForum