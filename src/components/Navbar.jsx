import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import logo from '../assets/logo.svg';
import baseIcon from '../assets/profile-icon.svg'; // Import user icon
import '../styles/Navbar.css';
import '../styles/UserMenu.css'; // Import UserMenu-specific styles
import { isLoggedIn } from '../utils/auth.js'; // Import the isLoggedIn function

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for user-menu
  const [loggedIn, setLoggedIn] = useState(false); // State for user login status
  const menuRef = useRef(null); // Ref for the user menu container

  const toggleUserMenu = () => {
    setIsOpen((prev) => !prev); // Toggle user menu
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false); // Close the menu if the click is outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); // Add event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup event listener
    };
  }, []);

  useEffect(() => { // replace with a call to API /me at a later stage
    const checkLoginStatus = async () => {
      try {
        const response = await apiRequest(`${import.meta.env.VITE_API_BASE_URL}/api/me`, {
          method: 'GET',
        });
  
        setLoggedIn(response.ok); // Update the login status based on the response
      } catch (err) {
        console.error('Error checking login status:', err.message);
        setLoggedIn(false);
      }
    };
  
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await apiRequest(`${import.meta.env.VITE_API_BASE_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies in the request
      });
  
      if (response.ok) {
        setLoggedIn(false);
        setIsOpen(false);
        window.location.href = '/login';
      } else {
        console.error('Logout failed');
      }
    } catch (err) {
      console.error('Error during logout:', err.message);
    }
  };


  return (
    <>
      {/* Navbar */}
      <header className="navbar-container">
        <nav className="header-navbar">
          {/* Logo Section */}
          <div className="logo-container">
            <Link to="/">
              <img src={logo} alt="logo" className="nav-logo" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/archive" className="archive-button">
              Archive
            </Link>
          </div>
          <div className="header-divider"></div>
        </nav>
      </header>

      {/* User Menu */}
      <div className="user-menu-container" ref={menuRef}>
        {/* Register Button */}
        {!loggedIn && (
          <Link to="/register" className="register-button">
            Register
          </Link>
        )}

        <div className="user-menu">
          <img
            src={baseIcon}
            alt="User Icon"
            className="user-icon"
            onClick={toggleUserMenu}
          />
          {isOpen && (
            <ul className="dropdown-menu">
              {!loggedIn ? (
                <li>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    Log in
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/profile" onClick={() => setIsOpen(false)}>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" onClick={() => setIsOpen(false)}>
                      Settings
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </>
              )}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;