"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { MediaCoverageWithRelations } from "@/lib/data/mediaCoverage";
import type { Profile } from "@/generated/prisma/client";
import MarkdownEditor, { toMarkdownString } from "./MarkdownEditor";
import { toDateTimeLocalValue, dateTimeLocalToISO } from "@/lib/admin/datetime";
import StatusSelect from "./StatusSelect";
import ContributorSelect from "./ContributorSelect";

type MediaEditFormProps = {
  media: MediaCoverageWithRelations;
  profiles: Profile[];
  canPublish: boolean;
};

export default function MediaEditForm({ media, profiles, canPublish }: MediaEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coveredByIds, setCoveredByIds] = useState<string[]>(
    media.contributors.filter((c) => c.role === "COVERED_BY").map((c) => c.profileId)
  );
  const [editedByIds, setEditedByIds] = useState<string[]>(
    media.contributors.filter((c) => c.role === "EDITED_BY").map((c) => c.profileId)
  );

  const [formData, setFormData] = useState({
    title: media.title,
    slug: media.slug,
    type: media.type,
    eventName: media.eventName,
    description: media.description,
    coverImage: media.coverImage || "",
    coverLabel: media.coverLabel || "",
    displayDate: media.displayDate || "",
    coveredAt: toDateTimeLocalValue(media.coveredAt),
    status: media.status,
    content: toMarkdownString(media.content),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/media/${media.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          coveredAt: dateTimeLocalToISO(formData.coveredAt),
          coveredByIds,
          editedByIds,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update media coverage");
      }

      router.push("/admin/media");
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
        {/* Title */}
        <div>
          <label htmlFor="title" className="admin-label">
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="admin-input"
          />
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="admin-label">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="admin-input"
          />
          <p className="mt-1 text-xs text-[var(--muted)]">
            URL-friendly version of the title (e.g., my-media-title)
          </p>
        </div>

        {/* Type and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="admin-label">
              Type *
            </label>
            <input
              type="text"
              id="type"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="admin-input"
            />
          </div>

          <div>
            <label htmlFor="status" className="admin-label">
              Status *
            </label>
            <StatusSelect
              value={formData.status}
              onChange={(status) => setFormData({ ...formData, status })}
              canPublish={canPublish}
            />
          </div>
        </div>

        {/* Covered By and Edited By */}
        <div className="grid grid-cols-2 gap-4">
          <ContributorSelect
            profiles={profiles}
            value={coveredByIds}
            onChange={setCoveredByIds}
            label="Covered By"
          />

          <ContributorSelect
            profiles={profiles}
            value={editedByIds}
            onChange={setEditedByIds}
            label="Edited By"
          />
        </div>

        {/* Event Name */}
        <div>
          <label htmlFor="eventName" className="admin-label">
            Event Name *
          </label>
          <input
            type="text"
            id="eventName"
            required
            value={formData.eventName}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
            className="admin-input"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="admin-label">
            Description *
          </label>
          <textarea
            id="description"
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="admin-input"
          />
        </div>

        {/* Cover Image and Label */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="coverImage" className="admin-label">
              Cover Image URL
            </label>
            <input
              type="url"
              id="coverImage"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="admin-input"
            />
          </div>

          <div>
            <label htmlFor="coverLabel" className="admin-label">
              Cover Label
            </label>
            <input
              type="text"
              id="coverLabel"
              value={formData.coverLabel}
              onChange={(e) => setFormData({ ...formData, coverLabel: e.target.value })}
              className="admin-input"
            />
          </div>
        </div>

        {/* Covered At and Display Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="coveredAt" className="admin-label">
              Covered At
            </label>
            <input
              type="datetime-local"
              id="coveredAt"
              value={formData.coveredAt}
              onChange={(e) => setFormData({ ...formData, coveredAt: e.target.value })}
              className="admin-input"
            />
          </div>

          <div>
            <label htmlFor="displayDate" className="admin-label">
              Display Date
            </label>
            <input
              type="text"
              id="displayDate"
              placeholder="e.g., January 2024"
              value={formData.displayDate}
              onChange={(e) => setFormData({ ...formData, displayDate: e.target.value })}
              className="admin-input"
            />
          </div>
        </div>

        {/* Gallery */}
        <div>
          <label className="admin-label">
            Gallery
          </label>
          <div className="text-sm text-[var(--muted)]">
            Current images:{" "}
            {media.gallery.map((image) => image.label).join(", ") || "None"}
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Note: Gallery management will be implemented in a future update
          </p>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="admin-label">
            Content
          </label>
          <MarkdownEditor
            id="content"
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Write the coverage details in Markdown…"
          />
          <p className="mt-1 text-xs text-[var(--muted)]">
            Supports Markdown: headings, <strong>**bold**</strong>, links, lists, quotes, and tables.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-[var(--line)]">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-[var(--line)] px-4 py-2 text-sm font-bold text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
        >
          Cancel
        </button>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-editorial btn-editorial-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}
