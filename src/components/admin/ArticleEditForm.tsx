"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ArticleWithWriters } from "@/lib/data/articles";
import MarkdownEditor, { toMarkdownString } from "./MarkdownEditor";
import StatusSelect from "./StatusSelect";
import ArticleCoverPicker from "./ArticleCoverPicker";

type ArticleEditFormProps = {
  article: ArticleWithWriters;
  canPublish: boolean;
};

export default function ArticleEditForm({
  article,
  canPublish,
}: ArticleEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [removeCover, setRemoveCover] = useState(false);

  const [formData, setFormData] = useState({
    title: article.title,
    slug: article.slug,
    category: article.category,
    description: article.description,
    coverLabel: article.coverLabel || "",
    sourceUrl: article.sourceUrl || "",
    displayDate: article.displayDate || "",
    status: article.status,
    content: toMarkdownString(article.content),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: undefined }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Failed to update article");

      if (coverFile) {
        const upload = new FormData();
        upload.set("file", coverFile);
        const coverResponse = await fetch(`/api/admin/articles/${article.id}/cover`, { method: "POST", body: upload });
        const coverData = await coverResponse.json().catch(() => ({}));
        if (!coverResponse.ok) throw new Error(coverData.error || "Cover upload failed; the article text was saved.");
      } else if (removeCover) {
        const coverResponse = await fetch(`/api/admin/articles/${article.id}/cover`, { method: "DELETE" });
        const coverData = await coverResponse.json().catch(() => ({}));
        if (!coverResponse.ok) throw new Error(coverData.error || "Cover removal was only partially completed.");
      }

      const transition = await fetch(`/api/admin/articles/${article.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: formData.status }),
      });
      const transitionData = await transition.json().catch(() => ({}));
      if (!transition.ok) throw new Error(transitionData.error || "Content was saved, but the status could not be updated.");

      router.push("/admin/articles");
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
            URL-friendly version of the title (e.g., my-article-title)
          </p>
        </div>

        {/* Category and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="admin-label">
              Category *
            </label>
            <input
              type="text"
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
        <div className="grid gap-4 md:grid-cols-2">
          <ArticleCoverPicker
            currentPath={article.coverImage}
            file={coverFile}
            removeCurrent={removeCover}
            onFileChange={setCoverFile}
            onRemoveCurrentChange={setRemoveCover}
          />
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

        {/* Source URL and Display Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="sourceUrl" className="admin-label">
              Source URL
            </label>
            <input
              type="url"
              id="sourceUrl"
              value={formData.sourceUrl}
              onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
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

        {/* Writers */}
        <div>
          <label className="admin-label">
            Writers
          </label>
          <div className="text-sm text-[var(--muted)]">
            Current writers: {article.writers
              .map(({ profile }) => profile.fullName ?? profile.email)
              .join(", ") || "None"}
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">
            Note: Writer management will be implemented in a future update
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
            placeholder="Write the article body in Markdown…"
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
