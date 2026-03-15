import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { analyzeResumeMatch } from "../../../../../lib/analizer";

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

    const analysis = application.analysis
      ? await prisma.analysisResult.update({
          where: { applicationId: application.id },
          data: {
            matchScore: result.matchScore,
            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills,
            summary: result.summary,
          },
        })
      : await prisma.analysisResult.create({
          data: {
            applicationId: application.id,
            matchScore: result.matchScore,
            matchedSkills: result.matchedSkills,
            missingSkills: result.missingSkills,
            summary: result.summary,
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