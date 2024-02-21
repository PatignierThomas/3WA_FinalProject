import React, { useEffect, useState } from 'react'
import slugify from 'slugify'
import { Link, useParams, useMatch } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { fetchPostsBySection } from '../../store/slices/post.js'

function SectionPost() {
    const matchPublic = useMatch('/open/sec/:section/:sectionId');
    const isPublicRoute = matchPublic != null;

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 25;

    const dispatch = useDispatch()
    const { posts } = useSelector(state => state.post)
    const { user, isLogged } = useSelector(state => state.user)
    const { sectionId } = useParams()
    const param = useParams()

    useEffect(() => {
        dispatch(fetchPostsBySection(param.sectionId))
    }, [param.sectionId])

    const numberOfPages = Math.ceil(posts.length / itemsPerPage);
    const paginatedPosts = posts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < numberOfPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // format the title to be used as a slug
    // function createSlug(title) {
    //     return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    // }

    return (
    <main>
        <article className="intro">
            <h1>Section</h1>
            <p>Section {param.section}</p>
        </article>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage === numberOfPages}>Next</button>
        <div>
            Page {currentPage} of {numberOfPages}
        </div>
        {(!isPublicRoute && isLogged) && <Link to={`/new/${param.sectionId}/create-post` }>Create a post</Link>}
        {(isPublicRoute && role === "admin") && <Link to={`/new/${param.sectionId}/create-post` }>Create a post</Link>}
        {paginatedPosts.map((post) => (
            ((post.status === "ok" || post.status === "locked") || (post.status === "hidden" && (user.role === "admin" || user.role === "moderator"))) &&
            <div key={post.id}>
                {(!isPublicRoute && post.sub_forum_id === Number(sectionId)) ?
                <>
                    <Link to={`/post/${slugify(post.title, {lower: true})}/${post.id}`}>{post.title}</Link> 
                    <p>Views: {post.views}</p>
                    <p>Replies: {post.replies}</p>
                </>
                : 
                post.sub_forum_id === Number(sectionId) &&
                <>
                    <Link to={`/open/post/${slugify(post.title, {lower: true})}/${post.id}`}>{post.title}</Link>
                    <p>Views: {post.views}</p>
                    <p>Replies: {post.replies}</p>
                </>
            }
            </div>
        ))}
    </main>
    )
}

export default SectionPost