import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "../views/Home/Home.jsx"
import GameForum from "../views/Forum/Content/GameForum.jsx"
import SectionPost from "../views/Forum/Content/SectionPost.jsx"
import Post from "../views/Forum/Content/Post.jsx"
import Login from "../views/Auth/Login.jsx"
import Register from "../views/Auth/Register.jsx"
import Panel from "../views/admin/Panel.jsx"
import ProtectedRoute from "./ProtectedRoute.jsx"
import ProtectedRouteByAge from "./ProtectedRouteByAge.jsx"
import ProtectedAdminRoute from "./ProtectedAdminRoute.jsx"
import CreatePost from "../views/Forum/CreatePost.jsx"
import UpdatePost from "../views/Forum/UpdatePost.jsx"
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

            <Route path="commun/theme/:game/:gameId" element={<GameForum />} />
            <Route path="commun/categorie/:section/:sectionId" element={<SectionPost />} />
            <Route path="commun/poste/:post/:postId" element={<Post />} />

            <Route path="CGU" element={<TermsOfUse />} />
            <Route path="confidentialite" element={<PrivacyPolicy />} />

            <Route path="jeu/:game/:gameId" element={<ProtectedRouteByAge redirectPath="/" child={<GameForum />}/> } />
            <Route path="categorie/:section/:sectionId" element={<ProtectedRouteByAge redirectPath="/" child={<SectionPost />}/> }/>
            <Route path="poste/:post/:postId" element={<ProtectedRouteByAge redirectPath="/" child={<Post />}/> } />

            <Route path="new/:sectionId/create-post" element={<ProtectedRouteByAge redirectPath="/" child={<CreatePost />}/> } />
            <Route path="edit/:postId/:postTitle" element={<ProtectedRouteByAge redirectPath="/" child={<UpdatePost />}/> } />

            <Route path="profil" element={<ProtectedRoute redirectPath="/connexion" child={<Profil />} />} />

            <Route path="admin" element={<ProtectedAdminRoute redirectPath="/" child={<Panel />} />} />
            <Route path="admin/modifier-utilisateur/:userId" element={<ProtectedAdminRoute redirectPath="/" child={<UpdateUser />} />} />
 
            <Route path="*" element={<Error_404 />} />
      </Routes>
    )
  }

  export default Router