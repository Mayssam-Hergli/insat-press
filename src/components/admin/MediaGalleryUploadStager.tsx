"use client";

import { useEffect, useState } from "react";
import {
  MAX_GALLERY_IMAGES,
  MEDIA_IMAGE_ACCEPT,
  validateMediaImageFile,
} from "@/lib/storage/media-images";

export type StagedGalleryItem = {
  key: string;
  file: File;
  alt: string;
  caption: string;
};

/**
 * Local-only gallery staging for the add form. Nothing is uploaded here — the
 * files, alt, and caption are held in the parent's state and uploaded (in order)
 * after the draft coverage exists, so a mid-submit failure can be resumed.
 */
export default function MediaGalleryUploadStager({
  items,
  onChange,
}: {
  items: StagedGalleryItem[];
  onChange: (items: StagedGalleryItem[]) => void;
}) {
  const [error, setError] = useState("");

  function addFiles(input: HTMLInputElement) {
    const files = Array.from(input.files ?? []);
    input.value = "";
    if (files.length === 0) return;

    if (items.length + files.length > MAX_GALLERY_IMAGES) {
      setError(`A gallery can hold at most ${MAX_GALLERY_IMAGES} images.`);
      return;
    }
    const staged: StagedGalleryItem[] = [];
    for (const file of files) {
      const validation = validateMediaImageFile(file);
      if (validation) {
        setError(`${file.name}: ${validation}`);
        return;
      }
      staged.push({ key: crypto.randomUUID(), file, alt: "", caption: "" });
    }
    setError("");
    onChange([...items, ...staged]);
  }

  function update(key: string, patch: Partial<StagedGalleryItem>) {
    onChange(items.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function remove(key: string) {
    onChange(items.filter((item) => item.key !== key));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="admin-label">Gallery</label>
        <span className="text-xs text-[var(--muted)]">
          {items.length} / {MAX_GALLERY_IMAGES}
        </span>
      </div>

      <input
        type="file"
        multiple
        accept={MEDIA_IMAGE_ACCEPT}
        disabled={items.length >= MAX_GALLERY_IMAGES}
        className="admin-input"
        onChange={(event) => addFiles(event.target)}
      />
      <p className="text-xs text-[var(--muted)]">
        JPEG, PNG, or WebP; maximum 5 MB each. These upload after the coverage is created.
      </p>
      {error && <p className="text-sm font-semibold text-[var(--press-red)]">{error}</p>}

      {items.length > 0 && (
        <ul className="space-y-4">
          {items.map((item, index) => (
            <StagedCard
              key={item.key}
              item={item}
              index={index}
              total={items.length}
              onUpdate={(patch) => update(item.key, patch)}
              onMove={(direction) => move(index, direction)}
              onRemove={() => remove(item.key)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function StagedCard({
  item,
  index,
  total,
  onUpdate,
  onMove,
  onRemove,
}: {
  item: StagedGalleryItem;
  index: number;
  total: number;
  onUpdate: (patch: Partial<StagedGalleryItem>) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(item.file);
    // Object-URL lifecycle: sync the blob preview URL into state for rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [item.file]);

  return (
    <li className="grid gap-4 rounded-xl border border-[var(--line)] bg-[rgba(255,248,243,0.5)] p-4 sm:grid-cols-[8rem_1fr]">
      <div className="flex h-28 items-center justify-center overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--sand)]">
        {preview && (
          // Local blob preview cannot use next/image.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={item.alt || item.file.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="space-y-2">
        <p className="truncate text-xs font-semibold text-[var(--muted)]">{item.file.name}</p>
        <input
          type="text"
          value={item.alt}
          onChange={(event) => onUpdate({ alt: event.target.value })}
          className="admin-input"
          placeholder="Alt text (also used as the label)"
        />
        <input
          type="text"
          value={item.caption}
          onChange={(event) => onUpdate({ caption: event.target.value })}
          className="admin-input"
          placeholder="Caption (optional)"
        />
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            className="text-sm font-bold text-[var(--muted)] hover:text-[var(--press-red)] disabled:opacity-30"
          >
            ↑ Move up
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            className="text-sm font-bold text-[var(--muted)] hover:text-[var(--press-red)] disabled:opacity-30"
          >
            ↓ Move down
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="ml-auto text-sm font-bold text-[var(--press-red)] hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
