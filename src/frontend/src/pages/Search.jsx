import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../styles/Search.css';
import VideoModal from '../components/VideoModal';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || "";
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Gagal melakukan pencarian:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="search-page">
      <div className="search-header">
        <h2>
          Hasil pencarian untuk: <span>"{query}"</span>
        </h2>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", marginTop: "50px", color: "#aaa" }}>
          Sedang mencari...
        </div>
      ) : results.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px", color: "#aaa" }}>
          <h3>Oops, tidak ditemukan film atau TV series dengan judul tersebut.</h3>
        </div>
      ) : (
        <div className="search-grid">
          {results.map((item) => (
            <div 
              key={`${item.type}-${item.id}`} 
              className="search-card"
              onClick={() => setSelectedItem(item)}
            >
              <div className="search-card-badge">{item.type === 'tvshow' ? 'TV Series' : 'Movie'}</div>
              <img src={item.thumbnail_url} alt={item.title} />
              <div className="search-card-overlay">
                <strong>{item.title}</strong>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#ccc" }}>{item.release_year}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <VideoModal 
        movie={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    </div>
  );
};

export default Search;
