const mongoose = require("mongoose");


const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type:String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required"]
    }
},{
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type:String,
        required: [true, "Technical question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [ true, "Answer is required"]
    }
},{
    _id: false
})

const skillGapsSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    }
},{
    _id: false
})

const prepationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required:[true, "Focus is required"]
    },
    tasks: {
        type: String,
        required: [true, "Task is required"]
    }
})

const interviewReportSchema = new mongoose.Schema({
    jobdescribe: {
        type: String,
        required: [true, "Job describe is required"]
    },
    resume: {
        type: String,
        default: ''
    },
    selfdescribe: {
        type: String,
        default: ''
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
    },

    technicalQuestion: [technicalQuestionSchema],
    behavioralQuestion: [behavioralQuestionSchema],
    skillGaps: [String],
    prepationPlan: [String],
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    }
},{
    timestamps: true
})


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema)

module.exports = interviewReportModel;