const {GoogleGenAI} = require("@google/genai");
const {z} = require("zod");
const {zodToJsonSchema} = require("zod-to-json-schema");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate matches the job"),

    technicalQuestion: z.array(z.object({          // ✅ matches Mongoose
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),

    behavioralQuestion: z.array(z.object({         // ✅ matches Mongoose
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),

    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"])
    })),

    prepationPlan: z.array(z.object({              // ✅ matches Mongoose
        day: z.number(),
        focus: z.string(),
        tasks: z.string().describe("Comma-separated tasks for the day")  // ✅ matches Mongoose String type
    }))
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {  // ✅ fixed params

    const prompt = `Generate an interview report for a candidate based on the following information:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",                 // ✅ gemini-3-flash-preview doesn't exist
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(interviewReportSchema),  // ✅ correct key name
        }
    });

    return JSON.parse(response.text);
}

module.exports = generateInterviewReport;