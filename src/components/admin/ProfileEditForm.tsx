"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/generated/prisma/client";

export default function ProfileEditForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: profile.fullName || "",
    bio: profile.bio || "",
    avatarUrl: profile.avatarUrl || "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
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
      {success && (
        <div className="rounded-xl border border-[#2e7d32] bg-[rgba(46,125,50,0.08)] text-[#2e7d32] px-4 py-3">
          Profile updated.
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
          <label htmlFor="avatarUrl" className="admin-label">
            Avatar URL
          </label>
          <input
            type="url"
            id="avatarUrl"
            value={formData.avatarUrl}
            onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
            className="admin-input"
          />
        </div>

        <div>
          <label htmlFor="bio" className="admin-label">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="admin-input"
          />
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-[var(--line)]">
        <button
          type="submit"
          disabled={loading}
          className="btn-editorial btn-editorial-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
