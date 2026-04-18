/**
 * Performance Dashboard Component
 * Tracks user performance and displays metrics
 */

import React, { useState, useEffect } from 'react';
import { calculatePerformanceMetrics } from '../utils/scoring';
import '../styles/dashboard.scss';

const PerformanceDashboard = ({ performances = [] }) => {
  const [metrics, setMetrics] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (performances && performances.length > 0) {
      const calculatedMetrics = calculatePerformanceMetrics(performances);
      setMetrics(calculatedMetrics);
      setChartData(generateChartData(performances));
    }
  }, [performances]);

  // ── Generate Chart Data ──
  const generateChartData = (perf) => {
    return perf.map((p, idx) => ({
      id: idx + 1,
      score: p.feedback?.overallScore || 0,
      topic: p.topic || 'Question ' + (idx + 1),
      date: new Date(p.timestamp).toLocaleDateString()
    }));
  };

  // ── Get Score Color ──
  const getScoreColor = (score) => {
    if (score >= 80) return '#34d399'; // Green
    if (score >= 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  // ── Get Progress Icon ──
  const getProgressIcon = (trend) => {
    if (trend === 'improving') return '📈';
    if (trend === 'declining') return '📉';
    return '➡️';
  };

  if (!metrics) {
    return (
      <div className="dashboard">
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <p>No performance data yet. Complete an interview to see your metrics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Performance Dashboard</h2>
        <p>Track your interview preparation progress</p>
      </div>

      <div className="dashboard-container">
        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon">🎯</div>
            <div className="metric-content">
              <h3>Average Score</h3>
              <div className="metric-value" style={{ color: getScoreColor(metrics.averageScore) }}>
                {metrics.averageScore}%
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">✓</div>
            <div className="metric-content">
              <h3>Total Interviews</h3>
              <div className="metric-value">{metrics.totalAttempts}</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">{getProgressIcon(metrics.progressTrend)}</div>
            <div className="metric-content">
              <h3>Progress Trend</h3>
              <div className="metric-value">
                {metrics.progressTrend.charAt(0).toUpperCase() + metrics.progressTrend.slice(1)}
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">⭐</div>
            <div className="metric-content">
              <h3>Best Performance</h3>
              <div className="metric-value">
                {chartData.length > 0 
                  ? Math.max(...chartData.map(d => d.score)) + '%'
                  : 'N/A'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* Score Progress Chart */}
          <div className="chart-card">
            <h3>Score Progress Over Time</h3>
            <div className="simple-chart">
              {chartData.length > 0 ? (
                <div className="bar-chart">
                  {chartData.map((data, idx) => (
                    <div key={idx} className="bar-item">
                      <div className="bar-label">{data.id}</div>
                      <div className="bar-container">
                        <div 
                          className="bar" 
                          style={{ 
                            height: `${data.score}%`,
                            backgroundColor: getScoreColor(data.score)
                          }}
                        />
                      </div>
                      <div className="bar-value">{data.score}%</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No data available</p>
              )}
            </div>
          </div>

          {/* Topic Breakdown */}
          <div className="chart-card">
            <h3>Performance by Topic</h3>
            <div className="topic-breakdown">
              {chartData.length > 0 ? (
                chartData.map((data, idx) => (
                  <div 
                    key={idx} 
                    className="topic-item"
                    onClick={() => setSelectedTopic(data.id)}
                  >
                    <div className="topic-info">
                      <span className="topic-name">{data.topic}</span>
                      <span className="topic-date">{data.date}</span>
                    </div>
                    <div className="topic-score" style={{ color: getScoreColor(data.score) }}>
                      {data.score}%
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No topic data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Weak & Strong Areas */}
        <div className="analysis-section">
          <div className="analysis-card weak-areas">
            <h3>📉 Areas to Improve</h3>
            <ul className="area-list">
              {metrics.weakAreas.length > 0 ? (
                metrics.weakAreas.map((area, idx) => (
                  <li key={idx} className="area-item">
                    <span className="area-icon">→</span>
                    {area || 'General Communication'}
                  </li>
                ))
              ) : (
                <li className="area-item">Great! No weak areas identified</li>
              )}
            </ul>
          </div>

          <div className="analysis-card strong-areas">
            <h3>📈 Strengths</h3>
            <ul className="area-list">
              {metrics.strongAreas.length > 0 ? (
                metrics.strongAreas.map((area, idx) => (
                  <li key={idx} className="area-item">
                    <span className="area-icon">✓</span>
                    {area || 'Communication'}
                  </li>
                ))
              ) : (
                <li className="area-item">Focus on more interviews to identify strengths</li>
              )}
            </ul>
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendations-card">
          <h3>💡 Personalized Recommendations</h3>
          <div className="recommendations-list">
            {metrics.averageScore < 60 && (
              <div className="recommendation-item">
                <span className="rec-icon">1</span>
                <p>Focus on providing more detailed and structured answers. Include specific examples and metrics.</p>
              </div>
            )}
            {metrics.weakAreas.length > 0 && (
              <div className="recommendation-item">
                <span className="rec-icon">2</span>
                <p>Practice more interviews in your weak areas: <strong>{metrics.weakAreas.join(', ')}</strong></p>
              </div>
            )}
            {metrics.progressTrend === 'improving' && (
              <div className="recommendation-item">
                <span className="rec-icon">3</span>
                <p>Great progress! Keep practicing to maintain momentum and improve further.</p>
              </div>
            )}
            {metrics.totalAttempts >= 5 && (
              <div className="recommendation-item">
                <span className="rec-icon">4</span>
                <p>You've completed {metrics.totalAttempts} interviews. Consider focusing on quality over quantity.</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="summary-card">
          <h3>Summary Statistics</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Highest Score</span>
              <span className="summary-value" style={{ color: getScoreColor(100) }}>
                {chartData.length > 0 ? Math.max(...chartData.map(d => d.score)) + '%' : 'N/A'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Lowest Score</span>
              <span className="summary-value" style={{ color: getScoreColor(Math.min(...chartData.map(d => d.score))) }}>
                {chartData.length > 0 ? Math.min(...chartData.map(d => d.score)) + '%' : 'N/A'}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Interview Streak</span>
              <span className="summary-value">{metrics.totalAttempts} sessions</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Improvement</span>
              <span className="summary-value" style={{ color: '#34d399' }}>
                {metrics.progressTrend === 'improving' ? '+15%' : 'Stable'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
