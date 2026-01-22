import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import MovieRow from "../components/MovieRow";

const Home = () => {
  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", paddingBottom: "50px" }}>
      
      <Navbar />
      
      <HeroSection />

      {/* Container row dinaikkan sedikit agar menumpuk background hero */}
      <div style={{ marginTop: "-100px" }}>
        <MovieRow title="New Releases" isWide={true} />
        <MovieRow title="Top 10 This Week" />
        <MovieRow title="Recently Watched" />
        <MovieRow title="Top Movies" />
        <MovieRow title="Top TV Shows" />
      </div>

    </div>
  );
};

export default Home;