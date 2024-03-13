import React, { useEffect, useState } from 'react'
import slugify from 'slugify'
import { Link, useParams, useMatch } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { fetchPostsBySection } from '../../../store/slices/post.js'
import Pagination from '../Pagination.jsx'

function SectionPost() {
    const matchPublic = useMatch('/commun/categorie/:section/:sectionId');
    const isPublicRoute = matchPublic != null;

    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;

    const dispatch = useDispatch()
    const { posts, total } = useSelector(state => state.post)
    const { user, isLogged } = useSelector(state => state.user)
    const { sectionId } = useParams()
    const param = useParams()

    useEffect(() => {
        dispatch(fetchPostsBySection({sectionId, currentPage, postsPerPage}))
    }, [param.sectionId, currentPage])
    
    const numberOfPages = Math.ceil(total / postsPerPage);

    return (
        <>
            <section>
                <h1 className='intro'>{param.section.charAt(0).toUpperCase() + param.section.slice(1)}</h1>
            </section>
            <section className='post-list'>
            {(!isPublicRoute && isLogged) && <Link to={`/new/${param.sectionId}/create-post` } className='action'>Create a post</Link>}
            {(isPublicRoute && user.role === "admin") && <Link to={`/new/${param.sectionId}/create-post` } className='action'>Create a post</Link>}
            {posts.map((post) => (
                ((post.status === "ok" || post.status === "locked") || (post.status === "hidden" && (user.role === "admin" || user.role === "moderator"))) &&
                <div key={post.id} className='post'>
                    {(!isPublicRoute && post.sub_forum_id === Number(sectionId)) ?
                    <>
                        <div className='post-yolo'>
                            <Link to={`/poste/${slugify(post.title, {lower: true})}/${post.id}`}>{post.title}</Link>
                            <p>{post.username}</p>
                            {post.src 
                                ? <img src={post.src} alt={`Avatar de ${post.username}`}/> 
                                : <img src={"http://localhost:9001/public/assets/img/avatar/default.png"} alt={"Avatar par défault"} />
                            }
                        </div>

                        <div className='post-info'>
                            <p>{post.views} vues</p>
                            <p>{post.replies} réponses</p>
                            <p>il y a {post.most_recent_activity}</p>
                        </div>
                    </>
                    : 
                    post.sub_forum_id === Number(sectionId) &&
                    <>
                        <div className='post-yolo'>
                            <Link to={`/commun/poste/${slugify(post.title, {lower: true})}/${post.id}`}>{post.title}</Link>
                            <p>{post.username}</p>
                            {post.src 
                                ? <img src={recentPost.src} alt={`Avatar de ${recentPost.username}`}/> 
                                : <img src={"http://localhost:9001/public/assets/img/avatar/default.png"} alt={"Avatar par défault"} />
                            }
                        </div>
                        <div className='post-info'>
                            <p>{post.views} vues</p>
                            <p>{post.replies} réponses</p>
                            <p>il y a {post.most_recent_activity}</p>
                        </div>
                    </>
                }
                </div>
            ))}
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} numberOfPages={numberOfPages}/>
            </section>
        </>
    )
}

export default SectionPost