import { useState, useEffect } from 'react'
import '../styles/Sidebar.css'


function Sidebar() {
    const [isHidden, setIsHidden] = useState(false);

    const toggleSidebar = () => {
        setIsHidden((prev) => !prev);
    };

    return (
        <>
            <button
                className="hamburger-icon"
                aria-label="Toggle Sidebar"
                onClick={toggleSidebar}
            >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </button>

            <div className="sidebar-button-container">
                {/* Decorative toggle-sidebar-button */}
                <div
                    className={`toggle-sidebar-button ${isHidden ? 'hidden' : ''}`}
                    aria-hidden="true" // Mark as non-interactive
                ></div>
            </div>
            <aside className="sidebar-container">
                <nav className={`sidebar ${isHidden ? 'hidden' : ''}`}>
                    <div className="sidebar-nav">
                        <ul>
                            <li><a href="#about">About</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;