import React, { useState } from "react";
import "../auth.scss";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const createConfetti = () => {
    const colors = ['purple', 'pink', 'cyan', 'green'];
    for (let i = 0; i < 20; i++) {
      const confetti = document.createElement('div');
      confetti.className = `confetti confetti--${colors[Math.floor(Math.random() * colors.length)]}`;
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.top = Math.random() * window.innerHeight + 'px';
      confetti.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
      confetti.style.setProperty('--ty', (Math.random() + 0.5) * 300 + 'px');
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 2500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await handleLogin({ email, password });

    if (success) {
      setShowSuccess(true);
      createConfetti();
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    }
  };

  if (loading) {
    return (
      <main className="auth-page">
        <div className="auth-loading-overlay">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-content">
            <div className="success-checkmark">✓</div>
            <h2 className="success-title">Welcome Back!</h2>
            <p className="success-message">Login successful</p>
            <p className="success-subtext">Redirecting to your dashboard...</p>
          </div>
        </div>
      )}

      {/* Background Elements */}
      <div className="bg-grid"></div>
      <div className="orb orb--1"></div>
      <div className="orb orb--2"></div>

      <div className="auth-split">
        {/* Left Side: Branding */}
        <div className="auth-brand">
          <Link to="/" className="brand-logo">
            <div className="brand-gem">⚡</div>
            <span className="brand-text">InterviewAI</span>
          </Link>
          <h1 className="brand-headline">
            Welcome back to your <br/> interview prep.
          </h1>
          <p className="brand-sub">
            Log in to continue practicing, review your performance, and unlock AI-powered insights that will help you land your dream job.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-wrap">
          <div className="glass-card form-container">
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter Email Address"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter Your Password"
                  required
                />
              </div>

              <button className="button primary-button" disabled={showSuccess}>Login</button>
            </form>

            <p className="auth-footer">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;