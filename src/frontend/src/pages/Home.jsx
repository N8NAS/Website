import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import MovieRow from "../components/MovieRow";
import VideoModal from '../components/VideoModal'; 
import "../styles/home.css";

export default function Home() {
  const [popular, setPopular] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [continueWatching, setContinueWatching] = useState([]);
  const [myList, setMyList] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const fetchData = async () => {
    try {
      const [popRes, newRes, picksRes, cwRes, listRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/feed/popular`),
        fetch(`${import.meta.env.VITE_API_URL}/api/feed/new-releases`),
        fetch(`${import.meta.env.VITE_API_URL}/api/feed/top-picks`),
        fetch(`${import.meta.env.VITE_API_URL}/api/history/continue-watching`),
        fetch(`${import.meta.env.VITE_API_URL}/api/watchlist/1`)
      ]);
      
      setPopular(await popRes.json());
      setNewReleases(await newRes.json());
      setTopPicks(await picksRes.json());
      setContinueWatching(await cwRes.json());
      setMyList(await listRes.json());
      
      setLoading(false);
    } catch (error) {
      console.error("Gagal mengambil data algoritma Sanflix:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="home" style={{ padding: "100px", color: "white" }}>Memuat Algoritma Sanflix...</div>;
  }

  const featuredMovie = popular[0] || newReleases[0];

  return (
    <div className="home">
      <Navbar />
      
      {featuredMovie && (
        <HeroSection 
          movie={featuredMovie} 
          onPlayClick={(item) => setSelectedMovie(item)} 
        />
      )}
      
      {continueWatching.length > 0 && (
        <MovieRow 
          title="Lanjutkan Menonton ⏱️" 
          movies={continueWatching} 
          onMovieClick={(item) => setSelectedMovie(item)} 
        />
      )}

      {myList.length > 0 && (
        <MovieRow 
          title="Daftar Saya 📌" 
          movies={myList} 
          onMovieClick={(item) => setSelectedMovie(item)} 
        />
      )}

      <MovieRow 
        title="Populer di Sanflix 🔥" 
        movies={popular} 
        onMovieClick={(movie) => setSelectedMovie(movie)} 
      />

      <MovieRow 
        title="Baru Saja Rilis ✨" 
        movies={newReleases} 
        onMovieClick={(movie) => setSelectedMovie(movie)} 
      />

      <MovieRow 
        title="Pilihan Teratas Untukmu 🎲" 
        movies={topPicks} 
        onMovieClick={(movie) => setSelectedMovie(movie)} 
      />

      <VideoModal 
        movie={selectedMovie} 
        onClose={() => {
          setSelectedMovie(null);
          fetchData(); 
        }} 
      />
    </div>
  );
}
