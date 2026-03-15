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

        <div className="grid gap-5 lg:grid-cols-5">
          {statuses.map((status) => {
            const items = applications.filter((app) => app.status === status);

            return (
              <div key={status} className="modern-card p-4">
                <h2 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-slate-700">
                  {status}
                </h2>

                <div className="min-h-[320px] space-y-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                  {items.length === 0 ? (
                    <p className="text-sm text-slate-400">No applications yet.</p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                      >
                        <p className="text-lg font-extrabold text-slate-900">
                          {item.jobPost.title}
                        </p>

                        <p className="text-base text-slate-600">
                          {item.jobPost.company}
                        </p>

                        {item.resume ? (
                          <p className="mt-1 text-sm text-teal-700 font-medium">
                            Resume: {item.resume.title}
                          </p>
                        ) : (
                          <p className="mt-1 text-sm text-slate-400">
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
                          <div className="mt-4 rounded-2xl bg-slate-50 p-3 text-sm">
                            <p className="font-extrabold text-slate-800">
                              Match Score: {item.analysis.matchScore ?? 0}%
                            </p>

                            <p className="mt-2 text-slate-600">
                              {item.analysis.summary}
                            </p>

                            <div className="mt-3">
                              <p className="font-bold text-slate-700">
                                Matched Skills:
                              </p>
                              <p className="text-slate-600">
                                {item.analysis.matchedSkills.length > 0
                                  ? item.analysis.matchedSkills.join(", ")
                                  : "None"}
                              </p>
                            </div>

                            <div className="mt-3">
                              <p className="font-bold text-slate-700">
                                Missing Skills:
                              </p>
                              <p className="text-slate-600">
                                {item.analysis.missingSkills.length > 0
                                  ? item.analysis.missingSkills.join(", ")
                                  : "None"}
                              </p>
                            </div>
                          </div>
                        ) : null}

                        {item.notes ? (
                          <p className="mt-4 text-sm text-slate-500">
                            {item.notes}
                          </p>
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