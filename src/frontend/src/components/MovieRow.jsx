import React, { useRef } from "react";
import "../styles/movieRow.css";

const MovieRow = ({ title, movies = [], isWide = false, type = "Movie", onMovieClick }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    const { current } = rowRef;
    if (current) {
      const scrollAmount = window.innerWidth / 2;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="row">
      <h2 className="row-title">{title}</h2>
      
      <div className="row-wrapper">
        <button className="scroll-btn left" onClick={() => scroll("left")}>‹</button>
        
        <div className="row-posters" ref={rowRef}>
          {movies.map((movie, index) => {
            const isTV = movie.episodes || movie.tv_show_id || type === "TV";
            const uniqueKey = movie.is_continue_watching 
              ? `cw-${movie.tv_show_id || movie.movie_id}-${movie.episode_id || index}` 
              : `media-${movie.id || index}`;

            return (
              <div 
                key={uniqueKey} 
                className={`poster-card ${isWide ? "card-wide" : "card-portrait"}`}
                onClick={() => onMovieClick && onMovieClick(movie)}
                style={{ cursor: "pointer", position: "relative", overflow: "hidden" }}
              >
                <span className={`media-badge ${isTV ? "badge-tv" : "badge-movie"}`}>
                  {isTV ? "TV" : "Movie"}
                </span>

                <img src={movie.thumbnail_url} alt={movie.title} className="poster-image" />
                
                {movie.progress_percent > 0 && (
                  <div style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    width: "100%",
                    height: "5px",
                    background: "rgba(255, 255, 255, 0.25)",
                    zIndex: "10"
                  }}>
                    <div style={{
                      width: `${movie.progress_percent}%`,
                      height: "100%",
                      background: "#3b82f6",
                      boxShadow: "0 0 10px #3b82f6"
                    }} />
                  </div>
                )}

                <div className="poster-info">
                  <h4>{movie.title}</h4>
                </div>
              </div>
            );
          })}
        </div>

        <button className="scroll-btn right" onClick={() => scroll("right")}>›</button>
      </div>
    </div>
  );
};

export default MovieRow;