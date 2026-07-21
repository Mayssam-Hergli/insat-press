export const ARTICLE_IMAGE_BUCKET = "articles-photos";
export const ARTICLE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const ARTICLE_IMAGE_MAX_WIDTH = 1600;
export const ARTICLE_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
export const ARTICLE_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const MANAGED_PATH =
  /^articles\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/\d+\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp$/i;

export function isManagedArticleImagePath(value: unknown): value is string {
  return typeof value === "string" && MANAGED_PATH.test(value);
}

export function isLegacyArticleImageUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Converts a stored object path to its public URL while retaining old URLs. */
export function getArticleImageUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (isLegacyArticleImageUrl(value)) return value;
  if (!isManagedArticleImagePath(value)) return null;

  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!projectUrl) return null;

  return `${projectUrl}/storage/v1/object/public/${ARTICLE_IMAGE_BUCKET}/${value}`;
}

export function validateArticleImageFile(file: Pick<File, "size" | "type">): string | null {
  if (file.size <= 0) return "Choose a non-empty image file.";
  if (file.size > ARTICLE_IMAGE_MAX_BYTES) return "The image must be 5 MB or smaller.";
  if (!ARTICLE_IMAGE_MIME_TYPES.includes(file.type as (typeof ARTICLE_IMAGE_MIME_TYPES)[number])) {
    return "Only JPEG, PNG, and WebP images are allowed.";
  }
  return null;
}
