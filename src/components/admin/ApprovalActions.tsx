"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Approve / reject buttons for a pending post. Approving publishes it; rejecting
 * sends it back to the contributor as a draft. Both hit the section's PATCH
 * endpoint, which already restricts publishing to admins.
 */
export default function ApprovalActions({
  section,
  id,
}: {
  section: "articles" | "media";
  id: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState<null | "approve" | "reject">(null);

  async function act(action: "approve" | "reject") {
    setPending(action);
    try {
      const res = await fetch(`/api/admin/${section}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: action === "approve" ? "PUBLISHED" : "DRAFT",
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      router.refresh();
    } catch (error) {
      console.error("Approval action failed:", error);
      setPending(null);
    }
  }

  return (
    <div className="flex shrink-0 gap-2">
      <button
        type="button"
        onClick={() => act("approve")}
        disabled={pending !== null}
        className="btn-editorial btn-editorial-sm disabled:opacity-50"
      >
        {pending === "approve" ? "Approving…" : "Approve"}
      </button>
      <button
        type="button"
        onClick={() => act("reject")}
        disabled={pending !== null}
        className="rounded-full border border-[var(--line)] px-4 py-1.5 text-sm font-bold text-[var(--muted)] transition-colors hover:text-[var(--press-red)] disabled:opacity-50"
      >
        {pending === "reject" ? "…" : "Reject"}
      </button>
    </div>
  );
}
