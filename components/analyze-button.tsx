"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AnalyzeButton({
  applicationId,
}: {
  applicationId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAnalyze() {
    setLoading(true);

    try {
      const res = await fetch(`/api/applications/${applicationId}/analyze`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAnalyze}
      disabled={loading}
      className="btn-danger mt-4"
    >
      {loading ? "Analyzing..." : "Analyze Match"}
    </button>
  );
}