const { GoogleGenerativeAI } = require("@google/generative-ai");
const { z } = require("zod");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY);

const interviewReportSchema = z.object({
    matchScore: z.number().min(0).max(100).describe("A score between 0 and 100 indicating how well the candidate matches the job"),

    technicalQuestion: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })).describe("Array of technical interview questions"),

    behavioralQuestion: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })).describe("Array of behavioral interview questions"),

    skillGaps: z.array(z.string()).describe("Array of skill gaps identified"),

    prepationPlan: z.array(z.string()).describe("Array of preparation plan items")
});

// Mock data generator for when API quota is exceeded
function generateMockReport({ resume, selfDescription, jobDescription }) {
    console.log("🔄 API Quota exceeded - Using mock data for demo");
    
    // Extract some keywords from job description for personalization
    const jobKeywords = jobDescription.toLowerCase().split(/\s+/).filter(word => word.length > 4).slice(0, 3);
    
    return {
        matchScore: Math.floor(Math.random() * 30) + 65, // 65-95
        technicalQuestion: [
            {
                question: `Explain your experience with the key technologies mentioned in the "${jobKeywords[0] || 'project'}" domain.`,
                intention: "Assess technical depth and practical experience",
                answer: "Provide specific examples of projects where you've used these technologies, challenges faced, and solutions implemented."
            },
            {
                question: "Walk me through your approach to debugging a complex production issue.",
                intention: "Evaluate problem-solving methodology and attention to detail",
                answer: "Explain your systematic approach: identify symptoms, check logs, narrow down scope, implement fix, test, and monitor."
            },
            {
                question: "How do you stay updated with the latest developments in your field?",
                intention: "Assess commitment to continuous learning",
                answer: "Mention specific resources: blogs, courses, conferences, open-source contributions, and how you apply new knowledge."
            },
            {
                question: "Tell me about a time you optimized code or system performance.",
                intention: "Evaluate optimization and performance awareness",
                answer: "Share a specific example with metrics: what was slow, how you identified the issue, what changes you made, and the measurable improvement."
            }
        ],
        behavioralQuestion: [
            {
                question: "Describe a situation where you had to work with a difficult team member.",
                intention: "Assess communication and conflict resolution skills",
                answer: "Use STAR method: Situation (context), Task (your role), Action (what you did), Result (outcome). Focus on how you maintained professionalism."
            },
            {
                question: "Tell me about your biggest failure and what you learned from it.",
                intention: "Evaluate self-awareness and learning mindset",
                answer: "Be honest about a real failure, explain what went wrong, what you learned, and how you've applied those lessons since."
            },
            {
                question: "How do you prioritize when you have multiple urgent tasks?",
                intention: "Assess time management and decision-making",
                answer: "Explain your framework: assess impact, dependencies, deadlines, delegate if possible, and communicate changes to stakeholders."
            }
        ],
        skillGaps: [
            "Advanced system design patterns",
            "Cloud infrastructure (AWS/GCP/Azure)",
            "API design best practices",
            "Performance optimization techniques",
            "Container orchestration (Kubernetes)"
        ],
        prepationPlan: [
            "Day 1-2: Review core concepts in your primary tech stack. Build one small project to refresh knowledge.",
            "Day 3-4: Practice behavioral questions using STAR method. Record yourself answering and review.",
            "Day 5: Do a mock technical interview with a friend or online platform. Practice explaining solutions clearly.",
            "Day 6: Research the company thoroughly. Prepare thoughtful questions to ask interviewers.",
            "Day 7: Rest, review your answers one more time, prepare professional outfit, and get good sleep."
        ]
    };
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an expert interview coach and technical recruiter. Analyze the following information and generate a comprehensive interview preparation report.

CANDIDATE INFORMATION:
${resume ? `Resume:\n${resume}` : 'No resume provided'}

${selfDescription ? `Self Description:\n${selfDescription}` : 'No self description provided'}

TARGET JOB DESCRIPTION:
${jobDescription}

Based on the above information, provide a JSON response with:
1. matchScore: A number 0-100 showing how well the candidate matches the job
2. technicalQuestion: Array with 3-5 objects, each with "question", "intention", and "answer" fields
3. behavioralQuestion: Array with 2-3 objects, each with "question", "intention", and "answer" fields
4. skillGaps: Array of skill gaps the candidate should address
5. prepationPlan: Array of 5 preparation plan items with specific actionable steps

Respond with ONLY valid JSON, no markdown formatting.`;

    let lastError;
    const maxRetries = 2;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            
            const result = await model.generateContent(prompt);
            
            console.log("✅ AI Response received successfully");
            
            const text = result.response.text();
            
            // Try to extract JSON from response
            let jsonString = text;
            
            // If response contains markdown code blocks, extract JSON
            if (text.includes('```json')) {
                jsonString = text.split('```json')[1].split('```')[0].trim();
            } else if (text.includes('```')) {
                jsonString = text.split('```')[1].split('```')[0].trim();
            }
            
            // Parse and validate the JSON response
            let parsedResponse = JSON.parse(jsonString);
            
            // Ensure arrays exist and have proper structure
            if (!Array.isArray(parsedResponse.technicalQuestion)) {
                parsedResponse.technicalQuestion = [];
            }
            if (!Array.isArray(parsedResponse.behavioralQuestion)) {
                parsedResponse.behavioralQuestion = [];
            }
            if (!Array.isArray(parsedResponse.skillGaps)) {
                parsedResponse.skillGaps = [];
            }
            if (!Array.isArray(parsedResponse.prepationPlan)) {
                parsedResponse.prepationPlan = [];
            }

            // Ensure matchScore is a number
            parsedResponse.matchScore = parseInt(parsedResponse.matchScore) || 50;

            console.log("✅ Successfully generated interview report via AI");
            return parsedResponse;
            
        } catch (error) {
            lastError = error;
            
            // Check if it's a quota error
            const isQuotaError = error.message?.includes('quota') || 
                               error.message?.includes('RESOURCE_EXHAUSTED') ||
                               error.message?.includes('429') ||
                               error.message?.includes('rate') ||
                               error.message?.includes('Quota exceeded');
            
            console.error(`Attempt ${attempt + 1}/${maxRetries} failed:`, error.message);
            
            if (isQuotaError) {
                if (attempt < maxRetries - 1) {
                    console.log(`⏳ Quota exceeded. Retrying immediately...`);
                    continue;
                } else {
                    // Last attempt failed with quota - use mock data
                    console.warn("⚠️ Google Gemini API quota exceeded. Using mock data instead.");
                    return generateMockReport({ resume, selfDescription, jobDescription });
                }
            }
            
            // If not quota error, throw immediately
            throw error;
        }
    }
}

module.exports = generateInterviewReport;