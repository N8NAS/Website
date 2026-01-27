import React from 'react';
import '../styles/TVShows.css';
// Pastikan path Navbar Anda benar. Jika belum ada, hapus baris ini.
import Navbar from '../components/Navbar'; 

const TVShows = () => {
  // Data Dummy untuk contoh (Ganti src gambar dengan URL gambar asli Anda nanti)
  const shows = [
    { id: 1, title: "Castle", image: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=300&q=80" },
    { id: 2, title: "Sunset", image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=300&q=80" },
    { id: 3, title: "Cinema", image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80" },
    { id: 4, title: "Matrix", image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&q=80" },
    { id: 5, title: "Cooking", image: "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=300&q=80" },
    { id: 6, title: "Action", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80" },
  ];

  return (
    <div className="tv-page">
      {/* Navbar ditaruh di sini */}
      <Navbar /> 

      <div className="tv-container">
        {/* Header Section */}
        <div className="tv-header">
          <h1>TV Shows</h1>
          <p>Binge-worthy series for every mood</p>
        </div>

        {/* Grid Section */}
        <div className="tv-grid">
          {shows.map((item) => (
            <div key={item.id} className="tv-card">
              <img src={item.image} alt={item.title} />
              
              {/* Badge Merah "TV" */}
              <div className="tv-badge">TV</div>
              
              {/* Overlay (opsional, untuk efek hover) */}
              <div className="tv-card-overlay">
                <span>{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TVShows;