# AI Mock Interview Module

A comprehensive AI-powered mock interview system for the Interview-AI MERN application. This module provides interview simulation, ATS resume analysis, and performance tracking capabilities.

## 📁 Project Structure

```
mockInterview/
├── components/              # React components
│   ├── MockInterview.jsx    # Chat-based interview interface
│   ├── ATSAnalyzer.jsx      # ATS score calculator
│   ├── PerformanceDashboard.jsx  # Performance metrics & analytics
│   └── index.js             # Component exports
├── services/                # Business logic & API calls
│   ├── aiService.js         # Mock AI interview engine
│   └── index.js             # Service exports
├── utils/                   # Utility functions
│   ├── scoring.js           # Scoring & analysis algorithms
│   └── index.js             # Utility exports
├── styles/                  # SCSS styling
│   ├── mockInterview.scss   # Interview component styles
│   ├── atsAnalyzer.scss     # ATS analyzer styles
│   └── dashboard.scss       # Dashboard styles
└── README.md               # This file
```

## 🎯 Components

### MockInterview
Interactive chat-based interview simulation with real-time AI feedback.

**Props:**
- `topic` (string): Interview category - "behavioral", "technical", "general" (default: "behavioral")
- `onComplete` (function): Callback when interview ends

**Features:**
- 5-question interview flow
- Real-time answer analysis
- Confidence, communication, and clarity scoring
- Live feedback panel
- Skip and exit options
- Auto-scrolling message area
- Character counter

**Usage:**
```jsx
import { MockInterview } from '../features/mockInterview/components';

<MockInterview 
  topic="behavioral" 
  onComplete={(data) => console.log(data)} 
/>
```

### ATSAnalyzer
Resume vs job description ATS (Applicant Tracking System) analyzer.

**Features:**
- Resume upload (TXT files)
- Job description input
- ATS score (0-100)
- Matched keywords highlighting
- Missing keywords list
- Actionable suggestions
- Match rate statistics

**Usage:**
```jsx
import { ATSAnalyzer } from '../features/mockInterview/components';

<ATSAnalyzer />
```

### PerformanceDashboard
Analytics dashboard for tracking interview performance over time.

**Props:**
- `performances` (array): Array of performance objects with feedback data

**Features:**
- Average score metric
- Total interviews counter
- Progress trend indicator
- Best performance tracking
- Score progress chart
- Performance by topic breakdown
- Weak areas identification
- Strength areas display
- Personalized recommendations
- Summary statistics

**Usage:**
```jsx
import { PerformanceDashboard } from '../features/mockInterview/components';

<PerformanceDashboard performances={performanceHistory} />
```

## 🔧 Services

### aiService.js
Mock AI engine for interview simulation and analysis.

**Functions:**

#### `getInterviewQuestion(category, questionId)`
Retrieves interview question by category.

```javascript
const question = await getInterviewQuestion('behavioral', 0);
// Returns: { id, category, question, followUps[], difficulty }
```

#### `getAIFeedback(question, userAnswer, category)`
Analyzes answer and provides feedback.

```javascript
const feedback = await getAIFeedback(question, answer, 'behavioral');
// Returns: { strengths[], improvements[], score, followUpQuestion }
```

#### `analyzeResumeWithAI(resumeText, jobDescription)`
Performs ATS analysis on resume.

```javascript
const analysis = await analyzeResumeWithAI(resume, jobDesc);
// Returns: { score, matchedKeywords[], missingKeywords[], improvements[] }
```

#### `generateInterviewSummary(answers)`
Creates summary of completed interview.

```javascript
const summary = await generateInterviewSummary(answers);
// Returns: { totalQuestions, averageScore, recommendations[], areasToImprove[] }
```

## 📊 Utilities

### scoring.js
Scoring algorithms and analysis functions.

**Functions:**

#### `calculateATSScore(resume, jobDescription)`
Calculates ATS compatibility score.

```javascript
const result = calculateATSScore(resumeText, jobDesc);
// Returns: { score, matchedKeywords[], missingKeywords[], suggestions[] }
```

#### `analyzeAnswerFeedback(userAnswer)`
Analyzes interview answer quality.

```javascript
const feedback = analyzeAnswerFeedback(answer);
// Returns: { 
//   confidenceScore, 
//   communicationScore, 
//   clarityScore, 
//   overallScore, 
//   suggestions[] 
// }
```

#### `calculatePerformanceMetrics(answers)`
Computes performance statistics.

```javascript
const metrics = calculatePerformanceMetrics(answers);
// Returns: { 
//   averageScore, 
//   weakAreas[], 
//   strongAreas[], 
//   totalAttempts, 
//   progressTrend 
// }
```

#### `generateMockQuestions(topic)`
Generates mock interview questions by category.

```javascript
const questions = generateMockQuestions('behavioral');
// Returns: Array of question objects
```

## 🎨 Styling

All components use SCSS with:
- **Glassmorphism effects** (blur, transparency)
- **Color scheme**: Purple accent (#a78bfa), warm accent (#fb923c)
- **Dark theme**: Deep background (#07080d)
- **Smooth animations**: Fade, slide, bar chart transitions
- **Responsive design**: Mobile-first approach with grid layouts

### Color Variables
```scss
$accent: #a78bfa;           // Purple
$accent-warm: #fb923c;      // Orange
$success: #34d399;          // Green
$warning: #f59e0b;          // Yellow
$danger: #ef4444;           // Red
```

## 🚀 Integration Example

```jsx
import React, { useState } from 'react';
import { 
  MockInterview, 
  ATSAnalyzer, 
  PerformanceDashboard 
} from '../features/mockInterview/components';

function InterviewHub() {
  const [activeTab, setActiveTab] = useState('interview');
  const [performances, setPerformances] = useState([]);

  const handleInterviewComplete = (data) => {
    setPerformances([...performances, data]);
    setActiveTab('dashboard');
  };

  return (
    <div className="interview-hub">
      {activeTab === 'interview' && (
        <MockInterview 
          topic="behavioral" 
          onComplete={handleInterviewComplete} 
        />
      )}
      
      {activeTab === 'ats' && (
        <ATSAnalyzer />
      )}
      
      {activeTab === 'dashboard' && (
        <PerformanceDashboard performances={performances} />
      )}

      <nav className="tabs">
        <button onClick={() => setActiveTab('interview')}>Interview</button>
        <button onClick={() => setActiveTab('ats')}>ATS Analyzer</button>
        <button onClick={() => setActiveTab('dashboard')}>Dashboard</button>
      </nav>
    </div>
  );
}

export default InterviewHub;
```

## 🔄 Data Flow

```
MockInterview
├── Calls: generateMockQuestions() → generates 5 questions
├── On Answer: analyzeAnswerFeedback() → real-time scoring
├── On Complete: onComplete callback → send data to dashboard
└── Feedback Panel: Shows confidence/communication/clarity scores

ATSAnalyzer
├── User Input: Resume + Job Description
├── Calls: calculateATSScore() → analyzes match
└── Display: Score, keywords, suggestions

PerformanceDashboard
├── Input: Array of past performances
├── Calls: calculatePerformanceMetrics() → aggregates data
├── Display: Charts, trends, recommendations
└── Analyzes: Weak areas, strong areas, progress
```

## 🔐 Future Enhancements

1. **Real AI Integration**
   - Replace mock with OpenAI/Gemini API
   - Voice input/output capabilities
   - Sentiment analysis for emotional intelligence scoring

2. **Advanced Analytics**
   - Spaced repetition recommendations
   - Interview difficulty progression
   - Comparison with industry benchmarks

3. **Social Features**
   - Share performance results
   - Compare with peers
   - Group interview sessions

4. **Export Features**
   - PDF report generation
   - Resume optimization suggestions
   - Interview transcript export

## 📝 Notes

- All AI responses are mocked with 600-1200ms delays to simulate API latency
- MockInterview generates 5 random questions per category
- ATS scoring uses keyword extraction from resume and job description
- Performance metrics track improvement trends over multiple interviews
- All styling uses SCSS with responsive breakpoints at 1024px

## 🐛 Troubleshooting

**MockInterview not showing feedback:**
- Ensure answer is at least 10 characters
- Check that showFeedback state is true after submission

**ATSAnalyzer not calculating score:**
- Verify both resume and job description are provided
- Clear cache if results seem outdated

**Dashboard showing no data:**
- Ensure PerformanceDashboard receives performances prop with valid data
- Check that data includes feedback property with scores

---

**Last Updated:** 2024
**Status:** Production Ready ✓
