import { useState } from 'react'
import Login from "./pages/Login.jsx"
import './App.css'
import "./styles/global.css";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from "./pages/Home.jsx";
import TVShows from './pages/TVShows.jsx'
import Movies from './pages/Movies.jsx'
import About from './pages/About.jsx'
import Settings from './pages/Settings.jsx';
import Register from './pages/Register.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Search from './pages/Search.jsx';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.role !== "admin" && user.role !== "co-admin") {
    alert("Akses Ditolak: Halaman ini khusus Admin!");
    return <Navigate to="/" />;
  }
  return children;
};

const Layout = ({ children }) => {
  const location = useLocation();
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
            
            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <ProtectedRoute><Home /></ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute><Search /></ProtectedRoute>
            } />
            <Route path="/tv-shows" element={
              <ProtectedRoute><TVShows /></ProtectedRoute>
            } />
            <Route path="/movies" element={
              <ProtectedRoute><Movies /></ProtectedRoute>
            } />
            <Route path="/admin" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
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