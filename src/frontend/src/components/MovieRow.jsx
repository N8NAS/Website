import React, { useRef } from "react";
import "../styles/MovieRow.css";

// Tambahkan prop 'type' untuk badge (Movie/TV)
const MovieRow = ({ title, movies =[], isWide = false, type = "Movie" }) => {
  const rowRef = useRef(null);

  // Fungsi Scroll Kiri/Kanan
  const scroll = (direction) => {
    const { current } = rowRef;
    if (current) {
      const scrollAmount = window.innerWidth / 2; // Scroll setengah layar
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  //const movies = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      
      <div className="row-wrapper">
        {/* Tombol Kiri */}
        <button className="scroll-btn left" onClick={() => scroll("left")}>‹</button>
        
        <div className="row-posters" ref={rowRef}>
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              className={`poster-card ${isWide ? "card-wide" : "card-portrait"}`}
            >
              {/* Badge Tipe (Movie/TV) */}
              <span className={`media-badge ${type === "TV" ? "badge-tv" : "badge-movie"}`}>
                {type}
              </span>

              {/* Gambar (Gunakan CSS Background) */}
              <img src={movie.thumbnail_url} alt={movie.title} className="poster-image" />
              
              <div className="poster-info">
                <h4>{movie.title}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Kanan */}
        <button className="scroll-btn right" onClick={() => scroll("right")}>›</button>
      </div>
    </div>
  );
};

export default MovieRow;