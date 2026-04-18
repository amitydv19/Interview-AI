import React, { useState } from "react";
import "../auth.scss";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validate first
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // ✅ Store response
    const res = await handleRegister({ username, email, password });

    // ✅ Handle error (user already exists)
    if (!res.success) {
      alert(res.message);
      return;
    }

    // ✅ Navigate after success
    navigate("/");
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
            Start your journey <br/> to success.
          </h1>
          <p className="brand-sub">
            Join InterviewAI to generate personalized interview roadmaps, practice technical and behavioral questions, and track your progress in real-time.
          </p>
        </div>

        {/* Right Side: Form */}
        <div className="auth-form-wrap">
          <div className="glass-card form-container">
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  id="username"
                  placeholder="Enter Username"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
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
                  placeholder="Enter Your Password"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Your Password"
                  required
                />
              </div>

              <button className="button primary-button" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            <p className="auth-footer">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;