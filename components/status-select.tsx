"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = "SAVED" | "APPLIED" | "INTERVIEW" | "REJECTED" | "OFFER";

export default function StatusSelect({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: Status;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: Status) {
    setStatus(newStatus);
    setLoading(true);

    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      setStatus(currentStatus);
      alert("Status update failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <select
      value={status}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value as Status)}
      className="field py-3 text-sm font-semibold"
    >
      <option value="SAVED">SAVED</option>
      <option value="APPLIED">APPLIED</option>
      <option value="INTERVIEW">INTERVIEW</option>
      <option value="REJECTED">REJECTED</option>
      <option value="OFFER">OFFER</option>
    </select>
  );
}