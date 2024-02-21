import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "../views/Home/Home.jsx"
import GameForum from "../views/SubForum/GameForum.jsx"
import SectionPost from "../views/ForumPost/SectionPost.jsx"
import SinglePost from "../views/ForumPost/SinglePost.jsx"
import Login from "../views/Auth/Login.jsx"
import Register from "../views/Auth/Register.jsx"
import Panel from "../views/admin/Panel.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"
import ProtectedAdminRoute from "./ProtectedAdminRoute.jsx"
import CreateGame from "../views/admin/ForumData/Game/CreateGame.jsx"
import UpdateGame from "../views/admin/ForumData/Game/UpdateGame.jsx"
import DeleteGame from "../views/admin/ForumData/Game/DeleteGame.jsx"
import CreateSection from "../views/admin/ForumData/Section/CreateSection.jsx"
import UpdateSection from "../views/admin/ForumData/Section/UpdateSection.jsx"
import DeleteSection from "../views/admin/ForumData/Section/DeleteSection.jsx"
import CreatePost from "../views/ForumPost/CreatePost.jsx"
import UpdatePost from "../views/ForumPost/UpdatePost.jsx"
import UpdateUser from "../views/admin/UserManagement/UpdateUser.jsx"
import Profil from "../views/User/Profil.jsx"
import TermsOfUse from "../views/TermsOfUse.jsx"
import PrivacyPolicy from "../views/PrivacyPolicy.jsx"
import Error_404 from "../views/Error404.jsx"

function Router() {
    return (
      <Routes>
            <Route path="/" element={<Home />} />
            <Route path="connexion" element={<Login />} />
            <Route path="inscription" element={<Register />} />

            <Route path="open/main/:game/:gameId" element={<GameForum />} />
            <Route path="open/sec/:section/:sectionId" element={<SectionPost />} />
            <Route path="open/post/:post/:postId" element={<SinglePost />} />

            <Route path="term-of-use" element={<TermsOfUse />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />

            <Route path="game/:game/:gameId" element={<ProtectedRoute redirectPath="/connexion" child={<GameForum />}/> } />
            <Route path="section/:section/:sectionId" element={<ProtectedRoute redirectPath="/connexion"child={<SectionPost />}/> }/>
            <Route path="post/:post/:postId" element={<ProtectedRoute redirectPath="/connexion" child={<SinglePost />}/> } />

            <Route path="new/:sectionId/create-post" element={<ProtectedRoute redirectPath="/connexion" child={<CreatePost />}/> } />
            <Route path="edit/:postId/:postTitle" element={<ProtectedRoute redirectPath="/connexion" child={<UpdatePost />}/> } />

            <Route path="profil" element={<ProtectedRoute redirectPath="/connexion" child={<Profil />} />} />

            <Route path="admin" element={<ProtectedAdminRoute redirectPath="/connexion" child={<Panel />} />} />
            <Route path="admin/create-game" element={<ProtectedAdminRoute redirectPath="/connexion" child={<CreateGame />} />} />
            <Route path="admin/update-game" element={<ProtectedAdminRoute redirectPath="/connexion" child={<UpdateGame />} />} />
            <Route path="admin/delete-game" element={<ProtectedAdminRoute redirectPath="/connexion" child={<DeleteGame />} />} />
            <Route path="admin/create-section" element={<ProtectedAdminRoute redirectPath="/connexion" child={<CreateSection />} />} />
            <Route path="admin/update-section" element={<ProtectedAdminRoute redirectPath="/connexion" child={<UpdateSection />} />} />
            <Route path="admin/delete-section" element={<ProtectedAdminRoute redirectPath="/connexion" child={<DeleteSection />} />} />
            <Route path="admin/update-user/:userId" element={<ProtectedAdminRoute redirectPath="/connexion" child={<UpdateUser />} />} />
 
            <Route path="*" element={<Error_404 />} />
      </Routes>
    )
  }

  export default Router