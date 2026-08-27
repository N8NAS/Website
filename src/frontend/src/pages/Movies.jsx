import React, { useState, useEffect } from 'react';
import '../styles/Movies.css';
import VideoModal from '../components/VideoModal';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("All");

  const genres = ["All", "Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Documentary", "Animation"];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/movies/?genre=${selectedGenre}`);
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
  }, [selectedGenre]);

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
        <div className="movies-header" style={{ position: 'relative', textAlign: 'center' }}>
          <div>
            <h1>Movies</h1>
            <p>Movies move us like nothing else can, whether they’re scary, funny, dramatic, romantic or anywhere in-between.</p>
          </div>
          
          <div className="genre-filter" style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}>
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
              style={{ padding: '8px 16px', backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem' }}
            >
              {genres.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

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
                onClick={() => setSelectedMovie(movie)}
              >
                <div className="movie-badge">{movie.rating || "HD"}</div>
                <img src={movie.thumbnail_url} alt={movie.title} />
                <div className="movie-card-overlay">
                  <strong>{movie.title}</strong>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "#ccc" }}>{movie.release_year}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <VideoModal 
          movie={selectedMovie} 
          onClose={() => setSelectedMovie(null)} 
        />
      </div>
    </div>
  );
};

export default Movies;