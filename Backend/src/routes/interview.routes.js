const express = require('express');
const {authUser} = require("../middlewares/auth.middlewares");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middlewares");


const interviewRouter = express.Router();


/**
 * @route POST /api/interview
 * @description Generate a new interview Report basis on the provided data and resume
 * @access Private
 */

// In interview.routes.js, comment out authUser temporarily
interviewRouter.post(
    "/",
    // authUser,        // 👈 comment this out
    upload.single("resume"),
    interviewController.generateInterviewReportController
);


module.exports = interviewRouter;