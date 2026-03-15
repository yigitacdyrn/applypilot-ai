type AnalysisOutput = {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
};

const SKILLS = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c#",
  "c++",
  "react",
  "next.js",
  "vue",
  "node.js",
  "express",
  "fastapi",
  "html",
  "css",
  "tailwind",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "prisma",
  "git",
  "github",
  "docker",
  "rest api",
  "api",
  "oop",
  "object-oriented programming",
  "machine learning",
  "ai",
  "data structures",
  "algorithms",
];

function normalize(text: string) {
  return text.toLowerCase();
}

function extractSkills(text: string) {
  const normalized = normalize(text);
  return SKILLS.filter((skill) => normalized.includes(skill));
}

export function analyzeResumeMatch(
  resumeText: string,
  jobDescription: string
): AnalysisOutput {
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescription);

  const matchedSkills = jobSkills.filter((skill) => resumeSkills.includes(skill));
  const missingSkills = jobSkills.filter((skill) => !resumeSkills.includes(skill));

  const matchScore =
    jobSkills.length === 0
      ? 0
      : Math.round((matchedSkills.length / jobSkills.length) * 100);

  let summary = "";

  if (jobSkills.length === 0) {
    summary =
      "No recognizable target skills were detected in the job description.";
  } else if (matchScore >= 75) {
    summary =
      "Strong match. Your resume covers most of the key skills mentioned in the job description.";
  } else if (matchScore >= 40) {
    summary =
      "Moderate match. Your resume aligns with some important requirements, but several skills are still missing.";
  } else {
    summary =
      "Low match. Your resume does not yet reflect many of the main skills requested in the job description.";
  }

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    summary,
  };
}