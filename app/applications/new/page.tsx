"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/page-header";

type ResumeOption = {
  id: string;
  title: string;
  fileName: string;
};

export default function NewApplicationPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    company: "",
    title: "",
    description: "",
    link: "",
    notes: "",
    resumeId: "",
  });

  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResumes() {
      try {
        const res = await fetch("/api/resumes");
        const data = await res.json();
        setResumes(data.resumes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingResumes(false);
      }
    }

    loadResumes();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company: form.company,
          title: form.title,
          description: form.description,
          link: form.link,
          notes: form.notes,
          resumeId: form.resumeId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/applications");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="modern-page">
      <div className="modern-shell max-w-4xl">
        <PageHeader
          title="New Application"
          subtitle="Add a new job application to your board."
        />

        <form onSubmit={handleSubmit} className="modern-card section-box space-y-6">
          <div>
            <label className="label">Company Name</label>
            <input
              className="field"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Job Title</label>
            <input
              className="field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Select Resume</label>
            <select
              className="field"
              value={form.resumeId}
              onChange={(e) => setForm({ ...form, resumeId: e.target.value })}
              disabled={loadingResumes}
            >
              <option value="">No resume selected</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.title} — {resume.fileName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Job Link</label>
            <input
              className="field"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="label">Job Description</label>
            <textarea
              className="field min-h-[220px]"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              className="field min-h-[120px]"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          {error ? (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          ) : null}

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "Create Application"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/applications")}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}