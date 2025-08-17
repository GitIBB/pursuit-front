import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
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
                {/* decorative toggle-sidebar-button thing */}
                <div
                    className={`toggle-sidebar-button ${isHidden ? 'hidden' : ''}`}
                    aria-hidden="true" // mark as non-interactive
                ></div>
            </div>
            <aside className="sidebar-container">
                <nav className={`sidebar ${isHidden ? 'hidden' : ''}`}>
                    <div className="sidebar-nav">
                        <ul>
                            <Link to="/article-create" onClick={() => setIsOpen(false)}>
                            Create Article
                            </Link>
                        </ul>
                    </div>
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;