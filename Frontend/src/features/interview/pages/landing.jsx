import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../style/landing.scss";

const Landing = () => {
  const [scrolled, setScrolled] = useState(false); // ✅ inside component

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll); // cleanup
  }, []);

  return (
    <div className="landing">

      {/* NAVBAR */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <h1 className="logo">InterviewAI</h1>
        <div className="nav-links">
          <Link to="/login" className="btn outline">Login</Link>
          <Link to="/register" className="btn primary">Register</Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <h1>
          Crack Your Dream Job with <span>AI-Powered Preparation</span>
        </h1>
        <p>
          Get personalized interview strategies using your resume and job description.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="btn primary large">
            Get Started
          </Link>
          <Link to="/login" className="btn outline large">
            Login
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h2>Why Use InterviewAI?</h2>

        <div className="feature-grid">
          <div className="card">
            <h3>📄 Resume Analysis</h3>
            <p>Upload your resume and get AI-driven insights.</p>
          </div>

          <div className="card">
            <h3>🎯 Job Matching</h3>
            <p>Paste job description and get targeted preparation.</p>
          </div>

          <div className="card">
            <h3>🧠 Smart Interview Plan</h3>
            <p>Personalized strategy based on your profile.</p>
          </div>

          <div className="card">
            <h3>⚡ Fast Results</h3>
            <p>Get everything ready within seconds.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="steps">
        <h2>How It Works</h2>

        <div className="steps-grid">
          <div className="step"><span>1</span><p>Paste Job Description</p></div>
          <div className="step"><span>2</span><p>Upload Resume / Write Self Description</p></div>
          <div className="step"><span>3</span><p>Generate Interview Strategy</p></div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Start Preparing Today 🚀</h2>
        <Link to="/register" className="btn primary large">
          Create Account
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 InterviewAI. All rights reserved.</p>
      </footer>

    </div>
  );
};

export default Landing;