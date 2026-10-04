const {GoogleGenAI} = require('@google/genai')
const {z} = require('zod')
// const { resume } = require('./temp');



const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 to 100 indicating how well the candidates profile matches job.describe"),
    technicalQuestions: z.array(z.object({
        questions: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc..")
    })).describe("Technical questions that can be asked in the interview along with their intentions and how to answer them"),
    behavioralQuestions: z.array(z.object({
        questions: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc..")

    })).describe("Behavioral questions that can be asked in the interview along with their intentions and how to answer them"),
    skillGap: z.array(z.object({
        skill: z.string().describe("The skill in which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("List of tasks to be done on this and follow the preparation plan"),

    })).describe("List of skill gaps in the candidates profile along with their severity"),
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan strating from 1"),
        focus: z.string().describe("The main focus of this day in the prepartion plan e.g. data stuctures, system designs , mock interviews etc.. "),
        tasks: z.array(z.string()).describe("Lists of tasks to be done on this day e.g. read a specific book , or solve a question from DSA"),
    })).describe("A day-wise preparation plan to follow in order to prepare for the interview "),
    title: z.string().describe("The title of the job for which the interview report is generated")
})

const responseJsonSchema = z.toJSONSchema(interviewReportSchema)
delete responseJsonSchema.$schema

const generationModels = ["gemini-3.6-flash", "gemini-3.5-flash"]
const retryableStatuses = new Set([429, 500, 502, 503, 504])

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {
    if (!process.env.GOOGLE_GENAI_API_KEY) {
        const error = new Error("GOOGLE_GENAI_API_KEY is not configured")
        error.code = "AI_CONFIG_MISSING"
        throw error
    }

    const prompt = `
Generate an Interview Report for the candidate based on the information below.

RESUME:
${resume}

SELF DESCRIPTION:
${selfDescription}

JOB DESCRIPTION:
${jobDescription}

IMPORTANT INSTRUCTIONS:
- Return ONLY JSON matching the provided schema.
- Do not add any extra fields.
- Do not include candidate_name, position, recommendation, interview_score, overall_assessment, or any other fields not present in the schema.
- matchScore must be a number between 0 and 100.
- technicalQuestions should contain relevant technical interview questions based on the job description and candidate profile.
- behavioralQuestions should contain relevant behavioral interview questions.
- skillGap should identify skills missing or weak in the candidate profile.
- severity must be exactly one of: "low", "medium", or "high".
- preparationPlan should provide a practical day-wise preparation plan starting from day 1.
- technicalQuestions MUST be an array of objects.
- Every technicalQuestions object MUST contain exactly these fields:
  questions, intention, answer.
- behavioralQuestions MUST be an array of objects.
- Every behavioralQuestions object MUST contain exactly these fields:
  questions, intention, answer.
- skillGap MUST be an array of objects.
- Every skillGap object MUST contain exactly these fields:
  skill, severity.
- preparationPlan MUST be an array of objects.
- Every preparationPlan object MUST contain exactly these fields:
  day, focus, tasks.

Example structure:

technicalQuestions: [
  {
    "questions": "Explain JWT authentication.",
    "intention": "Test understanding of authentication.",
    "answer": "Explain token creation, signing, verification and expiration."
  }
]

behavioralQuestions: [
  {
    "questions": "Tell me about a challenging project.",
    "intention": "Evaluate problem-solving and teamwork.",
    "answer": "Use the STAR method and explain the situation, task, action and result."
  }
]

skillGap: [
  {
    "skill": "Cloud deployment",
    "severity": "medium"
  }
]

preparationPlan: [
  {
    "day": 1,
    "focus": "React",
    "tasks": [
      "Review React hooks",
      "Practice state management"
    ]
  }
]
`;

  try {
    let response
    for (let index = 0; index < generationModels.length; index += 1) {
        const model = generationModels[index]
        try {
            response = await ai.models.generateContent({
                model,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseJsonSchema
                }
            })
            break
        } catch (error) {
            const hasFallback = index < generationModels.length - 1
            if (!hasFallback || !retryableStatuses.has(error.status)) {
                throw error
            }

            console.warn(`Gemini model ${model} returned HTTP ${error.status}; trying fallback model.`)
        }
    }

    const report = interviewReportSchema.parse(
        JSON.parse(response.text)
    );

    return report;

} catch (error) {
    console.error("Error generating interview report:", error);
    throw error;
}}

module.exports = generateInterviewReport;
