import Link from "next/link";

export default function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="modern-topbar">
      <div>
        <div className="mb-3 flex items-center gap-3">
          <Link href="/" className="btn-secondary">
            ← Home
          </Link>
        </div>

        <h1 className="modern-title">{title}</h1>
        <p className="modern-subtitle">{subtitle}</p>
      </div>

      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}