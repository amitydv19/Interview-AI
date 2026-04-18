/**
 * MockInterview Component
 * Simulates a real interview chat interface with AI questions
 */

import React, { useState, useEffect, useRef } from 'react';
import { getInterviewQuestion, getAIFeedback, getNextQuestion } from '../services/aiService';
import { analyzeAnswerFeedback, generateMockQuestions } from '../utils/scoring';
import '../styles/mockInterview.scss';

const MockInterview = ({ topic = 'behavioral', onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize interview
  useEffect(() => {
    if (interviewStarted && questions.length === 0) {
      loadQuestions();
    }
  }, [interviewStarted]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  // ── Load Questions ──
  const loadQuestions = async () => {
    setLoading(true);
    try {
      const mockQuestions = generateMockQuestions(topic);
      setQuestions(mockQuestions);
      addBotMessage(mockQuestions[0]);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Start Interview ──
  const startInterview = () => {
    setInterviewStarted(true);
    setConversationHistory([]);
    setCurrentQuestionIndex(0);
  };

  // ── Add Bot Message ──
  const addBotMessage = (message) => {
    setConversationHistory(prev => [...prev, {
      type: 'bot',
      message,
      timestamp: new Date()
    }]);
  };

  // ── Submit Answer ──
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;

    setLoading(true);
    try {
      // Add user message to history
      setConversationHistory(prev => [...prev, {
        type: 'user',
        message: userAnswer,
        timestamp: new Date()
      }]);

      // Get feedback
      const answerFeedback = analyzeAnswerFeedback(userAnswer);
      setFeedback(answerFeedback);
      setShowFeedback(true);

      // Add feedback message
      addBotMessage(`Great answer! Here's my feedback:\n\n✓ Confidence: ${answerFeedback.confidenceScore}%\n✓ Communication: ${answerFeedback.communicationScore}%\n✓ Clarity: ${answerFeedback.clarityScore}%\n\n${answerFeedback.suggestions.join('\n')}`);

      setUserAnswer('');
    } catch (error) {
      console.error('Error submitting answer:', error);
      addBotMessage("I'm having trouble analyzing your response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Next Question ──
  const handleNextQuestion = async () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setShowFeedback(false);
      setFeedback(null);
      setUserAnswer('');
      addBotMessage(questions[nextIndex]);
    } else {
      handleEndInterview();
    }
  };

  // ── End Interview ──
  const handleEndInterview = () => {
    if (onComplete) {
      onComplete({
        totalQuestions: currentQuestionIndex + 1,
        topic,
        timestamp: new Date()
      });
    }
    setInterviewStarted(false);
    setConversationHistory([]);
    setCurrentQuestionIndex(0);
  };

  // ── Skip Question ──
  const handleSkipQuestion = () => {
    addBotMessage("No problem! Let's move to the next question.");
    handleNextQuestion();
  };

  if (!interviewStarted) {
    return (
      <div className="mock-interview">
        <div className="interview-start">
          <div className="start-card">
            <h2>AI Mock Interview</h2>
            <p>Practice your interview skills with AI-powered feedback</p>
            <div className="start-info">
              <div className="info-item">
                <span className="icon">🎯</span>
                <span>Category: <strong>{topic}</strong></span>
              </div>
              <div className="info-item">
                <span className="icon">📝</span>
                <span>Questions: <strong>5</strong></span>
              </div>
              <div className="info-item">
                <span className="icon">⏱</span>
                <span>Duration: <strong>15-20 mins</strong></span>
              </div>
            </div>
            <button className="btn btn-primary" onClick={startInterview}>
              Start Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="mock-interview">
      <div className="interview-header">
        <h2>Interview Session</h2>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <span className="progress-text">Question {currentQuestionIndex + 1} of {questions.length}</span>
      </div>

      <div className="interview-container">
        {/* Chat Area */}
        <div className="chat-area">
          <div className="messages-container">
            {conversationHistory.map((msg, idx) => (
              <div key={idx} className={`message message-${msg.type}`}>
                <div className="message-avatar">
                  {msg.type === 'bot' ? '🤖' : '👤'}
                </div>
                <div className="message-content">
                  <p>{msg.message}</p>
                  <span className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Feedback Panel */}
          {showFeedback && feedback && (
            <div className="feedback-panel">
              <h3>Live Feedback</h3>
              <div className="score-container">
                <div className="score-item">
                  <div className="score-label">Confidence</div>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${feedback.confidenceScore}%` }}
                    />
                  </div>
                  <span className="score-value">{feedback.confidenceScore}%</span>
                </div>

                <div className="score-item">
                  <div className="score-label">Communication</div>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${feedback.communicationScore}%` }}
                    />
                  </div>
                  <span className="score-value">{feedback.communicationScore}%</span>
                </div>

                <div className="score-item">
                  <div className="score-label">Clarity</div>
                  <div className="score-bar">
                    <div 
                      className="score-fill" 
                      style={{ width: `${feedback.clarityScore}%` }}
                    />
                  </div>
                  <span className="score-value">{feedback.clarityScore}%</span>
                </div>
              </div>

              <div className="suggestions">
                <h4>Suggestions:</h4>
                {feedback.suggestions.map((suggestion, idx) => (
                  <p key={idx} className="suggestion-item">{suggestion}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="input-area">
          <form onSubmit={handleSubmitAnswer} className="answer-form">
            <textarea
              className="answer-input"
              placeholder="Type your answer here... (or use voice)"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={loading || showFeedback}
              rows="4"
            />
            <div className="input-footer">
              <span className="char-count">
                {userAnswer.length} characters
              </span>
              <div className="input-actions">
                {!showFeedback ? (
                  <>
                    <button 
                      type="submit" 
                      className="btn btn-primary" 
                      disabled={loading || !userAnswer.trim()}
                    >
                      {loading ? 'Analyzing...' : 'Submit Answer'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={handleSkipQuestion}
                      disabled={loading}
                    >
                      Skip
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-primary" 
                      onClick={handleNextQuestion}
                    >
                      {isLastQuestion ? 'End Interview' : 'Next Question'}
                    </button>
                  </>
                )}
                <button 
                  type="button" 
                  className="btn btn-danger" 
                  onClick={handleEndInterview}
                >
                  Exit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
