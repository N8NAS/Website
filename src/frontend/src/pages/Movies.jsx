import React, { useState, useEffect } from 'react';
import '../styles/Movies.css';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null); // Menyimpan film yang sedang diklik untuk diputar

  // 1. Mengambil data film asli dari Database MySQL (melalui backend FastAPI)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/movies/");
        if (!response.ok) {
          throw new Error("Gagal mengambil data");
        }   
        const data = await response.json();
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // 2. Tampilan saat data masih loading
  if (loading) {
    return (
      <div className="movies-page" style={{ textAlign: "center", padding: "100px" }}>
        <h2>Sedang memuat katalog film Sanflix dari MySQL...</h2>
      </div>
    );
  }

  return (
    <div className="movies-page">
      <div className="movies-container">
        
        {/* HEADER */}
        <div className="movies-header">
          <h1>Movies</h1>
          <p>Movies move us like nothing else can, whether they’re scary, funny, dramatic, romantic or anywhere in-between.</p>
        </div>

        {/* GRID MOVIE */}
        {movies.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h3>Belum ada film di database.</h3>
            <p>Jalankan endpoint POST http://127.0.0.1:8000/api/movies/seed untuk mengisi data dummy!</p>
          </div>
        ) : (
          <div className="movies-grid">
            {movies.map((movie) => (
              <div 
                key={movie.id} 
                className="movie-card"
                onClick={() => setSelectedMovie(movie)} // Ketika diklik, set film terpilih ke state
              >
                {/* Badge Rating / Kualitas */}
                <div className="movie-badge">{movie.rating || "HD"}</div>

                {/* Gambar Thumbnail */}
                <img src={movie.thumbnail_url} alt={movie.title} />

                {/* Overlay Judul & Tahun */}
                <div className="movie-card-overlay">
                  <strong>{movie.title}</strong>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#ccc" }}>{movie.release_year}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL VIDEO PLAYER (Muncul jika selectedMovie tidak null) */}
        {selectedMovie && (
          <div className="video-modal-overlay" onClick={() => setSelectedMovie(null)}>
            <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
              
              {/* Tombol Close (X) */}
              <button className="video-modal-close" onClick={() => setSelectedMovie(null)}>
                ✕
              </button>

              {/* HTML5 Video Player */}
              <div className="video-player-wrapper">
                <video 
                  controls 
                  autoPlay 
                  src={selectedMovie.video_url} 
                  className="video-player"
                >
                  Browser Anda tidak mendukung pemutar video HTML5.
                </video>
              </div>

              {/* Info Film di Bawah Video */}
              <div className="video-modal-info">
                <h2>{selectedMovie.title} ({selectedMovie.release_year})</h2>
                <span className="modal-rating-badge">{selectedMovie.rating || "HD"}</span>
                <p>{selectedMovie.description}</p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Movies;