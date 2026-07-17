"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Action = "approve" | "changes" | "reject";
const STATUS = { approve: "PUBLISHED", changes: "DRAFT", reject: "ARCHIVED" } as const;

export default function ApprovalActions({ section, id }: { section: "articles" | "media"; id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState<Action | null>(null);
  const [error, setError] = useState("");
  async function act(action: Action) {
    setPending(action);
    setError("");
    const response = await fetch(`/api/admin/${section}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: STATUS[action] }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Review action failed");
      setPending(null);
      return;
    }
    router.refresh();
  }
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
      <button type="button" onClick={() => act("approve")} disabled={pending !== null} className="btn-editorial btn-editorial-sm disabled:opacity-50">
        {pending === "approve" ? "Approving…" : "Approve"}
      </button>
      <button type="button" onClick={() => act("changes")} disabled={pending !== null} className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm font-bold text-[var(--muted)] disabled:opacity-50">Request changes</button>
      <button type="button" onClick={() => act("reject")} disabled={pending !== null} className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm font-bold text-[var(--press-red)] disabled:opacity-50">Reject</button>
      {error && <span className="w-full text-right text-xs text-[var(--press-red)]">{error}</span>}
    </div>
  );
}
