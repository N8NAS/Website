import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom'; // 1. Import useLocation
import '../styles/Navbar.css'; // Pastikan CSS diimport

const Navbar = () => {
  const location = useLocation(); 
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const inputRef = useRef(null); // Untuk auto-focus saat diklik
  const { logout } = useAuth();
  const isActive = (path) => {
    return location.pathname === path ? 'active-link' : '';
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      // Jika baru dibuka, langsung fokus ke input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Fungsi clear/close search
  const handleCloseSearch = () => {
    setSearchInput("");
    setSearchOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
      SANFLIX
      </Link>
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
        <div className={`search-box ${searchOpen ? 'active' : ''}`}>
          {/* Ikon Kaca Pembesar (Tombol Pemicu) */}
          <button className="search-btn" onClick={toggleSearch}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {/* Input Field (Muncul saat active) */}
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Search titles..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />

          {/* Tombol X (Hanya muncul jika search terbuka) */}
          {searchOpen && (
             <span className="close-search" onClick={handleCloseSearch}>✕</span>
          )}
        </div>

        {/* Profile Dropdown Wrapper */}
        <div 
          className="profile-menu" 
          onClick={() => setShowDropdown(!showDropdown)} /* 3. LOGIKA KLIK */
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
            alt="Profile" 
            className="profile-img"
          />
          
          {/* 4. TAMPILKAN HANYA JIKA STATE TRUE */}
          {showDropdown && (
            <div className="dropdown-content">
              <a href="/help">Help Center</a>
              <a href="/settings">Settings</a>
              <div className="divider"></div>
              <div 
                className="logout-btn" 
                onClick={() => {
                  logout(); // Hapus sesi
                  setShowDropdown(false); // Tutup menu
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