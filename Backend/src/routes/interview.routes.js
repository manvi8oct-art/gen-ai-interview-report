const express = require('express')

const authMiddleware = require('../middleware/auth.middleware')
const interviewController = require('../controllers/interview.controller')
const upload = require('../middleware/file.middleware')

const interviewRouter = express.Router()


/**
 * @route POST /api/interview/
 * @description Generate an interview report
 * @access private
 */
interviewRouter.post(
    '/',
    authMiddleware.authUser,
    upload.single("resume"),
    interviewController.generateInterviewReportController
)


/**
 * @route GET /api/interview/report/:interviewId
 * @description Get a single interview report
 * @access private
 */
interviewRouter.get(
    '/report/:interviewId',
    authMiddleware.authUser,
    interviewController.getInterviewReportControllerById
)


/**
 * @route GET /api/interview/reports
 * @description Get all interview reports
 * @access private
 */
interviewRouter.get(
    '/reports',
    authMiddleware.authUser,
    interviewController.getInterviewReportsController
)


module.exports = interviewRouter