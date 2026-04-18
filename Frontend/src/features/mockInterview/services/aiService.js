/**
 * AI Service
 * Mock AI responses for interview simulation
 * Can be replaced with actual OpenAI/Gemini API calls
 */

// Mock interview questions and follow-ups
const questionDatabase = {
  behavioral: {
    1: {
      question: "Tell me about yourself",
      followUps: [
        "What interested you most about this role?",
        "How do your previous experiences relate to this position?"
      ]
    },
    2: {
      question: "Describe a challenging situation you've handled",
      followUps: [
        "What would you do differently if you faced the same situation again?",
        "How did your team benefit from your actions?"
      ]
    },
    3: {
      question: "What are your greatest strengths?",
      followUps: [
        "Can you give a specific example of using this strength?",
        "How will this strength help in this role?"
      ]
    }
  },
  technical: {
    1: {
      question: "Explain the concept of promises in JavaScript",
      followUps: [
        "What's the difference between promises and async/await?",
        "How do you handle promise rejections?"
      ]
    },
    2: {
      question: "What is the Virtual DOM in React?",
      followUps: [
        "How does React reconciliation work?",
        "Why is the Virtual DOM beneficial for performance?"
      ]
    },
    3: {
      question: "Explain the MVC/MVVM architecture",
      followUps: [
        "How does this compare to other architectural patterns?",
        "When would you choose this pattern?"
      ]
    }
  }
};

// ── Get Question ──
export const getInterviewQuestion = async (category = 'behavioral', questionId = 1) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));

    const categoryQuestions = questionDatabase[category];
    if (!categoryQuestions) {
      return { error: "Invalid category" };
    }

    const questionData = categoryQuestions[questionId];
    if (!questionData) {
      return { error: "Question not found" };
    }

    return {
      success: true,
      data: {
        id: questionId,
        category,
        question: questionData.question,
        followUps: questionData.followUps,
        difficulty: ["beginner", "intermediate", "advanced"][Math.floor(Math.random() * 3)]
      }
    };
  } catch (error) {
    return { error: error.message };
  }
};

// ── Get AI Feedback on Answer ──
export const getAIFeedback = async (question, userAnswer, category = 'behavioral') => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const feedback = {
      success: true,
      data: {
        strengths: generateStrengths(userAnswer),
        improvements: generateImprovements(userAnswer),
        score: generateScore(userAnswer),
        followUpQuestion: generateFollowUp(category)
      }
    };

    return feedback;
  } catch (error) {
    return { error: error.message };
  }
};

// ── Generate Next Question ──
export const getNextQuestion = async (category = 'behavioral', currentId = 1) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 600));

    const nextId = Math.min(currentId + 1, 3);
    return await getInterviewQuestion(category, nextId);
  } catch (error) {
    return { error: error.message };
  }
};

// ── AI Resume Analysis ──
export const analyzeResumeWithAI = async (resumeText, jobDescription) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1200));

    const keywords = extractKeywords(jobDescription);
    const matchedKeywords = findMatchedKeywords(resumeText, keywords);
    const missingKeywords = keywords.filter(k => !matchedKeywords.includes(k));

    return {
      success: true,
      data: {
        score: Math.round((matchedKeywords.length / keywords.length) * 100),
        matchedKeywords: matchedKeywords.slice(0, 15),
        missingKeywords: missingKeywords.slice(0, 10),
        improvements: generateResumeImprovements(resumeText, missingKeywords),
        atsScore: Math.round((matchedKeywords.length / keywords.length) * 100)
      }
    };
  } catch (error) {
    return { error: error.message };
  }
};

// ── Generate Interview Summary ──
export const generateInterviewSummary = async (answers) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const avgScore = Math.round(
      answers.reduce((sum, a) => sum + (a.score || 0), 0) / answers.length
    );

    return {
      success: true,
      data: {
        totalQuestions: answers.length,
        averageScore: avgScore,
        recommendations: generateRecommendations(avgScore),
        areasToImprove: getAreasToImprove(answers),
        strengths: getInterviewStrengths(answers)
      }
    };
  } catch (error) {
    return { error: error.message };
  }
};

// ── Helper Functions ──

const generateStrengths = (answer) => {
  const strengths = [];
  const answerLength = answer.split(/\s+/).length;

  if (answerLength > 50) strengths.push("Provided detailed and comprehensive response");
  if (answer.includes("example") || answer.includes("for instance")) strengths.push("Good use of concrete examples");
  if (answer.split(/[.!?]+/).length > 2) strengths.push("Well-structured answer with clear points");
  if (!answer.toLowerCase().includes("um") && !answer.toLowerCase().includes("uh")) strengths.push("Clear communication without filler words");

  return strengths.length > 0 ? strengths : ["Answer demonstrates thought process"];
};

const generateImprovements = (answer) => {
  const improvements = [];
  const answerLength = answer.split(/\s+/).length;

  if (answerLength < 30) improvements.push("Provide more detailed responses with examples");
  if (answerLength > 200) improvements.push("Try to be more concise while maintaining depth");
  if (!answer.includes("?")) improvements.push("Consider asking clarifying questions");
  if (answer.toLowerCase().includes("um") || answer.toLowerCase().includes("uh")) improvements.push("Avoid filler words");

  return improvements.length > 0 ? improvements : ["Overall good, continue practicing"];
};

const generateScore = (answer) => {
  let score = 70;
  const answerLength = answer.split(/\s+/).length;

  if (answerLength > 40 && answerLength < 150) score += 20;
  if (answer.includes("example")) score += 5;
  if (answer.split(/[.!?]+/).length > 2) score += 5;

  return Math.min(100, score);
};

const generateFollowUp = (category) => {
  const followUps = {
    behavioral: "How did this experience shape your approach to similar situations?",
    technical: "How would you optimize this solution further?",
    default: "Can you elaborate on your previous point?"
  };

  return followUps[category] || followUps.default;
};

const extractKeywords = (text) => {
  return text
    .toLowerCase()
    .match(/\b[a-z]{4,}\b/g)
    ?.filter((v, i, a) => a.indexOf(v) === i) || [];
};

const findMatchedKeywords = (resume, keywords) => {
  const resumeLower = resume.toLowerCase();
  return keywords.filter(keyword => resumeLower.includes(keyword));
};

const generateResumeImprovements = (resume, missingKeywords) => {
  const improvements = [];

  if (missingKeywords.length > 5) {
    improvements.push(`Add ${missingKeywords.length} more relevant keywords`);
  }
  if (resume.length < 500) {
    improvements.push("Add more details about your achievements and projects");
  }
  if (!resume.toLowerCase().includes("metrics") && !resume.toLowerCase().includes("result")) {
    improvements.push("Include quantifiable metrics and results");
  }
  if (!resume.toLowerCase().includes("certificate") && !resume.toLowerCase().includes("certified")) {
    improvements.push("Add relevant certifications and credentials");
  }

  return improvements;
};

const generateRecommendations = (score) => {
  if (score >= 90) return ["Excellent! Keep practicing to maintain your performance"];
  if (score >= 80) return ["Good performance. Focus on depth and examples"];
  if (score >= 70) return ["Decent performance. Practice more structured answers"];
  return ["Keep practicing! Focus on clarity and structured responses"];
};

const getAreasToImprove = (answers) => {
  const lowScoreAnswers = answers.filter(a => (a.score || 0) < 70);
  return lowScoreAnswers.map(a => a.topic || "General Communication").slice(0, 3);
};

const getInterviewStrengths = (answers) => {
  const highScoreAnswers = answers.filter(a => (a.score || 0) >= 80);
  return highScoreAnswers.map(a => a.topic || "Communication").slice(0, 3);
};

export default {
  getInterviewQuestion,
  getAIFeedback,
  getNextQuestion,
  analyzeResumeWithAI,
  generateInterviewSummary
};
