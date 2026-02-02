import React from 'react';
import '../styles/Movies.css'; // Pastikan import CSS yang baru dibuat

const Movies = () => {
  // Data Dummy
  const movies = [
    { id: 1, title: "Inception", image: "https://image.tmdb.org/t/p/w500/9gk7admal4zl248Z5d106zHWAtz.jpg" },
    { id: 2, title: "Interstellar", image: "https://image.tmdb.org/t/p/w500/gEU2QniL6E8ahEoXxf9wtdsM4h0.jpg" },
    { id: 3, title: "The Dark Knight", image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg" },
    { id: 4, title: "Avengers: Endgame", image: "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg" },
    { id: 5, title: "Spider-Man", image: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg" },
  ];

  return (
    <div className="movies-page">
      <div className="movies-container">
        
        {/* HEADER */}
        <div className="movies-header">
          <h1>Movies</h1>
          <p>Movies move us like nothing else can, whether they’re scary, funny, dramatic, romantic or anywhere in-between.</p>
        </div>

        {/* GRID */}
        <div className="movies-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              
              {/* Badge (Opsional, tulisan HD atau 4K) */}
              <div className="movie-badge">HD</div>

              {/* Gambar */}
              <img src={movie.image} alt={movie.title} />

              {/* Overlay Judul */}
              <div className="movie-card-overlay">
                <strong>{movie.title}</strong>
              </div>
              
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Movies;