"use client";

import { useState } from "react";
import {
  MAX_GALLERY_IMAGES,
  MEDIA_IMAGE_ACCEPT,
  getMediaImageUrl,
  validateMediaImageFile,
} from "@/lib/storage/media-images";

export type GalleryImageData = {
  id: string;
  src: string | null;
  alt: string | null;
  label: string;
  caption: string | null;
  sortOrder: number;
};

/**
 * Full gallery management for the edit form. Every action (upload, edit,
 * reorder, delete) persists immediately through the gallery API so the database
 * and Storage never drift from what the admin sees. Reorders apply optimistically
 * and revert if the server rejects them.
 */
export default function MediaGalleryManager({
  mediaId,
  initialImages,
}: {
  mediaId: string;
  initialImages: GalleryImageData[];
}) {
  const [images, setImages] = useState<GalleryImageData[]>(initialImages);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState("");

  const atCapacity = images.length >= MAX_GALLERY_IMAGES;

  async function handleFiles(input: HTMLInputElement) {
    const files = Array.from(input.files ?? []);
    input.value = "";
    if (files.length === 0) return;

    if (images.length + files.length > MAX_GALLERY_IMAGES) {
      setError(`A gallery can hold at most ${MAX_GALLERY_IMAGES} images.`);
      return;
    }
    for (const file of files) {
      const validation = validateMediaImageFile(file);
      if (validation) {
        setError(`${file.name}: ${validation}`);
        return;
      }
    }

    setError("");
    setBusy(true);
    try {
      for (let i = 0; i < files.length; i += 1) {
        setProgress(`Uploading ${i + 1} of ${files.length}…`);
        const body = new FormData();
        body.set("file", files[i]);
        const response = await fetch(`/api/admin/media/${mediaId}/gallery`, {
          method: "POST",
          body,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || `Failed to upload ${files[i].name}`);
        setImages((prev) => [...prev, data.image as GalleryImageData]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  function updateLocal(id: string, patch: Partial<GalleryImageData>) {
    setImages((prev) => prev.map((image) => (image.id === id ? { ...image, ...patch } : image)));
  }

  async function saveDetails(image: GalleryImageData) {
    setError("");
    const response = await fetch(`/api/admin/media/${mediaId}/gallery/${image.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt: image.alt ?? "", caption: image.caption ?? "" }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not save image details");
      return;
    }
    setImages((prev) => prev.map((it) => (it.id === image.id ? (data.image as GalleryImageData) : it)));
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const previous = images;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    setImages(next);
    setError("");

    const response = await fetch(`/api/admin/media/${mediaId}/gallery`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((image) => image.id) }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not reorder the gallery");
      setImages(previous);
      return;
    }
    setImages(data.images as GalleryImageData[]);
  }

  async function remove(image: GalleryImageData) {
    if (!window.confirm(`Delete "${image.label}"? This also removes the image from Storage.`)) return;
    setError("");
    const response = await fetch(`/api/admin/media/${mediaId}/gallery/${image.id}`, {
      method: "DELETE",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok && !data.removed) {
      setError(data.error || "Could not delete the image");
      return;
    }
    if (data.cleanupPending) setError(data.error || "Image removed, but Storage cleanup is pending.");
    setImages((prev) => prev.filter((it) => it.id !== image.id));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="admin-label">Gallery</label>
        <span className="text-xs text-[var(--muted)]">
          {images.length} / {MAX_GALLERY_IMAGES}
        </span>
      </div>

      <input
        type="file"
        multiple
        accept={MEDIA_IMAGE_ACCEPT}
        disabled={busy || atCapacity}
        className="admin-input"
        onChange={(event) => handleFiles(event.target)}
      />
      <p className="text-xs text-[var(--muted)]">
        JPEG, PNG, or WebP; maximum 5 MB each. Images are converted to WebP and saved immediately.
      </p>
      {progress && <p className="text-sm font-semibold text-[var(--ink)]">{progress}</p>}
      {error && <p className="text-sm font-semibold text-[var(--press-red)]">{error}</p>}

      {images.length === 0 ? (
        <div className="flex h-24 items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-sm text-[var(--muted)]">
          No gallery images yet
        </div>
      ) : (
        <ul className="space-y-4">
          {images.map((image, index) => {
            const thumb = getMediaImageUrl(image.src);
            return (
              <li
                key={image.id}
                className="grid gap-4 rounded-xl border border-[var(--line)] bg-[rgba(255,248,243,0.5)] p-4 sm:grid-cols-[8rem_1fr]"
              >
                <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--sand)]">
                  {thumb ? (
                    // Admin thumbnail; a plain img avoids next/image config for legacy URLs.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={image.alt ?? image.label} className="h-full w-full object-cover" />
                  ) : (
                    <span className="px-2 text-center font-hand text-lg font-bold text-[rgba(130,27,22,0.5)]">
                      {image.label}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="admin-label" htmlFor={`alt-${image.id}`}>
                      Alt text
                    </label>
                    <input
                      id={`alt-${image.id}`}
                      type="text"
                      value={image.alt ?? ""}
                      onChange={(event) => updateLocal(image.id, { alt: event.target.value })}
                      className="admin-input"
                      placeholder="Describe the image for screen readers"
                    />
                  </div>
                  <div>
                    <label className="admin-label" htmlFor={`caption-${image.id}`}>
                      Caption
                    </label>
                    <input
                      id={`caption-${image.id}`}
                      type="text"
                      value={image.caption ?? ""}
                      onChange={(event) => updateLocal(image.id, { caption: event.target.value })}
                      className="admin-input"
                      placeholder="Shown beneath the image"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => saveDetails(image)}
                      className="btn-editorial btn-editorial-sm"
                    >
                      Save details
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      className="text-sm font-bold text-[var(--muted)] hover:text-[var(--press-red)] disabled:opacity-30"
                    >
                      ↑ Move up
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === images.length - 1}
                      className="text-sm font-bold text-[var(--muted)] hover:text-[var(--press-red)] disabled:opacity-30"
                    >
                      ↓ Move down
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(image)}
                      className="ml-auto text-sm font-bold text-[var(--press-red)] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
