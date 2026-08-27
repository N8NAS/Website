import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        
        <div className="about-header">
          <h1>About SANFLIX</h1>
          <p className="tagline">A personal local web application for streaming movies and TV shows.</p>
        </div>

        <div className="about-description" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto 50px auto", color: "#ccc", lineHeight: "1.8", fontSize: "1.1rem" }}>
          <p>
            SANFLIX is a personal development project built to organize and stream local video files 
            through a modern web interface. It allows users to browse a library of movies and TV shows, 
            play videos directly in the browser, and manage content via a built-in admin dashboard.
          </p>
        </div>

        <h3 className="section-title">Technical Features</h3>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="icon">💻</div>
            <h3>Local Streaming</h3>
            <p>Streams video files stored locally on the host machine.</p>
          </div>

          <div className="feature-card">
            <div className="icon">⚙️</div>
            <h3>Admin Dashboard</h3>
            <p>Allows authorized users to add or delete movies and TV shows from the database.</p>
          </div>

          <div className="feature-card">
            <div className="icon">🔒</div>
            <h3>Authentication</h3>
            <p>Basic session-based login system with role management (Admin, Co-Admin, User).</p>
          </div>

          <div className="feature-card">
            <div className="icon">🚀</div>
            <h3>Modern Stack</h3>
            <p>Frontend built with React and Vite. Backend powered by FastAPI and MySQL.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;