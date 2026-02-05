import "../styles/login.css";
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Untuk pindah halaman
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Fungsi Login Sederhana (Tanpa Cek Password)
  const handleLogin = (e) => {
    e.preventDefault(); // Mencegah reload halaman
    
    // Anggap user berhasil login
    login({ email: "user@sanflix.com", name: "User" });
    
    // Pindah ke halaman Home
    navigate("/");
  };
  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-logo">SANFLIX</h1>
        <p className="login-desc">Sign in to continue watching</p>

        {/* Tombol Google */}
        <button className="google-login" onClick={handleLogin}>
          <span className="google-icon">G</span>
          Continue with Google
        </button>

        <div className="divider">
          <span></span>
          <p>or</p>
          <span></span>
        </div>

        {/* Form Input (Isi asal saja) */}
        <form onSubmit={handleLogin}>
            <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Enter your email" />
            </div>

            <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" />
            </div>

            <div className="forgot">
            <a href="#">Forgot password?</a>
            </div>

            {/* Tombol Sign In */}
            <button className="signin-btn" type="submit">Sign In</button>
        </form>

        <p className="signup-text">
          Don&apos;t have an account? <span>Sign up</span>
        </p>
      </div>
    </div>
  );
}