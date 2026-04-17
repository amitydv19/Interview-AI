import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../style/interview.scss';

// Mock Navbar inline (replace with your actual Navbar import)
const Navbar = ({ jobTitle }) => (
  <header className="interview-navbar">
    <div className="navbar-brand">
      <span className="brand-icon">⚡</span>
      <span className="brand-name">InterviewAI</span>
    </div>
    <div className="navbar-title">{jobTitle}</div>
    <div className="navbar-actions">
      <button className="navbar-btn">End Session</button>
    </div>
  </header>
);

const Interview = () => {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('technical');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [savedQuestions, setSavedQuestions] = useState(new Set());
  const [viewMode, setViewMode] = useState('questions'); // 'questions' or 'roadmap'

  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        setLoading(true);
        if (interviewId) {
          const response = await fetch(`http://localhost:3000/api/interview/${interviewId}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
          const data = await response.json();
          setInterviewData(data);
          setError(null);
        } else {
          // Demo data when no interviewId
          setInterviewData({
            jobdescribe: 'Senior Backend Engineer',
            technicalQuestion: [
              {
                question: 'Explain the event loop in Node.js',
                description:
                  'Describe how the Node.js event loop works, including the call stack, callback queue, and microtask queue. How does it enable non-blocking I/O?',
                userAnswer: '',
              },
              {
                question: 'What is Redis and when would you use it?',
                description:
                  'Explain Redis as an in-memory data store. Cover caching strategies, pub/sub patterns, and scenarios where Redis outperforms traditional databases.',
                userAnswer: '',
              },
              {
                question: 'Describe message queue architecture',
                description:
                  'Compare message brokers like RabbitMQ and Kafka. When would you choose one over the other? Describe a real-world use case.',
                userAnswer: '',
              },
            ],
            behavioralQuestion: [
              {
                question: 'Tell me about a time you resolved a production incident.',
                description:
                  'Use the STAR method. Focus on your specific actions, how you communicated with stakeholders, and what you learned from the experience.',
                userAnswer: '',
              },
              {
                question: 'How do you handle disagreements with teammates?',
                description:
                  'Describe a specific conflict and how you navigated it professionally while maintaining team cohesion.',
                userAnswer: '',
              },
            ],
            skillGaps: ['Redis', 'Message Queue', 'Event Loop', 'System Design', 'Docker'],
            prepationPlan: [
              'Review Node.js internals and event loop deeply',
              'Build a small Redis caching project',
              'Set up RabbitMQ locally and test pub/sub',
              'Practice system design interviews on Excalidraw',
              'Review Docker + Kubernetes basics',
            ],
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, [interviewId]);

  const getCurrentQuestions = () => {
    if (!interviewData) return [];
    return activeSection === 'technical'
      ? interviewData.technicalQuestion || []
      : interviewData.behavioralQuestion || [];
  };

  const currentQuestions = getCurrentQuestions();
  const currentKey = `${activeSection}-${currentQuestionIndex}`;

  const handleAnswerChange = (e) => {
    setAnswers((prev) => ({ ...prev, [currentKey]: e.target.value }));
    setSavedQuestions((prev) => {
      const next = new Set(prev);
      next.delete(currentKey);
      return next;
    });
  };

  const handleSave = () => {
    setSavedQuestions((prev) => new Set([...prev, currentKey]));
  };

  const progress = currentQuestions.length
    ? Math.round(((currentQuestionIndex + 1) / currentQuestions.length) * 100)
    : 0;

  return (
    <>
      <Navbar jobTitle={interviewData?.jobdescribe || 'Interview Portal'} />
      <div className="interview-layout">
        {/* ── Left Sidebar ── */}
        <aside className="sidebar sidebar--left">
          <nav className="sidebar-nav">
            <p className="sidebar-nav__label">Sections</p>
            <button
              className={`sidebar-nav__item ${activeSection === 'technical' ? 'active' : ''}`}
              onClick={() => { setActiveSection('technical'); setViewMode('questions'); setCurrentQuestionIndex(0); }}
            >
              <span className="item__icon">⟨/⟩</span>
              <span className="item__text">Technical Questions</span>
              <span className="item__badge">
                {interviewData?.technicalQuestion?.length || 0}
              </span>
            </button>

            <button
              className={`sidebar-nav__item ${activeSection === 'behavioral' ? 'active' : ''}`}
              onClick={() => { setActiveSection('behavioral'); setViewMode('questions'); setCurrentQuestionIndex(0); }}
            >
              <span className="item__icon">◎</span>
              <span className="item__text">Behavioral Questions</span>
              <span className="item__badge">
                {interviewData?.behavioralQuestion?.length || 0}
              </span>
            </button>

            <button
              className={`sidebar-nav__item ${viewMode === 'roadmap' ? 'active' : ''}`}
              onClick={() => { setViewMode('roadmap'); setCurrentQuestionIndex(0); }}
            >
              <span className="item__icon">🗺</span>
              <span className="item__text">Road Map</span>
            </button>
          </nav>

          {currentQuestions.length > 0 && viewMode === 'questions' && (
            <div className="question-list">
              <p className="sidebar-nav__label">Questions</p>
              {currentQuestions.map((q, i) => (
                <button
                  key={i}
                  className={`question-pill ${i === currentQuestionIndex ? 'active' : ''} ${
                    savedQuestions.has(`${activeSection}-${i}`) ? 'saved' : ''
                  }`}
                  onClick={() => setCurrentQuestionIndex(i)}
                >
                  <span className="pill-num">{i + 1}</span>
                  <span className="pill-text">{q.question.slice(0, 32)}…</span>
                </button>
              ))}
            </div>
          )}
        </aside>

        {/* ── Main Content ── */}
        <main className="interview-main">
          {loading ? (
            <div className="state-card">
              <div className="state-card__icon spin">⏳</div>
              <h3>Loading Interview…</h3>
              <p>Hang tight while we prepare your questions.</p>
            </div>
          ) : error ? (
            <div className="state-card state-card--error">
              <div className="state-card__icon">✕</div>
              <h3>Something went wrong</h3>
              <p>{error}</p>
              <button className="btn btn--outline" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          ) : viewMode === 'roadmap' ? (
            <div className="roadmap-container">
              <div className="roadmap-header">
                <div>
                  <h2 className="roadmap-title">Preparation Road Map</h2>
                  <p className="roadmap-days">7-day plan</p>
                </div>
              </div>
              <div className="roadmap-timeline">
                {interviewData?.prepationPlan && interviewData.prepationPlan.length > 0 ? (
                  <div className="timeline">
                    {interviewData.prepationPlan.map((item, i) => (
                      <div key={i} className="timeline-item">
                        <div className="timeline-marker">
                          <div className="marker-dot"></div>
                          <div className="marker-label">Day {i + 1}</div>
                        </div>
                        <div className="timeline-content">
                          {/* Extract title if it's like "**Title**: Description" */}
                          {item.includes('**') ? (
                            <>
                              <h3 className="timeline-title">
                                {item.split('**')[1] || item.split(':')[0]}
                              </h3>
                              <ul className="timeline-tasks">
                                {item.split('•').slice(1).map((task, idx) => (
                                  <li key={idx}>{task.trim()}</li>
                                ))}
                              </ul>
                            </>
                          ) : item.includes(':') ? (
                            <>
                              <h3 className="timeline-title">
                                {item.split(':')[0].trim()}
                              </h3>
                              <p className="timeline-desc">{item.split(':')[1].trim()}</p>
                            </>
                          ) : (
                            <p className="timeline-desc">{item}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="state-card">
                    <div className="state-card__icon">📝</div>
                    <h3>No Preparation Plan Yet</h3>
                    <p>Complete the interview to generate your personalized roadmap.</p>
                  </div>
                )}
              </div>
              <button
                className="btn btn--ghost"
                onClick={() => { setViewMode('questions'); }}
                style={{ marginTop: '24px' }}
              >
                ← Back to Questions
              </button>
            </div>
          ) : currentQuestions.length > 0 ? (
            <div className="question-card">
              {/* Header */}
              <div className="question-card__header">
                <div className="header-meta">
                  <span className="section-tag">
                    {activeSection === 'technical' ? '⟨/⟩ Technical' : '◎ Behavioral'}
                  </span>
                  <span className="counter">
                    {currentQuestionIndex + 1} <span>/ {currentQuestions.length}</span>
                  </span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
                </div>
              </div>

              {/* Question */}
              <div className="question-card__body">
                <h2 className="question-title">
                  {currentQuestions[currentQuestionIndex]?.question}
                </h2>
                <p className="question-desc">
                  {currentQuestions[currentQuestionIndex]?.description}
                </p>

                <div className="answer-area">
                  <label className="answer-label">Your Answer</label>
                  <textarea
                    className="answer-textarea"
                    placeholder="Type your answer here…"
                    value={
                      answers[currentKey] ??
                      currentQuestions[currentQuestionIndex]?.userAnswer ??
                      ''
                    }
                    onChange={handleAnswerChange}
                  />
                  {savedQuestions.has(currentKey) && (
                    <span className="saved-badge">✓ Saved</span>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="question-card__footer">
                <button
                  className="btn btn--ghost"
                  onClick={() => setCurrentQuestionIndex((p) => Math.max(0, p - 1))}
                  disabled={currentQuestionIndex === 0}
                >
                  ← Previous
                </button>
                <button className="btn btn--primary" onClick={handleSave}>
                  Save Answer
                </button>
                <button
                  className="btn btn--ghost"
                  onClick={() =>
                    setCurrentQuestionIndex((p) =>
                      Math.min(currentQuestions.length - 1, p + 1)
                    )
                  }
                  disabled={currentQuestionIndex === currentQuestions.length - 1}
                >
                  Next →
                </button>
              </div>
            </div>
          ) : (
            <div className="state-card">
              <div className="state-card__icon">📋</div>
              <h3>No Questions Yet</h3>
              <p>Questions will appear once the interview is generated.</p>
            </div>
          )}
        </main>

        {/* ── Right Sidebar ── */}
        <aside className="sidebar sidebar--right">
          {viewMode === 'roadmap' && interviewData?.matchScore && (
            <div className="match-score-section">
              <p className="sidebar-nav__label">Match Score</p>
              <div className="score-circle">
                <svg viewBox="0 0 120 120" className="score-svg">
                  <circle cx="60" cy="60" r="54" className="score-bg" />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    className="score-fill"
                    style={{
                      strokeDasharray: `${(interviewData.matchScore / 100) * 2 * Math.PI * 54} ${2 * Math.PI * 54}`,
                    }}
                  />
                </svg>
                <div className="score-text">
                  <span className="score-number">{interviewData.matchScore}</span>
                  <span className="score-label">Match</span>
                </div>
              </div>
              <p className="score-description">Strong match for this role</p>
            </div>
          )}

          {viewMode === 'questions' && (
            <>
              <div className="sidebar-section">
                <p className="sidebar-nav__label">Skill Gaps</p>
                <div className="skill-chips">
                  {interviewData?.skillGaps?.length ? (
                    interviewData.skillGaps.map((skill, i) => (
                      <span key={i} className="skill-chip">{skill}</span>
                    ))
                  ) : (
                    <p className="empty-text">No skill gaps identified yet</p>
                  )}
                </div>
              </div>

              {interviewData?.prepationPlan?.length > 0 && (
                <div className="sidebar-section">
                  <p className="sidebar-nav__label">Preparation Plan</p>
                  <ol className="prep-list">
                    {interviewData.prepationPlan.map((item, i) => (
                      <li key={i} className="prep-item">
                        <span className="prep-num">{i + 1}</span>
                        <span className="prep-text">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </>
          )}
        </aside>
      </div>
    </>
  );
};

export default Interview;