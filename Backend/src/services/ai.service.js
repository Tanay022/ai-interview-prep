const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// ---------- Retry + fallback helper ----------

// Models ko order mein likho: pehla model pehle try hoga,
// agar wo busy ho to agla try hoga.
// Exact ID Google AI Studio ki model list se check kar lena.
const MODELS = [
    "gemini-3.7-flash",
    "gemini-3.5-flash",
];

const RETRYABLE_STATUS = [429, 500, 503, 504];
const ATTEMPTS_PER_MODEL = 3;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateWithFallback({ contents, config }) {
    let lastError;

    for (const model of MODELS) {
        for (let attempt = 1; attempt <= ATTEMPTS_PER_MODEL; attempt++) {
            try {
                const response = await ai.models.generateContent({
                    model,
                    contents,
                    config
                });
                return JSON.parse(response.text);
            } catch (error) {
                lastError = error;
                const status = Number(error?.status ?? error?.code);

                // Agar error busy/overload wala nahi hai (jaise galat key), to retry mat karo
                if (!RETRYABLE_STATUS.includes(status)) {
                    throw error;
                }

                if (attempt < ATTEMPTS_PER_MODEL) {
                    const delay = 2000 * 2 ** (attempt - 1) + Math.random() * 1000; // ~2s, ~4s
                    console.log(`${model} busy (${status}). Retry ${attempt} in ${Math.round(delay / 1000)}s...`);
                    await sleep(delay);
                } else {
                    console.log(`${model} abhi bhi fail ho raha hai. Next model try kar rahe hain...`);
                }
            }
        }
    }

    throw lastError;
}

// ---------- Interview report ----------

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("This technical questions can be asked in interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question,What point to cover,What approach to take etc..")
    })).describe("Technical Questions that can be asked in the interview along with the intention and how to answer them"),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("This behavioral question can be asked in interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question,What point to cover,What approach to take etc..")
    })).describe("Behavioural Questions that can be asked in the interview along with the intention and how to answer them"),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skills which the candidate is lacking"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),

    title: z.string().describe("The title of the job for which the interview report is generated"),
});

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
        Resume: ${resume}
        Self Description: ${selfDescription}
        Job Description: ${jobDescription}

        Generate:
        - minimum 10 technical questions
        - minimum 10 behavioral questions
        - minimum 6 skill gaps
        - exactly 7 preparation days
        - minimum 4 tasks for every preparation day
    `;

    return generateWithFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(interviewReportSchema)
        }
    });
}

// ---------- Resume PDF ----------

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
    });

    try {
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            margin: {
                top: "20mm",
                bottom: "20mm",
                left: "15mm",
                right: "15mm"
            }
        });

        return pdfBuffer;
    } finally {
        await browser.close();
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    });

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                        IMPORTANT:
- Do not use fixed heights or min-height for resume sections.
- Do not use justify-content: space-between.
- Do not add large margins or padding between sections.
- Keep all resume content in normal document flow without unnecessary blank spaces.
- Do not force page breaks between resume sections.
                    `;

    const jsonContent = await generateWithFallback({
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseJsonSchema: z.toJSONSchema(resumePdfSchema)
        }
    });

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };


