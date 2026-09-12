import "../styles/login.css";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(''); 

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
        navigate("/");   
      } else {
        setMessage(data.detail || "Login gagal"); 
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

        {message && (
          <div style={{ color: '#e50914', textAlign: 'center', marginBottom: '15px', backgroundColor: 'rgba(229, 9, 20, 0.1)', padding: '10px', borderRadius: '4px' }}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="forgot">
            <a href="#">Forgot password?</a>
          </div>

          <button className="signin-btn" type="submit">Sign In</button>
        </form>

        <button className="google-login" onClick={handleLogin}>
          <span className="google-icon">G</span>
          Continue with Google
        </button>

        <p className="signup-text">
          Don&apos;t have an account? <span onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>Sign up</span>
        </p>
      </div>
    </div>
  );
}