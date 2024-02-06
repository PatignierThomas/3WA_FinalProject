import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "../views/Home/Home.jsx"
import GameForum from "../views/SubForum/GameForum.jsx"
import SectionPost from "../views/ForumPost/SectionPost.jsx"
import SinglePost from "../views/ForumPost/SinglePost.jsx"
import Login from "../views/Auth/Login.jsx"
import Register from "../views/Auth/Register.jsx"
import Error_404 from "../views/Error404.jsx"

function Router() {
    return (
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/connexion" element={<Login />} />
            <Route path="/inscription" element={<Register />} />
            <Route path="game/:game/:gameId" element={<GameForum />} />
            <Route path="section/:section/:sectionId" element={<SectionPost />} />
            <Route path="post/:post/:postId" element={<SinglePost />} />
            <Route path="*" element={<Error_404 />} />
      </Routes>
    )
  }

  export default Router