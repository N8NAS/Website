import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import MovieRow from "../components/MovieRow";
import "../styles/home.css"; // Pastikan path ini sesuai dengan file Anda

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/movies/");
        const data = await response.json();
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data film:", error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return <div className="home" style={{ padding: "100px", color: "white" }}>Sedang memuat Sanflix...</div>;
  }

  // Kita ambil film pertama dari database untuk dijadikan Banner Utama di Hero Section
  const featuredMovie = movies[0];

  return (
    <div className="home">
      <Navbar />
      
      {/* Jika ada film, tampilkan di Hero Section */}
      {featuredMovie && <HeroSection movie={featuredMovie} />}
      
      {/* Tampilkan deretan film di Movie Row */}
      <MovieRow title="Populer di Sanflix" movies={movies} />
      
      {/* Anda bisa memanggil MovieRow berkali-kali untuk baris yang berbeda */}
      <MovieRow title="Tontonan Seru Lainnya" movies={movies} />
    </div>
  );
}