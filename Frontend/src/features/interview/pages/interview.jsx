import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../style/interview.scss';

// ── Inline Navbar ─────────────────────────────────────────────────────────────
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

// ── Roadmap View ──────────────────────────────────────────────────────────────
const RoadmapView = ({ prepationPlan, onBack }) => (
  <div className="roadmap-container">
    <div className="roadmap-header">
      <div>
        <h2 className="roadmap-title">Preparation Road Map</h2>
        <span className="roadmap-days">7-day plan</span>
      </div>
    </div>

    <div className="roadmap-timeline">
      {prepationPlan?.length > 0 ? (
        <div className="timeline">
          {prepationPlan.map((item, i) => {
            // Parse "Title: description" or "**Title**: • task • task" formats
            let title = '';
            let desc = '';
            let tasks = [];

            if (item.includes('**')) {
              const boldMatch = item.match(/\*\*([^*]+)\*\*/);
              title = boldMatch ? boldMatch[1] : '';
              const rest = item.replace(/\*\*[^*]+\*\*:?\s*/, '');
              tasks = rest.split('•').map(t => t.trim()).filter(Boolean);
            } else if (item.includes(':')) {
              const colonIdx = item.indexOf(':');
              title = item.slice(0, colonIdx).trim();
              const rest = item.slice(colonIdx + 1).trim();
              tasks = rest.split('•').map(t => t.trim()).filter(Boolean);
              if (tasks.length === 0) desc = rest;
            } else {
              desc = item;
            }

            return (
              <div key={i} className="timeline-item">
                <div className="timeline-marker">
                  <span className="marker-label">Day {i + 1}</span>
                </div>
                <div className="timeline-content">
                  {title && <h3 className="timeline-title">{title}</h3>}
                  {desc && <p className="timeline-desc">{desc}</p>}
                  {tasks.length > 0 && (
                    <ul className="timeline-tasks">
                      {tasks.map((task, idx) => (
                        <li key={idx}>{task}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="state-card">
          <div className="state-card__icon">📝</div>
          <h3>No Preparation Plan Yet</h3>
          <p>Complete the interview to generate your personalized roadmap.</p>
        </div>
      )}
    </div>

    <button className="btn btn--ghost" onClick={onBack} style={{ marginTop: 24 }}>
      ← Back to Questions
    </button>
  </div>
);

// ── Questions View ────────────────────────────────────────────────────────────
const QuestionsView = ({
  activeSection,
  currentQuestions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  answers,
  currentKey,
  onAnswerChange,
  onSave,
  savedQuestions,
}) => {
  const progress = currentQuestions.length
    ? Math.round(((currentQuestionIndex + 1) / currentQuestions.length) * 100)
    : 0;

  if (!currentQuestions.length) {
    return (
      <div className="state-card">
        <div className="state-card__icon">📋</div>
        <h3>No Questions Yet</h3>
        <p>Questions will appear once the interview is generated.</p>
      </div>
    );
  }

  return (
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

      {/* Body */}
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
            value={answers[currentKey] ?? currentQuestions[currentQuestionIndex]?.userAnswer ?? ''}
            onChange={onAnswerChange}
          />
          {savedQuestions.has(currentKey) && (
            <span className="saved-badge">✓ Saved</span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="question-card__footer">
        <button
          className="btn btn--ghost"
          onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
          disabled={currentQuestionIndex === 0}
        >
          ← Previous
        </button>
        <button className="btn btn--primary" onClick={onSave}>
          Save Answer
        </button>
        <button
          className="btn btn--ghost"
          onClick={() => setCurrentQuestionIndex(p => Math.min(currentQuestions.length - 1, p + 1))}
          disabled={currentQuestionIndex === currentQuestions.length - 1}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

// ── Main Interview Component ──────────────────────────────────────────────────
const Interview = () => {
  const { interviewId } = useParams();

  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [activeSection, setActiveSection] = useState('technical');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers]             = useState({});
  const [savedQuestions, setSavedQuestions] = useState(new Set());
  const [viewMode, setViewMode]           = useState('questions'); // 'questions' | 'roadmap'

  // ── Fetch ──
  useEffect(() => {
    const fetchInterviewData = async () => {
      try {
        setLoading(true);

        if (interviewId) {
          const res = await fetch(`http://localhost:3000/api/interview/${interviewId}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          });
          if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
          setInterviewData(await res.json());
        } else {
          // Demo data
          setInterviewData({
            jobdescribe: 'Senior Backend Engineer',
            matchScore: 88,
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
                  'Use the STAR method. Focus on your specific actions, how you communicated with stakeholders, and what you learned.',
                userAnswer: '',
              },
              {
                question: 'How do you handle disagreements with teammates?',
                description:
                  'Describe a specific conflict and how you navigated it professionally while maintaining team cohesion.',
                userAnswer: '',
              },
            ],
            skillGaps: [
              'Message Queues (Kafka/RabbitMQ)',
              'Advanced Docker & CI/CD Pipelines',
              'Distributed Systems Design',
              'Production-level Redis management',
            ],
            prepationPlan: [
              'Node.js Internals & Streams: Deep dive into the Event Loop phases and process.nextTick vs setImmediate. • Practice implementing Node.js Streams for handling large data sets.',
              'Advanced MongoDB & Indexing: Study Compound Indexes, TTL Indexes, and Text Indexes. • Practice writing complex Aggregation pipelines and using the .explain("executionStats") method.',
              'Caching & Redis Strategies: Read about Redis data types beyond strings (Sets, Hashes, Sorted Sets). • Implement a Redis-based rate limiter or a caching layer for a sample API.',
              'System Design & Microservices: Study Microservices communication patterns (Synchronous vs Asynchronous). • Learn about the API Gateway pattern and Circuit Breakers.',
              'Message Queues & DevOps Basics: Watch introductory tutorials on RabbitMQ or Kafka. • Dockerize a project and write a simple GitHub Actions workflow for CI.',
              'Data Structures & Algorithms: Solve 5–10 Medium LeetCode problems focusing on Arrays, Strings, and Hash Maps. • Review common sorting and searching algorithms.',
              'Mock Interview & Project Review: Conduct a mock interview focusing on explaining the Real-time Chat Application architecture. • Prepare concise summaries for all work experience bullets.',
            ],
          });
        }

        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviewData();
  }, [interviewId]);

  // ── Helpers ──
  const getCurrentQuestions = () => {
    if (!interviewData) return [];
    return activeSection === 'technical'
      ? interviewData.technicalQuestion || []
      : interviewData.behavioralQuestion || [];
  };

  const currentQuestions = getCurrentQuestions();
  const currentKey = `${activeSection}-${currentQuestionIndex}`;

  const handleAnswerChange = (e) => {
    setAnswers(prev => ({ ...prev, [currentKey]: e.target.value }));
    setSavedQuestions(prev => {
      const next = new Set(prev);
      next.delete(currentKey);
      return next;
    });
  };

  const handleSave = () => {
    setSavedQuestions(prev => new Set([...prev, currentKey]));
  };

  const switchSection = (section) => {
    setActiveSection(section);
    setViewMode('questions');
    setCurrentQuestionIndex(0);
  };

  // ── Render ──
  return (
    <>
      <Navbar jobTitle={interviewData?.jobdescribe || 'Interview Portal'} />

      <div className="interview-layout">
        {/* ── Left Sidebar ── */}
        <aside className="sidebar sidebar--left">
          <nav className="sidebar-nav">
            <p className="sidebar-nav__label">Sections</p>

            <button
              className={`sidebar-nav__item ${activeSection === 'technical' && viewMode === 'questions' ? 'active' : ''}`}
              onClick={() => switchSection('technical')}
            >
              <span className="item__icon">⟨/⟩</span>
              <span className="item__text">Technical Questions</span>
              <span className="item__badge">
                {interviewData?.technicalQuestion?.length || 0}
              </span>
            </button>

            <button
              className={`sidebar-nav__item ${activeSection === 'behavioral' && viewMode === 'questions' ? 'active' : ''}`}
              onClick={() => switchSection('behavioral')}
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

          {/* Question list pills */}
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
                  <span className="pill-text">
                    {q.question.length > 32 ? q.question.slice(0, 32) + '…' : q.question}
                  </span>
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
            <RoadmapView
              prepationPlan={interviewData?.prepationPlan}
              onBack={() => setViewMode('questions')}
            />
          ) : (
            <QuestionsView
              activeSection={activeSection}
              currentQuestions={currentQuestions}
              currentQuestionIndex={currentQuestionIndex}
              setCurrentQuestionIndex={setCurrentQuestionIndex}
              answers={answers}
              currentKey={currentKey}
              onAnswerChange={handleAnswerChange}
              onSave={handleSave}
              savedQuestions={savedQuestions}
            />
          )}
        </main>

        {/* ── Right Sidebar ── */}
        <aside className="sidebar sidebar--right">
          {/* Match score — shown in roadmap view */}
          {viewMode === 'roadmap' && interviewData?.matchScore && (
            <div className="match-score-section">
              <p className="sidebar-nav__label">Match Score</p>
              <div className="score-circle">
                <svg viewBox="0 0 120 120" className="score-svg">
                  <circle cx="60" cy="60" r="54" className="score-bg" />
                  <circle
                    cx="60" cy="60" r="54"
                    className="score-fill"
                    style={{
                      strokeDasharray: `${(interviewData.matchScore / 100) * 2 * Math.PI * 54} ${2 * Math.PI * 54}`,
                    }}
                  />
                </svg>
                <div className="score-text">
                  <span className="score-number">{interviewData.matchScore}</span>
                  <span className="score-label">%</span>
                </div>
              </div>
              <p className="score-description">Strong match for this role</p>

              {/* Skill gap chips shown in roadmap too (matches screenshot) */}
              {interviewData?.skillGaps?.length > 0 && (
                <div className="sidebar-section" style={{ marginTop: 20, width: '100%' }}>
                  <div className="skill-chips">
                    {interviewData.skillGaps.map((skill, i) => (
                      <span key={i} className="skill-chip">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Questions view — skill gaps + prep plan */}
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
                    {interviewData.prepationPlan.map((item, i) => {
                      const label = item.includes(':')
                        ? item.split(':')[0].trim()
                        : item.slice(0, 40);
                      return (
                        <li key={i} className="prep-item">
                          <span className="prep-num">{i + 1}</span>
                          <span className="prep-text">{label}</span>
                        </li>
                      );
                    })}
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