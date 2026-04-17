import React, { useState } from "react";
import "../auth.scss";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  const { loading, handleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await handleLogin({ email, password });

    if (success) {
      navigate("/home");
    }
  };

  if (loading) {
    return (
      <main className="auth-page">
        <div className="auth-split" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <h1 style={{ color: 'white' }}>Loading.....</h1>
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

              <button className="button primary-button">Login</button>
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