import React from "react"
import { Routes, Route } from "react-router-dom"
import { useSelector } from "react-redux"
import Home from "../views/Home/Home.jsx"
import GameForum from "../views/SubForum/GameForum.jsx"
import SectionPost from "../views/ForumPost/SectionPost.jsx"
import SinglePost from "../views/ForumPost/SinglePost.jsx"
import Login from "../views/Auth/Login.jsx"
import Register from "../views/Auth/Register.jsx"
import Panel from "../views/admin/Panel.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"
import ProtectedAdminRoute from "./ProtectedAdminRoute.jsx"
import CreateGame from "../views/admin/ForumData/CreateGame.jsx"
import UpdateGame from "../views/admin/ForumData/UpdateGame.jsx"
import CreateSection from "../views/admin/ForumData/CreateSection.jsx"
import UpdateSection from "../views/admin/ForumData/UpdateSection.jsx"
import Error_404 from "../views/Error404.jsx"

function Router() {
    return (
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="connexion" element={<Login />} />
            <Route path="inscription" element={<Register />} />

            <Route path="game/:game/:gameId" element={<ProtectedRoute redirectPath="/connexion" child={<GameForum />}/> } />
            <Route path="section/:section/:sectionId" element={<ProtectedRoute redirectPath="/connexion"child={<SectionPost />}/> }/>
            <Route path="post/:post/:postId" element={<ProtectedRoute redirectPath="/connexion" child={<SinglePost />}/> } />

            <Route path="admin" element={<ProtectedAdminRoute redirectPath="/connexion" child={<Panel />} />} />
            <Route path="admin/create-game" element={<ProtectedAdminRoute redirectPath="/connexion" child={<CreateGame />} />} />
            <Route path="admin/update-game" element={<ProtectedAdminRoute redirectPath="/connexion" child={<UpdateGame />} />} />
            <Route path="admin/create-section" element={<ProtectedAdminRoute redirectPath="/connexion" child={<CreateSection />} />} />
            <Route path="admin/update-section" element={<ProtectedAdminRoute redirectPath="/connexion" child={<UpdateSection />} />} />
 
            <Route path="*" element={<Error_404 />} />
      </Routes>
    )
  }

  export default Router