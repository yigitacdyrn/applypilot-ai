import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

type AISummaryResult = {
  summary: string;
  improvementSuggestion: string;
  interviewFocus: string;
};

export async function generateAISummary(params: {
  jobTitle: string;
  company: string;
  jobDescription: string;
  resumeText: string;
  matchedSkills: string[];
  missingSkills: string[];
  matchScore: number;
}): Promise<AISummaryResult> {
  const {
    jobTitle,
    company,
    jobDescription,
    resumeText,
    matchedSkills,
    missingSkills,
    matchScore,
  } = params;

  const prompt = `
You are a professional career assistant.

Analyze the fit between the resume and the job posting.

Return ONLY valid JSON with this exact shape:
{
  "summary": "short professional evaluation",
  "improvementSuggestion": "1 concise improvement suggestion",
  "interviewFocus": "1 concise interview preparation suggestion"
}

Context:
Job Title: ${jobTitle}
Company: ${company}
Match Score: ${matchScore}

Matched Skills:
${matchedSkills.join(", ") || "None"}

Missing Skills:
${missingSkills.join(", ") || "None"}

Job Description:
${jobDescription}

Resume Text:
${resumeText}

Rules:
- Keep each value concise.
- Be specific and professional.
- Do not use markdown.
- Do not write anything outside JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text ?? "";

  try {
    const parsed = JSON.parse(text) as AISummaryResult;

    return {
      summary: parsed.summary || "No summary generated.",
      improvementSuggestion:
        parsed.improvementSuggestion ||
        "Highlight missing technical skills more clearly.",
      interviewFocus:
        parsed.interviewFocus ||
        "Be ready to explain your technical decisions and project work.",
    };
  } catch {
    return {
      summary: text || "AI summary could not be parsed.",
      improvementSuggestion:
        "Highlight missing technical skills more clearly.",
      interviewFocus:
        "Be ready to explain your technical decisions and project work.",
    };
  }
}