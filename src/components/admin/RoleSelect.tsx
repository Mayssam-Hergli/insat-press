"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminRole } from "@/generated/prisma/client";

const ROLES: { value: AdminRole; label: string }[] = [
  { value: "ADMIN", label: "Admin" },
  { value: "WRITER", label: "Writer" },
  { value: "MEDIA", label: "Media" },
];

/**
 * Per-member role picker. Admins change a member's role inline; the request is
 * rejected server-side for a member's own row (guarded here too via `disabled`).
 */
export default function RoleSelect({
  id,
  role,
  disabled = false,
}: {
  id: string;
  role: AdminRole;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState<AdminRole>(role);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function change(next: AdminRole) {
    const previous = value;
    setValue(next);
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: next }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to update role");
      }
      router.refresh();
    } catch (e) {
      setValue(previous);
      setError(e instanceof Error ? e.message : "Failed to update role");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <select
        value={value}
        disabled={disabled || saving}
        onChange={(e) => change(e.target.value as AdminRole)}
        className="admin-input max-w-[9rem] disabled:opacity-50"
        aria-label="Member role"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-xs text-[var(--press-red)]">{error}</span>
      )}
    </div>
  );
}
