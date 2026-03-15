import Link from "next/link";

export default function HomePage() {
  return (
    <main className="modern-page text-slate-900">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="modern-card w-full max-w-4xl p-12">
          <p className="mb-4 text-sm font-extrabold uppercase tracking-[0.25em] text-teal-700">
            ApplyPilot AI
          </p>

          <h1 className="mb-5 text-5xl font-black tracking-tight text-slate-900">
            Job Application Tracker + CV Match Analyzer
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600">
            Track applications, manage resumes, analyze job descriptions,
            and build a stronger job search workflow through a clean modern dashboard.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>

            <Link href="/applications" className="btn-secondary">
              View Applications
            </Link>

            <Link href="/resumes" className="btn-secondary">
              Manage Resumes
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}