import {
  IMAGE_ACCEPT,
  IMAGE_MAX_BYTES,
  IMAGE_MAX_WIDTH,
  IMAGE_MIME_TYPES,
  buildPublicStorageUrl,
  isHttpUrl,
  makeManagedPathRegex,
  validateImageFile,
} from "./images";

export const ARTICLE_IMAGE_BUCKET = "article-images";
export const ARTICLE_IMAGE_MAX_BYTES = IMAGE_MAX_BYTES;
export const ARTICLE_IMAGE_MAX_WIDTH = IMAGE_MAX_WIDTH;
export const ARTICLE_IMAGE_ACCEPT = IMAGE_ACCEPT;
export const ARTICLE_IMAGE_MIME_TYPES = IMAGE_MIME_TYPES;

const MANAGED_PATH = makeManagedPathRegex("articles");

export function isManagedArticleImagePath(value: unknown): value is string {
  return typeof value === "string" && MANAGED_PATH.test(value);
}

export function isLegacyArticleImageUrl(value: unknown): value is string {
  return isHttpUrl(value);
}

/** Converts a stored object path to its public URL while retaining old URLs. */
export function getArticleImageUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (isLegacyArticleImageUrl(value)) return value;
  if (!isManagedArticleImagePath(value)) return null;
  return buildPublicStorageUrl(ARTICLE_IMAGE_BUCKET, value);
}

export function validateArticleImageFile(
  file: Pick<File, "size" | "type" | "name">
): string | null {
  return validateImageFile(file);
}
