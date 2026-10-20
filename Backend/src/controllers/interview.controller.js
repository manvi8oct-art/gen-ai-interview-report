
const { CanvasFactory } = require("pdf-parse/worker");
const { PDFParse } = require("pdf-parse");


const {generateInterviewReport, generateResumePdf} = require('../services/ai.service')
const interviewReportModel = require('../models/interviewReport.model')


/**
 * @description This controller is responsible for generating an interview report based on the user's resume
 */
async function generateInterviewReportController(req, res) {

    const { selfDescription, jobDescription } = req.body

    if (!jobDescription?.trim()) {
        return res.status(400).json({
            message: "Job description is required"
        })
    }

    if (!req.file && !selfDescription?.trim()) {
        return res.status(400).json({
            message: "Upload a PDF resume or enter a self-description"
        })
    }

    if (req.file && req.file.mimetype !== "application/pdf") {
        return res.status(400).json({
            message: "Only PDF resumes are supported"
        })
    }

    let resumeContent = { text: "" }
    if (req.file) {
        let pdfParser
        try {
            pdfParser = new PDFParse({
    data: new Uint8Array(req.file.buffer),
    CanvasFactory
});
            resumeContent = await pdfParser.getText()
        } catch (error) {
            console.error("Error parsing uploaded resume:", error)
            return res.status(400).json({
                message: "The uploaded PDF could not be read. Try a valid, text-readable PDF or enter a self-description."
            })
        } finally {
            if (pdfParser) {
                await pdfParser.destroy()
            }
        }
    }

    let generatedReport
    try {
        generatedReport = await generateInterviewReport({
            resume: resumeContent.text,
            selfDescription,
            jobDescription
        })
    } catch (error) {
        console.error("Error generating interview report:", error)
        const configurationError = error.code === "AI_CONFIG_MISSING"
        const providerStatus = Number(error.status)
        const providerUnavailable = [429, 500, 502, 503, 504].includes(providerStatus)
        const responseStatus = configurationError ? 503 : providerUnavailable ? 503 : 502

        return res.status(responseStatus).json({
            message: configurationError
                ? "Interview report generation is not configured. Set GOOGLE_GENAI_API_KEY in the backend environment."
                : providerUnavailable
                    ? "The AI service is temporarily busy or unavailable. Please try again in a minute."
                    : Number.isInteger(providerStatus) && providerStatus >= 400
                        ? `Gemini rejected the report request (HTTP ${providerStatus}). Check the backend logs for details.`
                        : "The AI service could not generate the interview report. Check the backend logs for details."
        })
    }

    let interviewReport
    try {
        interviewReport = await interviewReportModel.create({
            user: req.user.id,
            resume: resumeContent.text,
            selfDescription,
            jobDescription,
            ...generatedReport
        })
    } catch (error) {
        console.error("Error saving interview report:", error)
        return res.status(500).json({
            message: "The report was generated but could not be saved. Please try again."
        })
    }

    res.status(201).json({
        message: "Interview Report generated successfully",
        interviewReport
    })
}


/**
 * @description This controller is responsible for fetching a single interview report
 */
async function getInterviewReportControllerById(req, res) {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({
        user: req.user.id,
        _id: interviewId
    })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview Report not found"
        })
    }

    res.status(200).json({
        message: "Interview Report fetched successfully",
        interviewReport
    })
}


/**
 * @description This controller is responsible for fetching all interview reports
 */
async function getInterviewReportsController(req, res) {

    const interviewReports = await interviewReportModel
        .find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview Reports fetched successfully",
        interviewReports
    })
}

/**
 * @description This controller is responsible for generating a PDF version of the interview report
 */
async function generateResumePdfController(req, res) {

    const { interviewReportId } = req.params

    const interviewReport = await interviewReportModel.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview Report not found"
        })
    }
    const {resume , selfDescription, jobDescription} = interviewReport
    let pdfBuffer
    try {
        pdfBuffer = await generateResumePdf({resume, selfDescription, jobDescription})
    } catch (error) {
        console.error("Error generating interview report PDF:", error)
        const configurationError = error.code === "AI_CONFIG_MISSING"
        const providerStatus = Number(error.status)
        const providerUnavailable = [429, 500, 502, 503, 504].includes(providerStatus)
        const responseStatus = configurationError ? 503 : providerUnavailable ? 503 : 502

        return res.status(responseStatus).json({
            message: configurationError
                ? "PDF generation is not configured. Set GOOGLE_GENAI_API_KEY in the backend environment."
                : providerUnavailable
                    ? "The AI service is temporarily busy or unavailable. Please try again in a minute."
                    : Number.isInteger(providerStatus) && providerStatus >= 400
                        ? `Gemini rejected the PDF request (HTTP ${providerStatus}). Check the backend logs for details.`
                        : "The PDF could not be generated. Check the backend logs for details."
        })
    }

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=interview_report_${interviewReportId}.pdf`)
    res.send(pdfBuffer)


}
 


module.exports = {
    generateInterviewReportController,
    getInterviewReportControllerById,
    getInterviewReportsController,
    generateResumePdfController
}