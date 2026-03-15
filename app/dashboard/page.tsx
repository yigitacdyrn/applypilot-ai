import Link from "next/link";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/page-header";

export default async function DashboardPage() {
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

  const totalApplications = applications.length;
  const interviews = applications.filter((a) => a.status === "INTERVIEW").length;
  const offers = applications.filter((a) => a.status === "OFFER").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;
  const saved = applications.filter((a) => a.status === "SAVED").length;
  const applied = applications.filter((a) => a.status === "APPLIED").length;

  const analyzed = applications.filter((a) => a.analysis?.matchScore !== null);
  const averageMatchScore =
    analyzed.length > 0
      ? Math.round(
          analyzed.reduce((sum, app) => sum + (app.analysis?.matchScore ?? 0), 0) /
            analyzed.length
        )
      : 0;

  const withResume = applications.filter((a) => a.resumeId !== null).length;
  const withoutResume = applications.filter((a) => a.resumeId === null).length;

  const topMatches = [...applications]
    .filter((a) => a.analysis?.matchScore !== null)
    .sort((a, b) => (b.analysis?.matchScore ?? 0) - (a.analysis?.matchScore ?? 0))
    .slice(0, 5);

  const recentApplications = applications.slice(0, 5);

  return (
    <main className="modern-page">
      <div className="modern-shell">
        <PageHeader
          title="Dashboard"
          subtitle="Overview of your applications, resumes, and analysis results."
          right={
            <div className="flex gap-3">
              <Link href="/applications/new" className="btn-primary">
                + New Application
              </Link>
              <Link href="/resumes" className="btn-secondary">
                Resumes
              </Link>
            </div>
          }
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="modern-card section-box">
            <p className="text-sm font-semibold text-slate-500">Total Applications</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900">
              {totalApplications}
            </h2>
          </div>

          <div className="modern-card section-box">
            <p className="text-sm font-semibold text-slate-500">Interviews</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900">
              {interviews}
            </h2>
          </div>

          <div className="modern-card section-box">
            <p className="text-sm font-semibold text-slate-500">Offers</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900">
              {offers}
            </h2>
          </div>

          <div className="modern-card section-box">
            <p className="text-sm font-semibold text-slate-500">Average Match Score</p>
            <h2 className="mt-3 text-4xl font-black text-slate-900">
              {averageMatchScore}%
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="modern-card section-box xl:col-span-2">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Recent Applications
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Your latest job applications and their current states.
            </p>

            <div className="mt-5 space-y-4">
              {recentApplications.length === 0 ? (
                <p className="text-sm text-slate-500">No applications yet.</p>
              ) : (
                recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-extrabold text-slate-900">
                          {app.jobPost.title}
                        </p>
                        <p className="text-sm text-slate-600">
                          {app.jobPost.company}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Status: {app.status}
                        </p>
                      </div>

                      {app.analysis ? (
                        <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-800">
                          {app.analysis.matchScore ?? 0}%
                        </div>
                      ) : (
                        <div className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-400">
                          N/A
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {app.resume ? (
                        <span className="rounded-full bg-teal-50 px-3 py-1 font-semibold text-teal-700">
                          Resume: {app.resume.title}
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-500">
                          No resume linked
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="modern-card section-box">
            <h3 className="text-2xl font-extrabold text-slate-900">Status Summary</h3>
            <p className="mt-1 text-sm text-slate-500">
              Quick overview of your current application pipeline.
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-700">Saved</span>
                <span className="text-lg font-black text-slate-900">{saved}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-700">Applied</span>
                <span className="text-lg font-black text-slate-900">{applied}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-700">Interview</span>
                <span className="text-lg font-black text-slate-900">{interviews}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-700">Rejected</span>
                <span className="text-lg font-black text-slate-900">{rejected}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="font-semibold text-slate-700">Offers</span>
                <span className="text-lg font-black text-slate-900">{offers}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          <div className="modern-card section-box">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Top Match Applications
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Applications with the strongest score based on your current analyzer.
            </p>

            <div className="mt-5 space-y-4">
              {topMatches.length === 0 ? (
                <p className="text-sm text-slate-500">No analyzed applications yet.</p>
              ) : (
                topMatches.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <div>
                      <p className="font-extrabold text-slate-900">
                        {app.jobPost.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        {app.jobPost.company}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-teal-50 px-4 py-2 text-lg font-black text-teal-700">
                      {app.analysis?.matchScore ?? 0}%
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="modern-card section-box">
            <h3 className="text-2xl font-extrabold text-slate-900">
              Resume Coverage
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              How many applications are linked to a resume.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-500">With Resume</p>
                <h4 className="mt-3 text-4xl font-black text-slate-900">
                  {withResume}
                </h4>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-500">Without Resume</p>
                <h4 className="mt-3 text-4xl font-black text-slate-900">
                  {withoutResume}
                </h4>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-600">
                Tip: linking a resume to each application makes the match analyzer more useful
                and gives you a more realistic dashboard score.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}