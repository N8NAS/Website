import React from "react";
// Pastikan nama file di folder styles adalah "HeroSection.css"
import "../styles/HeroSection.css"; 

const HeroSection = ({movie }) => {
  if (!movie) return <div className="hero-loading">Loading Banner...</div>;
  return (
    <div className="hero">
      {/* Background Image */}
      <div className="hero-bg">
        <img 
          src={movie.thumbnail_url}
          alt={movie.title}
        />
        <div className="hero-overlay"></div>
      </div>

      {/* Konten Utama */}
      <div className="hero-content">
        <h1 className="hero-title">{movie.title}</h1>
        
        <div className="hero-meta">
          <span className="match-score">98% Match</span>
          <span>{movie.release_year}</span>
          <span className="age-rating">{movie.rating}</span>
          <span>2h 10m</span>
          <span>Crime</span>
        </div>
        
        <p className="hero-desc">
          {movie.description}
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