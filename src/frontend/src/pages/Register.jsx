import "../styles/login.css"; 
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(''); 

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Registrasi berhasil! Silakan login.");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage("❌ " + (data.detail || "Terjadi kesalahan"));
      }
    } catch (error) {
      setMessage("❌ Gagal terhubung ke server Backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-logo">SANFLIX</h1>
        <p className="login-desc">Create an account to start watching</p>

        {message && <div style={{ color: message.includes('✅') ? 'green' : 'red', marginBottom: '15px', textAlign: 'center' }}>{message}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="signin-btn" type="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        <p className="signup-text">
          Already have an account? <Link to="/login"><span>Sign in</span></Link>
        </p>
      </div>
    </div>
  );
}