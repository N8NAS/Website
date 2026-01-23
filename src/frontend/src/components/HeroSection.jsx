import React from "react";
// Pastikan nama file di folder styles adalah "HeroSection.css"
import "../styles/HeroSection.css"; 

const HeroSection = () => {
  return (
    <div className="hero">
      {/* Background Image */}
      <div className="hero-bg">
        <img 
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop" 
          alt="Money Heist Background" 
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Konten Utama */}
      <div className="hero-content">
        <h1 className="hero-title">THE HEIST</h1>
        
        <div className="hero-meta">
          <span className="match-score">98% Match</span>
          <span>2023</span>
          <span className="age-rating">18+</span>
          <span>2h 10m</span>
          <span>Crime</span>
        </div>
        
        <p className="hero-desc">
          The perfect crime, or so they thought. A group of master thieves plan 
          the biggest heist in history using a strictly defined plan.
        </p>
        
        <div className="hero-buttons">
          <button className="btn btn-play">
            <span className="icon">▶</span> Play
          </button>
          <button className="btn btn-info">
            <span className="icon">ⓘ</span> More Info
          </button>
        </div>
      </div>
      
      {/* Fade Bawah */}
      <div className="hero-fade-bottom"></div>
    </div>
  );
};

export default HeroSection;