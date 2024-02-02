import React from "react"
import { Routes, Route } from "react-router-dom"
import Home from "../views/Home/Home.jsx"
import Error_404 from "../views/Error404.jsx"

function Router() {
    return (
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Error_404 />} />
      </Routes>
    )
  }
  
  export default Router