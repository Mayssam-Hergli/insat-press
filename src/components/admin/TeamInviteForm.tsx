"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminRole } from "@/generated/prisma/client";

const ROLES: { value: AdminRole; label: string }[] = [
  { value: "WRITER", label: "Writer" },
  { value: "MEDIA", label: "Media" },
  { value: "ADMIN", label: "Admin" },
];

export default function TeamInviteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    role: "WRITER" as AdminRole,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to invite team member");
      }

      router.push("/admin/team");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 paper-card rounded-[1.2rem] p-6">
      {error && (
        <div className="rounded-xl border border-[var(--press-red)] bg-[rgba(130,27,22,0.08)] text-[var(--press-red)] px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="fullName" className="admin-label">
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="admin-input"
          />
        </div>

        <div>
          <label htmlFor="email" className="admin-label">
            Email *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="admin-input"
          />
          <p className="mt-1 text-xs text-[var(--muted)]">
            An invite link will be emailed to this address so they can set a
            password and access the panel.
          </p>
        </div>

        <div>
          <label htmlFor="role" className="admin-label">
            Role *
          </label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as AdminRole })
            }
            className="admin-input"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-[var(--line)]">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-bold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="btn-editorial btn-editorial-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending invite..." : "Send Invite"}
        </button>
      </div>
    </form>
  );
}
