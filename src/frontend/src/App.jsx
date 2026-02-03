import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from "./pages/Login.jsx"
import './App.css'
import "./styles/global.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from "./pages/Home";
import TVShows from './pages/TVShows.jsx'
import Movies from './pages/Movies.jsx'
import About from './pages/About.jsx'
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;