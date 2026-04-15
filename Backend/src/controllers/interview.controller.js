const pdfParse = require("pdf-parse");
const generateInterviewReportService = require("../services/ai.services"); // renamed for clarity
const interviewReportModel = require("../models/interviewReport.model");

async function generateInterviewReportController(req, res) {
    console.log("req.user:", req.user);        // 👈 add this
    console.log("req.cookies:", req.cookies);  // 👈 add this
    
    const resumeContent = await(new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
    const {selfDescription, jobDescription} = req.body;

    const interviewReportByAi = await generateInterviewReportService({  // fixed: use correct import name
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    });

    const interviewReport = await interviewReportModel.create({
    user: req.user.id,  // ✅ handles both _id and id
    resume: resumeContent.text,
    selfdescribe: selfDescription,
    jobdescribe: jobDescription,
    ...interviewReportByAi
});

    res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    });
}

module.exports = { generateInterviewReportController };  // export matches the function name