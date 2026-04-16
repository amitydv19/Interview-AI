const pdfParse = require("pdf-parse");
const generateInterviewReportService = require("../services/ai.services");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const resumeContent = await pdfParse(req.file.buffer);  // ✅ works now
        const resumeText = resumeContent.text;

        const { selfDescription, jobDescription } = req.body;

        const interviewReportByAi = await generateInterviewReportService({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfdescribe: selfDescription,
            jobdescribe: jobDescription,
            ...interviewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { generateInterviewReportController };