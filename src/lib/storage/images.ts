/**
 * Client-safe image constants and helpers shared by every managed image bucket
 * (article covers, media covers, media galleries). This module never imports
 * `sharp` or the Supabase admin client, so it is safe to pull into client
 * components for pre-flight validation.
 */

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const IMAGE_MAX_WIDTH = 1600;
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

export type ImageMimeType = (typeof IMAGE_MIME_TYPES)[number];

const UUID_SEGMENT =
  "[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}";

/**
 * Builds the managed Storage path regex for a bucket prefix:
 * `^<prefix>/<owner-uuid>/<numeric-id>/<random-uuid>.webp$`. The prefix must be
 * a trusted literal (e.g. "articles", "media") — it is interpolated verbatim.
 */
export function makeManagedPathRegex(prefix: string): RegExp {
  return new RegExp(
    `^${prefix}/${UUID_SEGMENT}/\\d+/${UUID_SEGMENT}\\.webp$`,
    "i"
  );
}

/** True when the value is a parseable http(s) URL (legacy stored covers). */
export function isHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Resolves a managed object path to its public Storage URL. */
export function buildPublicStorageUrl(
  bucket: string,
  path: string
): string | null {
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!projectUrl) return null;
  return `${projectUrl}/storage/v1/object/public/${bucket}/${path}`;
}

function fileExtension(name: string): string {
  const lower = name.toLowerCase();
  const dot = lower.lastIndexOf(".");
  return dot >= 0 ? lower.slice(dot) : "";
}

/**
 * Validates the client-visible metadata of an image before upload. Returns an
 * error message, or `null` when the file passes. This runs both client-side
 * (pre-flight) and server-side (never trusting the client) and now enforces a
 * filename extension allowlist in addition to size and MIME checks.
 */
export function validateImageFile(
  file: Pick<File, "size" | "type" | "name">
): string | null {
  if (file.size <= 0) return "Choose a non-empty image file.";
  if (file.size > IMAGE_MAX_BYTES) return "The image must be 5 MB or smaller.";
  if (!IMAGE_MIME_TYPES.includes(file.type as ImageMimeType)) {
    return "Only JPEG, PNG, and WebP images are allowed.";
  }
  if (!IMAGE_EXTENSIONS.includes(fileExtension(file.name) as (typeof IMAGE_EXTENSIONS)[number])) {
    return "The file must have a .jpg, .jpeg, .png, or .webp extension.";
  }
  return null;
}
