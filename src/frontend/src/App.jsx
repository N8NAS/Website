import { useState } from 'react'
import Login from "./pages/Login.jsx"
import './App.css'
import "./styles/global.css";
// Tambahkan Navigate dan useLocation di sini
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from "./pages/Home";
import TVShows from './pages/TVShows.jsx'
import Movies from './pages/Movies.jsx'
import About from './pages/About.jsx'
import Settings from './pages/Settings';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  // Kalau user tidak ada, tendang ke /login
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

// Komponen Layout (Untuk mengatur agar Navbar tidak muncul di halaman Login)
const Layout = ({ children }) => {
  const location = useLocation();
  // Tampilkan Navbar KECUALI di halaman login
  const showNavbar = location.pathname !== "/login";

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Halaman Login (Publik) */}
            <Route path="/login" element={<Login />} />

            {/* Halaman yang Dilindungi (Harus Login dulu) */}
            <Route path="/" element={
              <ProtectedRoute><Home /></ProtectedRoute>
            } />
            <Route path="/tv-shows" element={
              <ProtectedRoute><TVShows /></ProtectedRoute>
            } />
            <Route path="/movies" element={
              <ProtectedRoute><Movies /></ProtectedRoute>
            } />
            <Route path="/about" element={
              <ProtectedRoute><About /></ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute><Settings /></ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;