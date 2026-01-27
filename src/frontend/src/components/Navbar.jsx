import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // 1. Import useLocation
import '../styles/Navbar.css'; // Pastikan CSS diimport

const Navbar = () => {
  const location = useLocation(); 

  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  return (
    <nav className="navbar">
      <div className="logo">SANFLIX</div>
      <div className="navbar-links">

        <Link to="/" classame={isActive('/')}>
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
      </div>
      <div className="navbar-right">
        
        {/* Ikon Search (Menggunakan SVG langsung agar tidak perlu install library) */}
        <div className="search-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Profile Dropdown Wrapper */}
        <div className="profile-menu">
          {/* Gambar Profil */}
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
            alt="Profile" 
            className="profile-img"
          />
          
          {/* Dropdown Menu (Muncul saat Hover) */}
          <div className="dropdown-content">
            <a href="/help">Help Center</a>
            <a href="/settings">Settings</a>
            <div className="divider"></div>
            <a href="/logout" className="logout-btn">Sign out of Netflix</a>
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;