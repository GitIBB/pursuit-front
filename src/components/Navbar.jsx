import { useState } from 'react'
import { Link } from 'react-router-dom'; // Import Link
import logo from '../assets/logo.svg'
import '../styles/Navbar.css'

function NavBar() {
    return (
        <header className="navbar-container">
            <nav className="header-navbar">
                <div className="logo-container">
                    <Link to="/"> {/* Wrap the logo in a Link */}
                        <img src={logo} alt="logo" className="nav-logo" />
                    </Link>
                </div>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/archive" className="Archive-button">Archive</Link>
                </div>
                <div className="header-divider"></div>
            </nav>
        </header>
    );
}

export default NavBar;