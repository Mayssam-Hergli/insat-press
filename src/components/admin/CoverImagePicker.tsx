"use client";

import { useEffect, useState } from "react";

type CoverImagePickerProps = {
  currentPath?: string | null;
  file: File | null;
  removeCurrent?: boolean;
  onFileChange: (file: File | null) => void;
  onRemoveCurrentChange?: (remove: boolean) => void;
  /** Resolves a stored path/URL to something renderable, or null. */
  resolveUrl: (value?: string | null) => string | null;
  /** Client-side pre-flight validation; returns an error message or null. */
  validate: (file: Pick<File, "size" | "type" | "name">) => string | null;
  accept: string;
  label?: string;
  hint?: string;
  previewAlt?: string;
  inputId?: string;
};

/**
 * Bucket-agnostic managed cover picker. A local blob preview (or a legacy
 * external URL) is shown with a plain `<img>` since neither can go through
 * `next/image`. Selection is validated client-side before it reaches state; the
 * server always re-validates.
 */
export default function CoverImagePicker({
  currentPath,
  file,
  removeCurrent,
  onFileChange,
  onRemoveCurrentChange,
  resolveUrl,
  validate,
  accept,
  label = "Cover image",
  hint = "JPEG, PNG, or WebP; maximum 5 MB. Images are converted to WebP.",
  previewAlt = "Cover preview",
  inputId = "coverImage",
}: CoverImagePickerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) {
      // Object-URL lifecycle: clear the stale preview when the selection is reset.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const currentUrl = removeCurrent ? null : resolveUrl(currentPath);
  const shownUrl = preview ?? currentUrl;

  return (
    <div className="space-y-3">
      <label htmlFor={inputId} className="admin-label">
        {label}
      </label>
      {shownUrl ? (
        // A local blob preview and legacy external URLs cannot use next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={shownUrl}
          alt={previewAlt}
          className="h-52 w-full rounded-xl border border-[var(--line)] object-cover"
        />
      ) : (
        <div className="flex h-36 items-center justify-center rounded-xl border border-dashed border-[var(--line)] text-sm text-[var(--muted)]">
          No cover selected
        </div>
      )}
      <input
        id={inputId}
        type="file"
        accept={accept}
        className="admin-input"
        onChange={(event) => {
          const next = event.target.files?.[0] ?? null;
          if (!next) {
            onFileChange(null);
            setError("");
            return;
          }
          const validation = validate(next);
          if (validation) {
            setError(validation);
            onFileChange(null);
            event.target.value = "";
            return;
          }
          setError("");
          onRemoveCurrentChange?.(false);
          onFileChange(next);
        }}
      />
      <p className="text-xs text-[var(--muted)]">{hint}</p>
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
        <button
          type="button"
          className="ml-3 text-sm font-bold text-[var(--muted)] hover:underline"
          onClick={() => onRemoveCurrentChange?.(false)}
        >
          Keep current image
        </button>
      )}
    </div>
  );
}
