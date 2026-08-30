"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { PodcastEpisodeWithEditors } from "@/lib/data/podcastEpisodes";
import MarkdownEditor, { toMarkdownString } from "./MarkdownEditor";
import { toDateTimeLocalValue, dateTimeLocalToISO } from "@/lib/admin/datetime";

type PodcastEditFormProps = {
  episode: PodcastEpisodeWithEditors;
};

export default function PodcastEditForm({ episode }: PodcastEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: episode.title,
    slug: episode.slug,
    host: episode.host,
    guest: episode.guest,
    editedBy: episode.editedBy,
    youtubeUrl: episode.youtubeUrl,
    spotifyUrl: episode.spotifyUrl,
    description: episode.description,
    coverImage: episode.coverImage || "",
    coverLabel: episode.coverLabel || "",
    displayDate: episode.displayDate || "",
    releasedAt: toDateTimeLocalValue(episode.releasedAt),
    status: episode.status,
    content: toMarkdownString(episode.content),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/podcast/${episode.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          releasedAt: dateTimeLocalToISO(formData.releasedAt),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update podcast episode");
      }

      router.push("/admin/podcast");
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
            URL-friendly version of the title (e.g., my-episode-title)
          </p>
        </div>

        {/* Host and Guest */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="host" className="admin-label">
              Host *
            </label>
            <input
              type="text"
              id="host"
              required
              value={formData.host}
              onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              className="admin-input"
            />
          </div>

          <div>
            <label htmlFor="guest" className="admin-label">
              Guest *
            </label>
            <input
              type="text"
              id="guest"
              required
              value={formData.guest}
              onChange={(e) => setFormData({ ...formData, guest: e.target.value })}
              className="admin-input"
            />
          </div>
        </div>

        {/* Edited By and Status */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="editedBy" className="admin-label">
              Edited By *
            </label>
            <input
              type="text"
              id="editedBy"
              required
              value={formData.editedBy}
              onChange={(e) => setFormData({ ...formData, editedBy: e.target.value })}
              className="admin-input"
            />
          </div>

          <div>
            <label htmlFor="status" className="admin-label">
              Status *
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="admin-input"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* YouTube and Spotify URLs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="youtubeUrl" className="admin-label">
              YouTube URL *
            </label>
            <input
              type="url"
              id="youtubeUrl"
              required
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              className="admin-input"
            />
          </div>

          <div>
            <label htmlFor="spotifyUrl" className="admin-label">
              Spotify URL *
            </label>
            <input
              type="url"
              id="spotifyUrl"
              required
              value={formData.spotifyUrl}
              onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
              className="admin-input"
            />
          </div>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        {/* Released At and Display Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="releasedAt" className="admin-label">
              Released At
            </label>
            <input
              type="datetime-local"
              id="releasedAt"
              value={formData.releasedAt}
              onChange={(e) => setFormData({ ...formData, releasedAt: e.target.value })}
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

        {/* Content */}
        <div>
          <label htmlFor="content" className="admin-label">
            Content
          </label>
          <MarkdownEditor
            id="content"
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            placeholder="Write the episode notes in Markdown…"
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
