import DeleteApplicationButton from "@/components/delete-application-button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatusSelect from "@/components/status-select";
import AnalyzeButton from "@/components/analyze-button";
import PageHeader from "@/components/page-header";

const statuses = ["SAVED", "APPLIED", "INTERVIEW", "REJECTED", "OFFER"] as const;

export default async function ApplicationsPage() {
  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@applypilot.com" },
  });

  const applications = demoUser
    ? await prisma.application.findMany({
        where: { userId: demoUser.id },
        include: {
          jobPost: true,
          resume: true,
          analysis: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <main className="modern-page">
      <div className="modern-shell">
        <PageHeader
          title="Applications"
          subtitle="Manage your job applications in a Kanban-style workflow."
          right={
            <Link href="/applications/new" className="btn-primary">
              + New Application
            </Link>
          }
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {statuses.map((status) => {
            const items = applications.filter((app) => app.status === status);

            return (
              <div key={status} className="modern-card p-5">
                <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-slate-700">
                  {status}
                </h2>

                <div className="min-h-[420px] space-y-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                  {items.length === 0 ? (
                    <p className="text-sm text-slate-400">No applications yet.</p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
                      >
<div className="flex items-start justify-between gap-3">
  <div>
    <p className="text-lg font-extrabold leading-tight text-slate-900">
      {item.jobPost.title}
    </p>

    <p className="text-sm font-medium text-slate-600">
      {item.jobPost.company}
    </p>
  </div>

  <DeleteApplicationButton applicationId={item.id} />
</div>

                       {item.resume ? (
  <p className="text-sm font-medium text-teal-700">
    Resume: {item.resume.title}
  </p>
) : (
  <p className="text-sm text-slate-400">
    Resume: Not selected
  </p>
)}

                        <div className="mt-3">
                          <StatusSelect
                            applicationId={item.id}
                            currentStatus={item.status}
                          />
                        </div>

                        <AnalyzeButton applicationId={item.id} />

                       {item.analysis ? (
  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center justify-between">
      <p className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
        Match Analysis
      </p>
      <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-extrabold text-teal-700">
        {item.analysis.matchScore ?? 0}%
      </span>
    </div>

    <p className="mt-3 text-sm leading-6 text-slate-700">
      {item.analysis.summary}
    </p>

    <div className="mt-4">
      <p className="text-sm font-bold text-slate-800">Matched Skills</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {item.analysis.matchedSkills.length > 0 ? (
          item.analysis.matchedSkills.map((skill, index) => (
            <span
              key={index}
              className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-500">None</span>
        )}
      </div>
    </div>

    <div className="mt-4">
      <p className="text-sm font-bold text-slate-800">Missing Skills</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {item.analysis.missingSkills.length > 0 ? (
          item.analysis.missingSkills.map((skill, index) => (
            <span
              key={index}
              className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-sm text-slate-500">None</span>
        )}
      </div>
    </div>

    {item.analysis.aiSummary ? (
      <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50 p-4">
        <p className="text-sm font-extrabold uppercase tracking-wide text-teal-800">
          AI Summary
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">
          {item.analysis.aiSummary}
        </p>

        {item.analysis.improvementSuggestion ? (
          <div className="mt-4">
            <p className="text-sm font-bold text-slate-800">
              Improvement Suggestion
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              {item.analysis.improvementSuggestion}
            </p>
          </div>
        ) : null}

        {item.analysis.interviewFocus ? (
          <div className="mt-4">
            <p className="text-sm font-bold text-slate-800">
              Interview Focus
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-700">
              {item.analysis.interviewFocus}
            </p>
          </div>
        ) : null}
      </div>
    ) : null}
  </div>
) : null}
                        {item.notes ? (
  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
      Notes
    </p>
    <p className="mt-1 text-sm leading-6 text-slate-600">
      {item.notes}
    </p>
  </div>
) : null}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}