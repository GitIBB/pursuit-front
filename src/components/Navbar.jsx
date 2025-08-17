import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import baseIcon from '../assets/profile-icon.svg';
import '../styles/Navbar.css';
import '../styles/UserMenu.css';
import { isLoggedIn, apiRequest } from '../utils/auth.js'; // login currently unused, fix later

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const menuRef = useRef(null); 

  const toggleUserMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => { 
    const checkLoginStatus = async () => {
      try {
        const response = await apiRequest('/api/me', { method: 'GET' });
        if (response.status === 401) {
          setLoggedIn(false);
          // optionally: navigate('/login');
        } else {
          setLoggedIn(response.ok);
        }
      } catch (err) {
        setLoggedIn(false);
      }
    };
  
    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await apiRequest('/api/logout', {
        method: 'POST',
        credentials: 'include',
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
      {/* nav */}
      <header className="navbar-container">
        <nav className="header-navbar">
          {/* Llogo */}
          <div className="logo-container">
            <Link to="/">
              <img src={logo} alt="logo" className="nav-logo" />
            </Link>
          </div>

          {/* navlinks */}
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/forums">
              Forums
            </Link>
            <Link to="/archive" className="archive-button">
              Archive
            </Link>

          </div>
          <div className="header-divider"></div>
        </nav>
      </header>

      {/* usrmenu */}
      <div className="user-menu-container" ref={menuRef}>
        {/* register */}
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