"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TeamRowActions({
  id,
  pending,
}: {
  id: string;
  pending: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"resend" | "delete" | null>(null);
  const [error, setError] = useState("");

  async function handleResend() {
    setLoading("resend");
    setError("");
    try {
      const res = await fetch(`/api/admin/team/${id}/resend`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to resend invite");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to resend invite");
    } finally {
      setLoading(null);
    }
  }

  async function handleDelete() {
    if (!confirm("Remove this team member? This cannot be undone.")) return;
    setLoading("delete");
    setError("");
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to remove team member");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to remove team member");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-3">
        <Link
          href={`/admin/team/${id}/edit`}
          className="text-sm font-bold text-[var(--press-red)] hover:underline"
        >
          Edit
        </Link>
        {pending && (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading !== null}
            className="text-sm font-bold text-[var(--muted)] transition-colors hover:text-[var(--press-red)] disabled:opacity-50"
          >
            {loading === "resend" ? "Resending…" : "Resend"}
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading !== null}
          className="text-sm font-bold text-[var(--muted)] transition-colors hover:text-[var(--press-red)] disabled:opacity-50"
        >
          {loading === "delete" ? "Removing…" : "Remove"}
        </button>
      </div>
      {error && <span className="text-xs text-[var(--press-red)]">{error}</span>}
    </div>
  );
}
