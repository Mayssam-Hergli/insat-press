"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Profile } from "@/generated/prisma/client";
import MarkdownEditor from "./MarkdownEditor";
import { dateTimeLocalToISO } from "@/lib/admin/datetime";
import StatusSelect from "./StatusSelect";
import ContributorSelect from "./ContributorSelect";
import CoverImagePicker from "./CoverImagePicker";
import MediaGalleryUploadStager, {
  type StagedGalleryItem,
} from "./MediaGalleryUploadStager";
import {
  MEDIA_IMAGE_ACCEPT,
  getMediaImageUrl,
  validateMediaImageFile,
} from "@/lib/storage/media-images";

export default function MediaAddForm({
  profiles,
  canPublish,
}: {
  profiles: Profile[];
  canPublish: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [stagedGallery, setStagedGallery] = useState<StagedGalleryItem[]>([]);
  const [coveredByIds, setCoveredByIds] = useState<string[]>([]);
  const [editedByIds, setEditedByIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    type: "",
    eventName: "",
    description: "",
    coverLabel: "",
    displayDate: "",
    coveredAt: "",
    status: "DRAFT",
    content: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const fields = {
        ...formData,
        status: undefined,
        coveredAt: dateTimeLocalToISO(formData.coveredAt),
        coveredByIds,
        editedByIds,
      };

      // 1. Create the draft (first attempt) or update it (a retry re-uses the
      //    same id, so a mid-submit failure never creates a duplicate record).
      let id = draftId;
      if (!id) {
        const response = await fetch(`/api/admin/media`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Failed to create the draft");
        id = String(data.id);
        setDraftId(id);
      } else {
        const response = await fetch(`/api/admin/media/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fields),
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Failed to update the draft");
      }

      // 2. Cover upload; clear on success so a retry skips it.
      if (coverFile) {
        const upload = new FormData();
        upload.set("file", coverFile);
        const response = await fetch(`/api/admin/media/${id}/cover`, {
          method: "POST",
          body: upload,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(`${data.error || "Cover upload failed."} The draft was kept; retry to continue.`);
        }
        setCoverFile(null);
      }

      // 3. Gallery uploads, in order. Each removes itself from the staged list on
      //    success so a retry resumes with only the images that still remain.
      const pending = [...stagedGallery];
      for (const item of pending) {
        const body = new FormData();
        body.set("file", item.file);
        if (item.alt) body.set("alt", item.alt);
        if (item.caption) body.set("caption", item.caption);
        const response = await fetch(`/api/admin/media/${id}/gallery`, {
          method: "POST",
          body,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(`${data.error || "Gallery upload failed."} Draft saved; retry to upload the remaining images.`);
        }
        setStagedGallery((prev) => prev.filter((it) => it.key !== item.key));
      }

      // 4. Apply the requested status (resolveWriteStatus runs server-side).
      const transition = await fetch(`/api/admin/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: formData.status }),
      });
      const transitionData = await transition.json().catch(() => ({}));
      if (!transition.ok) {
        throw new Error(`${transitionData.error || "Status update failed."} The draft was kept; retry to continue.`);
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <div className="grid gap-4 md:grid-cols-2">
          <CoverImagePicker
            file={coverFile}
            onFileChange={setCoverFile}
            resolveUrl={getMediaImageUrl}
            validate={validateMediaImageFile}
            accept={MEDIA_IMAGE_ACCEPT}
            previewAlt="Media cover preview"
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

        {/* Covered At and Display Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        {/* Gallery staging — uploaded after the draft is created. */}
        <MediaGalleryUploadStager items={stagedGallery} onChange={setStagedGallery} />

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
