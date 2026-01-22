import React from "react";
import "../styles/heroSection.css";

const HeroSection = () => {
  return (
    <div className="hero">
      {/* Container Gambar Background */}
      <div className="hero-bg">
        {/* Gambar Money Heist (Saya pakai placeholder berkualitas tinggi yang mirip) */}
        <img 
          src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2525&auto=format&fit=crop" 
          alt="Money Heist Background" 
        />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        {/* Judul Besar */}
        <h1 className="hero-title">The Heist</h1>
        
        {/* Detail Info (Tahun, Rating, Durasi) */}
        <div className="hero-meta">
          <span className="rating-match">98% Match</span>
          <span className="year">2023</span>
          <span className="age-box">18+</span>
          <span className="duration">2h 10m</span>
          <span className="genre">Crime, Action</span>
        </div>
        
        {/* Deskripsi */}
        <p className="hero-desc">
          The perfect crime, or so they thought. A group of master thieves plan 
          the biggest heist in history using a strictly defined plan.
        </p>
        
        {/* Tombol */}
        <div className="hero-buttons">
          <button className="btn btn-play">
            <span className="icon">▶</span> Play Now
          </button>
          <button className="btn btn-info">
            <span className="icon">ⓘ</span> More Info
          </button>
        </div>
      </div>
      
      {/* Efek Fade di bawah agar menyatu dengan list film */}
      <div className="hero-fade-bottom"></div>
    </div>
  );
};

export default HeroSection;