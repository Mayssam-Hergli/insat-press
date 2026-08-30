"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteMediaButton({ id }: { id: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return (
    <span>
      <button
        type="button"
        disabled={pending}
        className="text-[var(--muted)] transition-colors hover:text-[var(--press-red)] disabled:opacity-50"
        onClick={async () => {
          if (!window.confirm("Delete this media coverage, its cover, and all gallery images?")) return;
          setPending(true);
          setError("");
          const response = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
          const data = await response.json().catch(() => ({}));
          if (!response.ok && !data.deleted) {
            setError(data.error || "Delete failed");
            setPending(false);
            return;
          }
          if (data.cleanupPending) window.alert(data.error);
          router.refresh();
        }}
      >
        {pending ? "Deleting…" : "Delete"}
      </button>
      {error && <span className="ml-2 text-xs text-[var(--press-red)]">{error}</span>}
    </span>
  );
}
