"use client";

import { useEffect, useState } from "react";
import {
  ARTICLE_IMAGE_ACCEPT,
  getArticleImageUrl,
  validateArticleImageFile,
} from "@/lib/storage/article-images";

export default function ArticleCoverPicker({
  currentPath,
  file,
  removeCurrent,
  onFileChange,
  onRemoveCurrentChange,
}: {
  currentPath?: string | null;
  file: File | null;
  removeCurrent?: boolean;
  onFileChange: (file: File | null) => void;
  onRemoveCurrentChange?: (remove: boolean) => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const currentUrl = removeCurrent ? null : getArticleImageUrl(currentPath);
  const shownUrl = preview ?? currentUrl;

  return (
    <div className="space-y-3">
      <label htmlFor="coverImage" className="admin-label">Cover image</label>
      {shownUrl ? (
        // A local blob preview and legacy external URLs cannot use next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={shownUrl} alt="Article cover preview" className="h-52 w-full rounded-xl border border-[var(--line)] object-cover" />
      ) : (
        <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-sm text-[var(--muted)]">
          No cover selected
        </div>
      )}
      <input
        id="coverImage"
        type="file"
        accept={ARTICLE_IMAGE_ACCEPT}
        className="admin-input"
        onChange={(event) => {
          const next = event.target.files?.[0] ?? null;
          if (!next) { onFileChange(null); setError(""); return; }
          const validation = validateArticleImageFile(next);
          if (validation) { setError(validation); onFileChange(null); event.target.value = ""; return; }
          setError("");
          onRemoveCurrentChange?.(false);
          onFileChange(next);
        }}
      />
      <p className="text-xs text-[var(--muted)]">JPEG, PNG, or WebP; maximum 5 MB. Images are converted to WebP.</p>
      {error && <p className="text-sm font-semibold text-[var(--press-red)]">{error}</p>}
      {(file || currentUrl) && (
        <button
          type="button"
          className="text-sm font-bold text-[var(--press-red)] hover:underline"
          onClick={() => {
            if (file) onFileChange(null);
            else onRemoveCurrentChange?.(true);
          }}
        >
          {file ? "Clear selected image" : "Remove current image"}
        </button>
      )}
      {removeCurrent && !file && (
        <button type="button" className="ml-3 text-sm font-bold text-[var(--muted)] hover:underline" onClick={() => onRemoveCurrentChange?.(false)}>
          Keep current image
        </button>
      )}
    </div>
  );
}
