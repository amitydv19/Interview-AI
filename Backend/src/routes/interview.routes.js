const express = require('express');
const {authUser} = require("../middlewares/auth.middlewares");
const interviewController = require("../controllers/interview.controller");
const upload = require("../middlewares/file.middlewares");


const interviewRouter = express.Router();


/**
 * @route GET /api/interview/:interviewId
 * @description Get interview by ID
 * @access Private
 */
interviewRouter.get(
    "/:interviewId",
    authUser,
    interviewController.getInterviewByIdController
);

/**
 * @route POST /api/interview
 * @description Generate a new interview Report basis on the provided data and resume
 * @access Private
 */

interviewRouter.post(
    "/",
    authUser,
    upload.single("resume"),
    interviewController.generateInterviewReportController
);


module.exports = interviewRouter;