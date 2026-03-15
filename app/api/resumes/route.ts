import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { extractText, getDocumentProxy } from "unpdf";

export async function GET() {
  try {
    const demoUser = await prisma.user.findUnique({
      where: { email: "demo@applypilot.com" },
    });

    if (!demoUser) {
      return NextResponse.json({ resumes: [] });
    }

    const resumes = await prisma.resume.findMany({
      where: { userId: demoUser.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("GET /api/resumes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const demoUser = await prisma.user.findUnique({
      where: { email: "demo@applypilot.com" },
    });

    if (!demoUser) {
      return NextResponse.json(
        { error: "Demo user not found." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const title = formData.get("title")?.toString() || "";
    const file = formData.get("file") as File | null;

    if (!title || !file) {
      return NextResponse.json(
        { error: "Title and file are required." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const safeFileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadsDir, safeFileName);

    fs.writeFileSync(filePath, buffer);

    let extractedText = "";

    try {
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const result = await extractText(pdf, { mergePages: true });
      extractedText = typeof result.text === "string" ? result.text : "";
    } catch (parseError) {
      console.error("PDF extraction failed:", parseError);
      extractedText = "";
    }

    const resume = await prisma.resume.create({
      data: {
        title,
        fileName: file.name,
        fileUrl: `/uploads/${safeFileName}`,
        extractedText,
        userId: demoUser.id,
      },
    });

    return NextResponse.json({
      success: true,
      resume,
      extracted: extractedText.length > 0,
    });
  } catch (error) {
    console.error("POST /api/resumes error:", error);
    return NextResponse.json(
      { error: "Failed to upload resume." },
      { status: 500 }
    );
  }
}