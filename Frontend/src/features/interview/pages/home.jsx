import React, { useState } from 'react'
import "../style/home.scss"

const Home = () => {

  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState(null);
  const [selfDescription, setSelfDescription] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setResume(files[0]);
    }
  };

  return (
    <main className='home'>
      <div className='header'>
        <h1>Create Your Custom <span className='highlight-text'>Interview Plan</span></h1>
        <p className='subtitle'>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
      </div>

      <div className='interview-input-group'>
        
        {/* Left Section - Job Description */}
        <div className="card left-card">
          <div className='card-header'>
            <span className='badge'>📌</span>
            <h2>Target Job Description</h2>
            <span className='badge-required'>Required</span>
          </div>
          
          <div className='card-content'>
            <textarea 
              id="jobDescription" 
              placeholder='Paste the full job description here...&#10;&#10;e.g. "Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design."'
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              maxLength={5000}
            />
          </div>

          <div className='char-count'>
            {jobDescription.length} / 5000 chars
          </div>
        </div>

        {/* Right Section - Profile */}
        <div className="card right-card">
          <div className='card-header'>
            <span className='badge'>👤</span>
            <h2>Your Profile</h2>
          </div>

          <div className='card-content'>
            
            {/* Resume Upload */}
            <div className='input-group resume-group'>
              <div className='group-label'>
                <label>Upload Resume</label>
                <span className='badge-required'>new feature</span>
              </div>
              
              <div 
                className='file-upload-area'
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  id="resume" 
                  accept='.pdf,.doc,.docx'
                  onChange={handleFileChange}
                  hidden
                />
                
                {resume ? (
                  <div className='file-selected'>
                    <span className='check-icon'>✓</span>
                    <p className='file-name'>{resume.name}</p>
                  </div>
                ) : (
                  <>
                    <label htmlFor="resume" className='file-label'>
                      <span className='upload-icon'>📄</span>
                      Click to upload or drag & drop
                    </label>
                    <p className='file-hint'>PDF or DOCX (Max 5MB)</p>
                  </>
                )}
              </div>
            </div>

            {/* Self Description */}
            <div className='input-group description-group'>
              <label htmlFor="selfDescription" className='group-label'>Quick Self-Description</label>
              <textarea 
                id="selfDescription" 
                placeholder='Briefly describe your experience, key skills, and years of experience if you don&#39;t have a resume handy...'
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
              />
            </div>

            {/* Note */}
            <div className='info-note'>
              <span className='info-icon'>ℹ️</span>
              <p>Either a <strong>Resume</strong> or <strong>Self Description</strong> is required to generate a personalized plan</p>
            </div>

            {/* Button */}
            <button className='generate-btn'>
              ✨ Generate My Interview Strategy
            </button>

          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className='footer'>
        <p>AI-Powered Interview Strategy • <strong>Aspire 360+</strong></p>
        <div className='footer-links'>
          <a href='#'>Privacy Policy</a>
          <a href='#'>Terms of Service</a>
          <a href='#'>Help Center</a>
        </div>
      </footer>
    </main>
  )
}

export default Home;