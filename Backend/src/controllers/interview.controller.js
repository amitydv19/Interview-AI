const pdfParse = require("pdf-parse");
const generateInterviewReportService = require("../services/ai.services");
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;

        // Validation: require job description
        if (!jobDescription || jobDescription.trim() === '') {
            return res.status(400).json({ error: "Job description is required" });
        }

        // Validation: require either resume or self-description
        if (!req.file && (!selfDescription || selfDescription.trim() === '')) {
            return res.status(400).json({ error: "Either a resume file or self-description is required" });
        }

        let resumeText = '';
        
        // Parse resume if provided
        if (req.file) {
            try {
                const resumeContent = await pdfParse(req.file.buffer);
                resumeText = resumeContent.text;
            } catch (pdfError) {
                return res.status(400).json({ error: "Failed to parse PDF. Please upload a valid PDF file." });
            }
        }

        // Generate interview report using AI
        const interviewReportByAi = await generateInterviewReportService({
            resume: resumeText,
            selfDescription: selfDescription || '',
            jobDescription
        });

        // Create interview report in database
        const interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeText,
            selfdescribe: selfDescription || '',
            jobdescribe: jobDescription,
            ...interviewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        });

    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ error: error.message || "Failed to generate interview report" });
    }
}

async function getInterviewByIdController(req, res) {
    try {
        const { interviewId } = req.params;

        if (!interviewId) {
            return res.status(400).json({ error: "Interview ID is required" });
        }

        const interview = await interviewReportModel.findById(interviewId);

        if (!interview) {
            return res.status(404).json({ error: "Interview not found" });
        }

        // Check if user owns this interview
        if (interview.user.toString() !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        res.status(200).json(interview);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { generateInterviewReportController, getInterviewByIdController };