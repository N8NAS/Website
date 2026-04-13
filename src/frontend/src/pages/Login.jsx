import "../styles/login.css";
import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Untuk pindah halaman
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Fungsi Login Sederhana (Tanpa Cek Password)
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setMessage(''); // Bersihkan pesan error sebelumnya

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user); // Simpan data user ke Context/localStorage
        navigate("/");    // Pindah ke Home
      } else {
        setMessage(data.detail || "Login gagal"); // Tampilkan pesan dari FastAPI
      }
    } catch (error) {
      setMessage("Gagal terhubung ke server Backend.");
    }
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

        {message && (
          <div style={{ color: '#e50914', textAlign: 'center', marginBottom: '15px', backgroundColor: 'rgba(229, 9, 20, 0.1)', padding: '10px', borderRadius: '4px' }}>
            {message}
          </div>
        )}
        {/* Form Input (Isi asal saja) */}
        <form onSubmit={handleLogin}>
            <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>

            <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            </div>

            <div className="forgot">
            <a href="#">Forgot password?</a>
            </div>

            {/* Tombol Sign In */}
            <button className="signin-btn" type="submit">Sign In</button>
        </form>

        <p className="signup-text">
          Don&apos;t have an account? <span onClick={() => navigate("/register")} style={{cursor: "pointer"}}>Sign up</span>
        </p>
      </div>
    </div>
  );
}