import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { analyzeResumeMatch } from "../../../../../lib/analizer";
import { generateAISummary } from "../../../../../lib/gemini";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        jobPost: true,
        resume: true,
        analysis: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    if (!application.resume || !application.resume.extractedText) {
      return NextResponse.json(
        { error: "No usable resume text found for this application." },
        { status: 400 }
      );
    }

    const result = analyzeResumeMatch(
      application.resume.extractedText,
      application.jobPost.description
    );

    const aiResult = await generateAISummary({
      jobTitle: application.jobPost.title,
      company: application.jobPost.company,
      jobDescription: application.jobPost.description,
      resumeText: application.resume.extractedText,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
      matchScore: result.matchScore,
    });

    const analysis = application.analysis
      ? await prisma.analysisResult.update({
          where: { applicationId: application.id },
          data: {
            matchScore: result.matchScore,
            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills,
            summary: result.summary,
            aiSummary: aiResult.summary,
            improvementSuggestion: aiResult.improvementSuggestion,
            interviewFocus: aiResult.interviewFocus,
          },
        })
      : await prisma.analysisResult.create({
          data: {
            applicationId: application.id,
            matchScore: result.matchScore,
            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills,
            summary: result.summary,
            aiSummary: aiResult.summary,
            improvementSuggestion: aiResult.improvementSuggestion,
            interviewFocus: aiResult.interviewFocus,
          },
        });

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("POST /api/applications/[id]/analyze error:", error);
    return NextResponse.json(
      { error: "Failed to analyze application." },
      { status: 500 }
    );
  }
}