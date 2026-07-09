import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <section className="hero-home">
        <div className="hero-overlay">
          <h1 className="hero-title">Performance Nutrition</h1>
          <div className="hero-buttons">
            <Link to="/about" className="hero-btn">About Us</Link>
            <Link to="/testimonials" className="hero-btn">Testimonials</Link>
            <Link to="/membership" className="hero-btn">Be a Member</Link>
            <Link to="/contact" className="hero-btn">Contact Us</Link>
            <Link to="/login" className="hero-btn">Member Login</Link>
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="container">
          <h2 className="landing-title">Landing Page</h2>
        </div>
      </section>
    </div>
  );
}

export default Home;