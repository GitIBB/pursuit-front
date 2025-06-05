import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'; // Import Link
import '../styles/Sidebar.css'



function Sidebar() {
    const [isHidden, setIsHidden] = useState(true);

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
                            <a>
                                <Link to="/article-create" onClick={() => setIsOpen(false)}>
                                Create Article
                                </Link>
                            </a>
                        </ul>
                    </div>
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;