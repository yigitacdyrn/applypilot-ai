import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { company, title, description, link, notes, resumeId } = body;

    if (!company || !title || !description) {
      return NextResponse.json(
        { error: "Company, title, and description are required." },
        { status: 400 }
      );
    }

    const demoUser = await prisma.user.findUnique({
      where: {
        email: "demo@applypilot.com",
      },
    });

    if (!demoUser) {
      return NextResponse.json(
        { error: "Demo user not found. Please run seed first." },
        { status: 500 }
      );
    }

    if (resumeId) {
      const resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId: demoUser.id,
        },
      });

      if (!resume) {
        return NextResponse.json(
          { error: "Selected resume not found." },
          { status: 400 }
        );
      }
    }

    const jobPost = await prisma.jobPost.create({
      data: {
        company,
        title,
        description,
        link: link || null,
        userId: demoUser.id,
      },
    });

    const application = await prisma.application.create({
      data: {
        notes: notes || null,
        userId: demoUser.id,
        jobPostId: jobPost.id,
        resumeId: resumeId || null,
        status: "SAVED",
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json(
      { error: "Failed to create application." },
      { status: 500 }
    );
  }
}