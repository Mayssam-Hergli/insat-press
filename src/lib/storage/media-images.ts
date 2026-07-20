import {
  IMAGE_ACCEPT,
  buildPublicStorageUrl,
  isHttpUrl,
  makeManagedPathRegex,
  validateImageFile,
} from "./images";

export const MEDIA_IMAGE_BUCKET = "media-images";
export const MEDIA_IMAGE_ACCEPT = IMAGE_ACCEPT;

/** Hard cap on gallery images per coverage, enforced on every upload. */
export const MAX_GALLERY_IMAGES = 30;

const MANAGED_PATH = makeManagedPathRegex("media");

export function isManagedMediaImagePath(value: unknown): value is string {
  return typeof value === "string" && MANAGED_PATH.test(value);
}

/**
 * Resolves a stored media image reference to a renderable URL: managed object
 * paths become public Storage URLs, legacy http(s) values pass through, and
 * anything else (including empty label-only rows) resolves to `null`.
 */
export function getMediaImageUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (isHttpUrl(value)) return value;
  if (!isManagedMediaImagePath(value)) return null;
  return buildPublicStorageUrl(MEDIA_IMAGE_BUCKET, value);
}

export function validateMediaImageFile(
  file: Pick<File, "size" | "type" | "name">
): string | null {
  return validateImageFile(file);
}
