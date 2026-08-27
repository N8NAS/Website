import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation(); 
  const navigate = useNavigate(); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const inputRef = useRef(null);
  const { user, logout } = useAuth();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };
  useEffect(() => {
    if (location.pathname !== '/search') {
      setSearchInput("");
      setSearchOpen(false);
    } else {
      const params = new URLSearchParams(location.search);
      const query = params.get('q') || "";
      setSearchInput(query);
      setSearchOpen(true);
    }
  }, [location.pathname]);
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if(value.trim().length > 0){
      navigate(`/search?q=${encodeURIComponent(value)}`, { replace: true });
    }
    else{
      navigate('/');
    }
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  const handleCloseSearch = () => {
    setSearchInput("");
    setSearchOpen(false);
     if (location.pathname === '/search') {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        SANFLIX
      </Link>
      <div className="navbar-links">
        <Link to="/" className={isActive('/')}>
          Home
        </Link>
          
        <Link to="/tv-shows" className={isActive('/tv-shows')}>
          TV Shows
        </Link>
          
        <Link to="/movies" className={isActive('/movies')}>
          Movies
        </Link>
          
        <Link to="/about" className={isActive('/about')}>
          About
        </Link>
        {user && (user.role === "admin" || user.role === "co-admin") && (
          <Link to="/admin" className={location.pathname === "/admin" ? "active" : ""}>
            Admin
          </Link>
        )}
      </div>
      <div className="navbar-right">
        <div className={`search-box ${searchOpen ? 'active' : ''}`}>
          <button className="search-btn" onClick={toggleSearch}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search titles..." 
            value={searchInput}
            onChange={handleSearchChange}
            className="search-input"
          />

          {searchOpen && (
            <span className="close-search" onClick={handleCloseSearch}>✕</span>
          )}
        </div>

        <div 
          className="profile-menu" 
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
            alt="Profile" 
            className="profile-img"
          />
          
          {showDropdown && (
            <div className="dropdown-content">
              <a href="/help">Help Center</a>
              <a href="/settings">Settings</a>
              <div className="divider"></div>
              <div 
                className="logout-btn" 
                onClick={() => {
                  logout();
                  setShowDropdown(false);
                }}
                style={{ cursor: 'pointer', padding: '10px 20px', color: '#b3b3b3', fontSize: '13px' }}
              >
                Sign out
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;