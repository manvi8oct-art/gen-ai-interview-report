const mongoose = require('mongoose')

/**
 * - job description schema: String
 * - resume text: String
 * - self description: String
 * 
 * --matchScore: Number
 * - Technical questions: [{
 *             questions: "",
 *             intentions: "",
 *             answer: ""       
 * }]
* - Behavioral questions: [{
*              questions: "",
 *             intentions: "",
 *             answer: "" 
* }]
* 
* 
 * - SKill gaps: [{
 *           skill: "",
 *           severity: "",
 *           enum: ["low" , "med", "high"]
 * 
 * 
 * }]
 * - Preparation plans: [{
 *          day: Number,
 *          focus: String,
 *          tasks: [String]
 * 
 * }]
 * 
 */
const technicalQuestionsSchema = new mongoose.Schema({
    questions: {
        type: String,
        required: [true, "technical questions are required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answers is required"]
    }
}, {
    _id: false
})

const behavioralQuestionsSchema = new mongoose.Schema({
    questions: {
        type: String,
        required: [true, "Behavioral questions is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answers is required"]
    }
}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
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

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "Task is required"]

    }],
})

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "job description is required"]
    },
    resume: {
        type: String
    },
    selfDescription: {
        type: String
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100
    },
    technicalQuestions: [technicalQuestionsSchema],
    behavioralQuestions: [behavioralQuestionsSchema],
    skillGap: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"

    },
    title: {
        type: String,
        required: [true, "Title is required"]
    }
},{
    timestamps: true
})

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;