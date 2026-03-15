"use client";

import { useState } from "react";
import PageHeader from "@/components/page-header";

type ResumeItem = {
  id: string;
  title: string;
  fileName: string;
  extractedText?: string | null;
  createdAt: string;
};

export default function ResumesPage() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resumes, setResumes] = useState<ResumeItem[]>([]);

  async function fetchResumes() {
    const res = await fetch("/api/resumes");
    const data = await res.json();
    setResumes(data.resumes || []);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (!file) {
      setMessage("Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    setLoading(true);

    try {
      const res = await fetch("/api/resumes", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setMessage("Resume uploaded successfully.");
      setTitle("");
      setFile(null);

      const input = document.getElementById("resume-file") as HTMLInputElement | null;
      if (input) input.value = "";

      await fetchResumes();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleLoadResumes() {
    await fetchResumes();
  }

  return (
    <main className="modern-page">
      <div className="modern-shell max-w-5xl">
        <PageHeader
          title="Resumes"
          subtitle="Upload your CV in PDF format and extract its text for analysis."
        />

        <form onSubmit={handleUpload} className="modern-card section-box mb-8 space-y-6">
          <div>
            <label className="label">Resume Title</label>
            <input
              className="field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Software Intern CV"
              required
            />
          </div>

          <div>
            <label className="label">PDF File</label>
            <input
              id="resume-file"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="field"
              required
            />
          </div>

          {message ? (
            <p className="text-sm font-semibold text-slate-700">{message}</p>
          ) : null}

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Uploading..." : "Upload Resume"}
            </button>

            <button
              type="button"
              onClick={handleLoadResumes}
              className="btn-secondary"
            >
              Refresh List
            </button>
          </div>
        </form>

        <div className="modern-card section-box">
          <h2 className="mb-4 text-2xl font-extrabold text-slate-900">
            Uploaded Resumes
          </h2>

          {resumes.length === 0 ? (
            <p className="text-sm text-slate-500">No resumes uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <p className="text-lg font-extrabold text-slate-900">
                    {resume.title}
                  </p>
                  <p className="text-sm text-slate-600">{resume.fileName}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Uploaded: {new Date(resume.createdAt).toLocaleString()}
                  </p>

                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-bold text-teal-700">
                      View extracted text
                    </summary>
                    <pre className="mt-3 max-h-64 overflow-auto rounded-2xl bg-slate-50 p-4 text-xs whitespace-pre-wrap text-slate-700">
                      {resume.extractedText || "No text extracted."}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}