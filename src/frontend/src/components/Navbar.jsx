import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "nav-dark" : ""}`}>
      {/* 1. BAGIAN KIRI: HANYA LOGO */}
      <div className="nav-left">
        <h1 className="logo">SANFLIX</h1>
      </div>

      {/* 2. BAGIAN TENGAH: MENU (Baru ditambahkan container ini) */}
      <div className="nav-center">
        <ul className="nav-links">
          <li className="active">Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>About</li>
        </ul>
      </div>

      {/* 3. BAGIAN KANAN: SEARCH & PROFIL */}
      <div className="nav-right">
        <i className="search-icon">🔍</i>
        <div 
          className="profile-wrapper" 
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="profile-icon">👤</div>
          
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item">Settings</div>
              <div className="dropdown-item">Help Center</div>
              <div className="dropdown-item logout">Logout</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;