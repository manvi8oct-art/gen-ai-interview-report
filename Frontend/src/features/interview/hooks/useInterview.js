import {generateInterviewReport, getAllInterviewReports, getInterviewReportById} from '../services/interview.api'
import {useCallback, useContext} from 'react'
import {InterviewContext} from '../interview.context'


//custom hook to handle interview report generation and fetching
export const useInterview = () => {
    const context = useContext(InterviewContext)
    if (!context) {
        throw new Error('useInterview must be used within an InterviewProvider')
    }
    const {loading, setLoading, report, setReport, reports, setReports} = context;

    const generateReport = async (resumeFile, selfDescription, jobDescription) => {
        setLoading(true)
        let response = null
        try {
            response = await generateInterviewReport({resumeFile, selfDescription, jobDescription})
            setReport(response.interviewReport)
            return response
        } catch (error) {
            console.error('Error generating interview report:', error)
            throw error
        } finally {
            setLoading(false)
        }
        return response.interviewReport
}

const getReportById = useCallback(async (interviewId) => {
    setLoading(true)
    try {
        const response = await getInterviewReportById(interviewId)
        setReport(response.interviewReport)
        return response
    } catch (error) {
        console.error('Error fetching interview report by ID:', error)
        throw error
    } finally {
        setLoading(false)
    }
}, [setLoading, setReport])
const getAllReports = useCallback(async () => {
    try {
        const response = await getAllInterviewReports()
        setReports(response.interviewReports)
        return response
    } catch (error) {
        console.error('Error fetching all interview reports:', error)
        throw error
    }
}, [setReports])

return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getAllReports
}
}
