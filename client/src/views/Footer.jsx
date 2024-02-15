import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer>
        <p>Ctrl Freak Studio</p>
        <Link to="/term-of-use">Term of use</Link>
        <Link to="/privacy-policy">Privacy policy</Link>
    </footer>
  )
}

export default Footer