import axios from "axios";

const api = axios.create({
    baseURL: "https://gen-ai-interview-report-pn3j-i5hn9nv0f-manvi-79a8.vercel.app",
    withCredentials: true
});

//to handle apis like get and generate interview reports

/**
 * 
 * @description This function is responsible for generating an interview report
 */
export const generateInterviewReport = async ({
    resumeFile,
    selfDescription,
    jobDescription
}) => {
    const formData = new FormData();

    if (resumeFile) {
        formData.append("resume", resumeFile);
    }

    formData.append("selfDescription", selfDescription);
    formData.append("jobDescription", jobDescription);

    const response = await api.post("/api/interview/", formData, {
        withCredentials: true
    });

    return response.data;
};

/**
 * 
* @description This function is responsible for fetching a single interview report
 */
export const getInterviewReportById = async(interviewId) => {
    const response = await  api.get(`/api/interview/report/${interviewId}`);
    return response.data;
}

/**
 * @description This function is responsible for fetching all interview reports
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/reports");
    return response.data;
}


/**
 * 
 * @description service to generate resume pdf based on user self description, job description and resume file
 */
export const generateResumePdf = async ({interviewReportId}) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: 'blob' // Important: Set the response type to 'blob' to handle binary data
    });
 
    return response.data;
}