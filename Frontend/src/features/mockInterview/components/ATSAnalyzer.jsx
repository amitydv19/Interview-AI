/**
 * ATS Analyzer Component
 * Analyzes resume vs job description and provides ATS score
 */

import React, { useState } from 'react';
import { calculateATSScore } from '../utils/scoring';
import '../styles/atsAnalyzer.scss';

const ATSAnalyzer = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);

  // ── Handle File Upload ──
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      // For PDF files, in production you'd need a PDF parser
      // For now, we'll use the filename as indicator
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => {
          setResumeText(event.target.result);
        };
        reader.readAsText(file);
      } else {
        alert('Please upload a .txt file or paste your resume directly');
        setResumeFile(null);
      }
    }
  };

  // ── Analyze ──
  const handleAnalyze = () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      alert('Please provide both resume and job description');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = calculateATSScore(resumeText, jobDescription);
      setAnalysisResult(result);
      setLoading(false);
    }, 800);
  };

  // ── Clear ──
  const handleClear = () => {
    setResumeText('');
    setJobDescription('');
    setAnalysisResult(null);
    setResumeFile(null);
  };

  return (
    <div className="ats-analyzer">
      <div className="analyzer-header">
        <h2>ATS Resume Analyzer</h2>
        <p>Check how well your resume matches the job description</p>
      </div>

      <div className="analyzer-container">
        {/* Input Section */}
        <div className="input-section">
          {/* Resume Input */}
          <div className="input-group">
            <label className="input-label">
              <span className="label-text">📄 Resume</span>
              {resumeFile && <span className="file-badge">{resumeFile.name}</span>}
            </label>
            
            <div className="file-upload-area">
              <input
                type="file"
                accept=".txt,.pdf"
                onChange={handleFileUpload}
                className="file-input"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="upload-label">
                Click to upload or drag & drop
              </label>
            </div>

            <textarea
              className="textarea-input"
              placeholder="Or paste your resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              rows="10"
            />
            <span className="char-count">{resumeText.length} characters</span>
          </div>

          {/* Job Description Input */}
          <div className="input-group">
            <label className="input-label">
              <span className="label-text">📋 Job Description</span>
            </label>

            <textarea
              className="textarea-input"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows="10"
            />
            <span className="char-count">{jobDescription.length} characters</span>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button 
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={loading || !resumeText.trim() || !jobDescription.trim()}
            >
              {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Section */}
        {analysisResult && (
          <div className="results-section">
            <div className="score-card">
              <div className="score-circle">
                <div className="score-number">{analysisResult.score}</div>
                <div className="score-label">ATS Score</div>
              </div>
              <div className="score-description">
                {analysisResult.score >= 80 ? '✓ Excellent Match' : 
                 analysisResult.score >= 60 ? '◐ Good Match' : 
                 '✗ Needs Improvement'}
              </div>
            </div>

            {/* Matched Keywords */}
            <div className="result-group">
              <h3>✓ Matched Keywords ({analysisResult.matchedKeywords.length})</h3>
              <div className="keywords-container">
                {analysisResult.matchedKeywords.length > 0 ? (
                  analysisResult.matchedKeywords.map((keyword, idx) => (
                    <span key={idx} className="keyword keyword-matched">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <p className="no-keywords">No keywords matched</p>
                )}
              </div>
            </div>

            {/* Missing Keywords */}
            <div className="result-group">
              <h3>✗ Missing Keywords ({analysisResult.missingKeywords.length})</h3>
              <div className="keywords-container">
                {analysisResult.missingKeywords.length > 0 ? (
                  analysisResult.missingKeywords.map((keyword, idx) => (
                    <span key={idx} className="keyword keyword-missing">
                      {keyword}
                    </span>
                  ))
                ) : (
                  <p className="no-keywords">Great! You have all the keywords</p>
                )}
              </div>
            </div>

            {/* Suggestions */}
            <div className="result-group">
              <h3>💡 Recommendations</h3>
              <ul className="suggestions-list">
                {analysisResult.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="suggestion-item">
                    <span className="suggestion-icon">→</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-label">Total Keywords Analyzed</span>
                <span className="stat-value">{analysisResult.totalKeywords}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Match Rate</span>
                <span className="stat-value">
                  {Math.round((analysisResult.matchedKeywords.length / analysisResult.totalKeywords) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!analysisResult && !loading && (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <p>Paste your resume and job description to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ATSAnalyzer;
