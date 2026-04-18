import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/hooks/useAuth';
import { MockInterview, ATSAnalyzer, PerformanceDashboard } from '../../mockInterview/components';
import '../style/home.scss';
import logo from '../../../assets/logo.png';

const Home = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const [activeTab, setActiveTab] = useState('plan');
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState(null);
  const [selfDescription, setSelfDescription] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [performances, setPerformances] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogoutClick = async () => {
    navigate('/', { replace: true });
    await handleLogout();
  };

  const handleInterviewComplete = (data) => {
    setPerformances([...performances, { ...data, feedback: { overallScore: 75 }, timestamp: new Date() }]);
    setActiveTab('dashboard');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setResume(file);
  };

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) setResume(files[0]);
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setResume(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!jobDescription.trim()) {
      setError('Job description is required');
      return;
    }

    if (!resume && !selfDescription.trim()) {
      setError('Either a resume or self-description is required');
      return;
    }

    try {
      setLoading(true);

      // Create FormData
      const formData = new FormData();
      formData.append('jobDescription', jobDescription);
      formData.append('selfDescription', selfDescription);
      
      // Add resume file if present
      if (resume) {
        formData.append('resume', resume);
      }

      // Send to backend
      const response = await fetch('http://localhost:3000/api/interview', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.status}`);
      }

      const data = await response.json();
      const interviewId = data.interviewReport._id;

      // Redirect to interview page
      navigate(`/interview/${interviewId}`);
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err.message || 'Failed to generate interview report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`home-root ${mounted ? 'mounted' : ''}`}>
      {/* Ambient background orbs */}
      <div className="bg-orb bg-orb--1" />
      <div className="bg-orb bg-orb--2" />
      <div className="bg-orb bg-orb--3" />

      {/* ── Sticky Navbar ── */}
      <nav className={`home-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <div className="navbar-brand">
            <img src={logo} alt="InterviewAI" className="brand-logo" />
          </div>

          <div className="navbar-pill">
            <span>Create Interview Plan</span>
          </div>

          <div className="navbar-right">
            {user && (
              <>
                <div className="user-chip">
                  <div className="user-avatar">
                    {(user.username || user.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="user-meta">
                    <span className="user-name">{user.username || user.email}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                </div>
                <button className="logout-btn" onClick={handleLogoutClick}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="home-main">
        {/* Hero */}
        <section className="hero">
          <div className="hero-label">AI-Powered Prep</div>
          <h1 className="hero-title">
            Create Your Custom<br />
            <span className="hero-accent">Interview Plan</span>
          </h1>
          <p className="hero-sub">
            Let our AI analyze the job requirements and your unique profile<br />
            to build a winning strategy — tailored just for you.
          </p>
        </section>

        {/* Cards grid */}
        <div className="cards-grid">

          {/* ── Tab Navigation ── */}
          <div className="tab-navigation" style={{ gridColumn: '1 / -1', marginBottom: '24px' }}>
            <button 
              className={`tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
              onClick={() => setActiveTab('plan')}
            >
              📋 Interview Plan
            </button>
            <button 
              className={`tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
              onClick={() => setActiveTab('practice')}
            >
              🎯 Mock Interview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'ats' ? 'active' : ''}`}
              onClick={() => setActiveTab('ats')}
            >
              📊 ATS Analyzer
            </button>
            <button 
              className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📈 Performance
            </button>
          </div>

          {/* ── Tab Content ── */}
          {activeTab === 'plan' ? (
            <>
              {/* ── Left Card: Job Description ── */}
          <div className="glass-card card--left">
            <div className="card-header">
              <div className="card-header__icon">📌</div>
              <div className="card-header__text">
                <h2>Target Job Description</h2>
                <p>Paste the full JD from any job board</p>
              </div>
              <span className="badge badge--required">Required</span>
            </div>

            <div className="card-body">
              <textarea
                className="glass-textarea"
                placeholder={'Paste the full job description here...\n\ne.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design."'}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                maxLength={5000}
              />
            </div>

            <div className="card-footer">
              <div className="char-bar">
                <div
                  className="char-bar__fill"
                  style={{ width: `${(jobDescription.length / 5000) * 100}%` }}
                />
              </div>
              <span className="char-count">
                {jobDescription.length.toLocaleString()} / 5,000
              </span>
            </div>
          </div>

          {/* ── Right Card: Profile ── */}
          <div className="glass-card card--right">
            <div className="card-header">
              <div className="card-header__icon">👤</div>
              <div className="card-header__text">
                <h2>Your Profile</h2>
                <p>Resume or quick description — your choice</p>
              </div>
            </div>

            <div className="card-body">
              {/* Resume Upload */}
              <div className="field-group">
                <div className="field-label-row">
                  <label>Upload Resume</label>
                  <span className="badge badge--new">✦ New</span>
                </div>

                <div
                  className={`drop-zone ${dragOver ? 'drag-active' : ''} ${resume ? 'has-file' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !resume && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    hidden
                  />
                  {resume ? (
                    <div className="file-selected">
                      <span className="file-icon">📄</span>
                      <div className="file-info">
                        <span className="file-name">{resume.name}</span>
                        <span className="file-size">
                          {(resume.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <button className="file-remove" onClick={removeFile}>✕</button>
                    </div>
                  ) : (
                    <div className="drop-prompt">
                      <span className="drop-icon">⬆</span>
                      <span className="drop-text">Click to upload or drag & drop</span>
                      <span className="drop-hint">PDF or DOCX · Max 5 MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="or-divider">
                <span>or</span>
              </div>

              {/* Self description */}
              <div className="field-group">
                <label className="field-label-row">Quick Self-Description</label>
                <textarea
                  className="glass-textarea glass-textarea--short"
                  placeholder="Briefly describe your experience, key skills, and years of experience..."
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                />
              </div>

              {/* Info note */}
              <div className="info-note">
                <span className="info-note__icon">ℹ</span>
                <p>
                  Either a <strong>Resume</strong> or <strong>Self Description</strong> is
                  required to generate your personalised plan.
                </p>
              </div>
            </div>

            <div className="card-footer card-footer--action">
              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠</span>
                  {error}
                </div>
              )}
              <button 
                className="generate-btn" 
                onClick={handleGenerateReport}
                disabled={loading}
              >
                <span className="generate-btn__shine" />
                <span className="generate-btn__icon">{loading ? '⏳' : '✦'}</span>
                {loading ? 'Generating...' : 'Generate My Interview Strategy'}
              </button>
            </div>
          </div>
            </>
          ) : activeTab === 'practice' ? (
            <div style={{ gridColumn: '1 / -1' }}>
              <MockInterview topic="behavioral" onComplete={handleInterviewComplete} />
            </div>
          ) : activeTab === 'ats' ? (
            <div style={{ gridColumn: '1 / -1' }}>
              <ATSAnalyzer />
            </div>
          ) : activeTab === 'dashboard' ? (
            <div style={{ gridColumn: '1 / -1' }}>
              <PerformanceDashboard performances={performances} />
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <footer className="home-footer">
          <p>AI-Powered Interview Strategy · <strong>Aspire 360+</strong></p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Home;