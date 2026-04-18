/**
 * Scoring Utility Functions
 * Handles ATS score calculation, feedback analysis, and performance metrics
 */

// ── ATS Score Calculator ──
export const calculateATSScore = (resume, jobDescription) => {
  if (!resume || !jobDescription) return { score: 0, keywords: [], suggestions: [] };

  const resumeText = resume.toLowerCase();
  const jobDescText = jobDescription.toLowerCase();

  // Extract keywords from job description
  const keywordRegex = /\b[a-z]+\b/g;
  const jobKeywords = jobDescText.match(keywordRegex) || [];
  const uniqueKeywords = [...new Set(jobKeywords)];

  // Find matching keywords in resume
  const matchedKeywords = uniqueKeywords.filter(keyword => 
    resumeText.includes(keyword) && keyword.length > 3
  );

  // Calculate score (0-100)
  const score = Math.min(100, Math.round((matchedKeywords.length / Math.max(uniqueKeywords.length, 1)) * 100));

  // Find missing keywords
  const missingKeywords = uniqueKeywords
    .filter(keyword => !resumeText.includes(keyword) && keyword.length > 3)
    .slice(0, 10);

  // Generate suggestions
  const suggestions = generateATSSuggestions(score, missingKeywords.length);

  return {
    score,
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 10),
    totalKeywords: uniqueKeywords.filter(k => k.length > 3).length,
    suggestions
  };
};

// ── Generate ATS Suggestions ──
const generateATSSuggestions = (score, missingCount) => {
  const suggestions = [];

  if (score < 50) {
    suggestions.push("Add more relevant keywords from the job description");
    suggestions.push("Include technical skills and certifications mentioned in the JD");
  } else if (score < 75) {
    suggestions.push("Add more industry-specific terminology");
    suggestions.push("Include measurable achievements and metrics");
  } else if (score < 90) {
    suggestions.push("Consider adding keywords you might have overlooked");
    suggestions.push("Format your resume for better ATS readability");
  } else {
    suggestions.push("Great match! Your resume is well-aligned with the job description");
  }

  if (missingCount > 5) {
    suggestions.push(`Add ${missingCount} more relevant keywords to improve ATS score`);
  }

  return suggestions;
};

// ── Calculate Answer Feedback ──
export const analyzeAnswerFeedback = (userAnswer) => {
  if (!userAnswer) {
    return {
      confidenceScore: 0,
      communicationScore: 0,
      clarityScore: 0,
      suggestions: ["Please provide an answer to get feedback"]
    };
  }

  const answerLength = userAnswer.trim().split(/\s+/).length;
  const sentences = userAnswer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

  // Confidence Score (based on answer length and structure)
  let confidenceScore = Math.min(100, answerLength * 2);
  if (answerLength < 30) confidenceScore = Math.max(0, confidenceScore - 30);
  if (answerLength > 150) confidenceScore = 90;

  // Communication Score (based on sentence structure)
  const avgWordsPerSentence = sentences > 0 ? answerLength / sentences : 0;
  let communicationScore = 50;
  if (avgWordsPerSentence > 10 && avgWordsPerSentence < 25) {
    communicationScore = 85;
  } else if (avgWordsPerSentence >= 25) {
    communicationScore = 65; // Too long sentences
  } else if (avgWordsPerSentence < 5) {
    communicationScore = 60; // Too short sentences
  }

  // Clarity Score (based on punctuation and sentence count)
  let clarityScore = 70;
  if (sentences >= 2) clarityScore += 15;
  if (sentences >= 4) clarityScore += 10;
  clarityScore = Math.min(100, clarityScore);

  const suggestions = generateAnswerSuggestions(
    confidenceScore,
    communicationScore,
    clarityScore,
    answerLength,
    userAnswer
  );

  return {
    confidenceScore: Math.round(confidenceScore),
    communicationScore: Math.round(communicationScore),
    clarityScore: Math.round(clarityScore),
    overallScore: Math.round((confidenceScore + communicationScore + clarityScore) / 3),
    answerLength,
    sentenceCount: sentences,
    suggestions
  };
};

// ── Generate Answer Suggestions ──
const generateAnswerSuggestions = (confidence, communication, clarity, length, answer) => {
  const suggestions = [];

  if (length < 20) {
    suggestions.push("⚠ Answer is too short. Provide more details and examples");
  } else if (length > 200) {
    suggestions.push("⚠ Answer is quite long. Try to be more concise while maintaining clarity");
  }

  if (confidence < 60) {
    suggestions.push("💡 Try to provide more structured and detailed responses");
  }

  if (communication < 70) {
    suggestions.push("💡 Vary your sentence structure for better clarity");
  }

  if (clarity < 70) {
    suggestions.push("💡 Use punctuation marks (. ! ?) to separate ideas clearly");
  }

  // Check for filler words
  const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'literally', 'actually'];
  const hasFillerWords = fillerWords.some(word => answer.toLowerCase().includes(word));
  if (hasFillerWords) {
    suggestions.push("💡 Avoid filler words like 'um', 'uh', 'like' etc");
  }

  if (suggestions.length === 0) {
    suggestions.push("✓ Great answer! Clear, concise, and well-structured");
  }

  return suggestions;
};

// ── Calculate Overall Performance ──
export const calculatePerformanceMetrics = (answers) => {
  if (!answers || answers.length === 0) {
    return {
      averageScore: 0,
      weakAreas: [],
      strongAreas: [],
      totalAttempts: 0
    };
  }

  const scores = answers.map(a => a.feedback?.overallScore || 0);
  const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  // Identify weak and strong areas based on topic scores
  const weakAreas = answers
    .filter(a => (a.feedback?.overallScore || 0) < 60)
    .map(a => a.topic)
    .slice(0, 3);

  const strongAreas = answers
    .filter(a => (a.feedback?.overallScore || 0) >= 80)
    .map(a => a.topic)
    .slice(0, 3);

  return {
    averageScore,
    weakAreas,
    strongAreas,
    totalAttempts: answers.length,
    progressTrend: calculateProgressTrend(scores)
  };
};

// ── Calculate Progress Trend ──
const calculateProgressTrend = (scores) => {
  if (scores.length < 2) return "neutral";
  
  const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
  const secondHalf = scores.slice(Math.floor(scores.length / 2));
  
  const avgFirstHalf = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const avgSecondHalf = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

  if (avgSecondHalf > avgFirstHalf + 5) return "improving";
  if (avgSecondHalf < avgFirstHalf - 5) return "declining";
  return "stable";
};

// ── Generate Mock Questions ──
export const generateMockQuestions = (topic = 'general') => {
  const questionBank = {
    general: [
      "Tell me about yourself",
      "What are your strengths?",
      "What is your weakness?",
      "Why do you want to join our company?",
      "What are your career goals?"
    ],
    technical: [
      "Explain the difference between REST and GraphQL",
      "What is the difference between var, let, and const?",
      "How does event delegation work in JavaScript?",
      "What are the benefits of using React hooks?",
      "Explain the concept of closure in JavaScript"
    ],
    behavioral: [
      "Tell me about a time you faced a challenge",
      "How do you handle team conflicts?",
      "Describe a project you're proud of",
      "How do you prioritize your work?",
      "Tell me about a time you learned something new"
    ]
  };

  return questionBank[topic] || questionBank.general;
};

export default {
  calculateATSScore,
  analyzeAnswerFeedback,
  calculatePerformanceMetrics,
  generateMockQuestions
};
