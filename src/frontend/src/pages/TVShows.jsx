import React, { useState, useEffect } from 'react';
import '../styles/TVShows.css';
import Navbar from '../components/Navbar'; 
import VideoModal from '../components/VideoModal';

const TVShows = () => {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState("All");

  const genres = ["All", "Action", "Comedy", "Drama", "Sci-Fi", "Horror", "Documentary", "Animation"];

  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tvshows/?genre=${selectedGenre}`);
        const data = await res.json();
        setShows(data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal mengambil TV Shows:", err);
        setLoading(false);
      }
    };

    fetchShows();
  }, [selectedGenre]);

  if (loading) {
    return <div className="tv-page" style={{ padding: "100px", color: "white", textAlign: "center" }}>Sedang memuat TV Series...</div>;
  }

  return (
    <div className="tv-page">
      <Navbar /> 

      <div className="tv-container">
        <div className="tv-header" style={{ position: 'relative', textAlign: 'center' }}>
          <div>
            <h1>TV Shows</h1>
            <p>Binge-worthy series for every mood</p>
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

        <div className="tv-grid">
          {shows.map((item) => (
            <div 
              key={item.id} 
              className="tv-card"
              onClick={() => setSelectedShow(item)}
              style={{ cursor: "pointer" }}
            >
              <img src={item.thumbnail_url} alt={item.title} />
              
              <div className="tv-badge">TV</div>
              
              <div className="tv-card-overlay">
                <span>{item.title}</span>
              </div>
            </div>
          ))}
        </div>

        {shows.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "50px", color: "#ccc" }}>
            <h3>Belum ada TV series di database.</h3>
          </div>
        )}

        <VideoModal 
          movie={selectedShow} 
          onClose={() => setSelectedShow(null)} 
        />
      </div>
    </div>
  );
};

export default TVShows;