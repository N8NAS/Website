import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        
        {/* HEADER SECTION (Mirip Movies/TV Shows) */}
        <div className="about-header">
          <h1>About SANFLIX</h1>
          <p className="tagline">Stories move us. They make us feel more emotion, see new perspectives, and bring us closer to each other.</p>
        </div>

        {/* CONTENT SECTION: Stats / Angka */}
        <div className="about-stats">
          <div className="stat-item">
            <h2>10M+</h2>
            <span>Subscribers</span>
          </div>
          <div className="stat-item">
            <h2>190+</h2>
            <span>Countries</span>
          </div>
          <div className="stat-item">
            <h2>5000+</h2>
            <span>Titles</span>
          </div>
        </div>

        {/* CONTENT SECTION: Why Us? (Grid Layout) */}
        <h3 className="section-title">Why Choose Us?</h3>
        
        <div className="features-grid">
          {/* Kartu 1 */}
          <div className="feature-card">
            <div className="icon">📺</div>
            <h3>Enjoy on your TV</h3>
            <p>Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.</p>
          </div>

          {/* Kartu 2 */}
          <div className="feature-card">
            <div className="icon">fwMq</div>
            <h3>Download & Watch Offline</h3>
            <p>Save your favorites easily and always have something to watch when you're offline.</p>
          </div>

          {/* Kartu 3 */}
          <div className="feature-card">
            <div className="icon">🚫</div>
            <h3>No Annoying Ads</h3>
            <p>Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV without interruption.</p>
          </div>

          {/* Kartu 4 */}
          <div className="feature-card">
            <div className="icon">hk</div>
            <h3>4K Ultra HD</h3>
            <p>Experience cinematic visuals with our vast library of 4K UHD content with Dolby Atmos sound.</p>
          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="about-cta">
          <p>Ready to watch? Join Sanflix today.</p>
          <button className="cta-button">Get Started</button>
        </div>

      </div>
    </div>
  );
};

export default About;