import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer>
        <p>Ctrl Freak Studio</p>
        <section className='Link'>
            <Link to="/CGU">Term of use</Link>
            <Link to="/confidentialite">Privacy policy</Link>
        </section>
    </footer>
  )
}

export default Footer