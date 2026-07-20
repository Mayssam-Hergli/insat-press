import type { ContentStatus, Prisma } from "@/generated/prisma/client";

const STATUSES = new Set<ContentStatus>(["DRAFT", "PENDING", "PUBLISHED", "ARCHIVED"]);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Scalar fields a client may write on a media coverage. `coverImage` and any
 * gallery fields are deliberately absent: those flow only through their
 * dedicated upload endpoints, never a raw JSON body.
 */
type MediaWriteData = Pick<
  Prisma.MediaCoverageCreateInput,
  | "title"
  | "slug"
  | "type"
  | "eventName"
  | "description"
  | "content"
  | "coverLabel"
  | "displayDate"
  | "coveredAt"
>;

export class MediaInputError extends Error {}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new MediaInputError("Request body must be a JSON object.");
  }
  return value as Record<string, unknown>;
}

function requiredText(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  if (typeof value !== "string" || !value.trim()) {
    throw new MediaInputError(`${key} is required.`);
  }
  return value.trim();
}

function optionalText(body: Record<string, unknown>, key: string): string | null {
  const value = body[key];
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") throw new MediaInputError(`${key} must be text.`);
  return value.trim() || null;
}

function requiredSlug(body: Record<string, unknown>): string {
  const slug = requiredText(body, "slug");
  if (!SLUG_PATTERN.test(slug)) {
    throw new MediaInputError(
      "slug must contain only lowercase letters, numbers, and single hyphens."
    );
  }
  return slug;
}

function optionalDate(body: Record<string, unknown>, key: string): Date | null {
  const value = body[key];
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") throw new MediaInputError(`${key} must be a date string.`);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new MediaInputError(`${key} must be a valid date.`);
  return date;
}

function requestedStatus(body: Record<string, unknown>): ContentStatus | undefined {
  const value = body.status;
  if (value === undefined) return undefined;
  if (typeof value !== "string" || !STATUSES.has(value as ContentStatus)) {
    throw new MediaInputError("Invalid media status.");
  }
  return value as ContentStatus;
}

export function parseNewMediaInput(value: unknown): {
  data: MediaWriteData;
  requestedStatus?: ContentStatus;
} {
  const body = asRecord(value);
  return {
    data: {
      title: requiredText(body, "title"),
      slug: requiredSlug(body),
      type: requiredText(body, "type"),
      eventName: requiredText(body, "eventName"),
      description: requiredText(body, "description"),
      content: typeof body.content === "string" ? body.content : "",
      coverLabel: optionalText(body, "coverLabel"),
      displayDate: optionalText(body, "displayDate"),
      coveredAt: optionalDate(body, "coveredAt"),
    },
    requestedStatus: requestedStatus(body),
  };
}

export function parseMediaPatch(value: unknown): {
  data: Partial<MediaWriteData>;
  requestedStatus?: ContentStatus;
} {
  const body = asRecord(value);
  const data: Partial<MediaWriteData> = {};
  for (const key of ["title", "type", "eventName", "description"] as const) {
    if (key in body) data[key] = requiredText(body, key);
  }
  if ("slug" in body) data.slug = requiredSlug(body);
  if ("content" in body) {
    if (typeof body.content !== "string") throw new MediaInputError("content must be text.");
    data.content = body.content;
  }
  for (const key of ["coverLabel", "displayDate"] as const) {
    if (key in body) data[key] = optionalText(body, key);
  }
  if ("coveredAt" in body) data.coveredAt = optionalDate(body, "coveredAt");
  return { data, requestedStatus: requestedStatus(body) };
}

/** Parses an alt/caption/label patch for a single gallery image. */
export function parseGalleryImagePatch(
  value: unknown
): Prisma.MediaGalleryImageUpdateInput {
  const body = asRecord(value);
  const data: Prisma.MediaGalleryImageUpdateInput = {};
  let touched = false;
  if ("alt" in body) {
    data.alt = optionalText(body, "alt");
    touched = true;
  }
  if ("caption" in body) {
    data.caption = optionalText(body, "caption");
    touched = true;
  }
  if ("label" in body) {
    data.label = requiredText(body, "label");
    touched = true;
  }
  if (!touched) throw new MediaInputError("Provide at least one field to update.");
  return data;
}

/** Parses a `{ order: string[] }` reorder payload of unique numeric ids. */
export function parseGalleryOrder(value: unknown): string[] {
  const body = asRecord(value);
  const order = body.order;
  if (!Array.isArray(order) || order.length === 0) {
    throw new MediaInputError("order must be a non-empty array of image ids.");
  }
  const ids: string[] = [];
  const seen = new Set<string>();
  for (const raw of order) {
    if (typeof raw !== "string" || !/^\d+$/.test(raw)) {
      throw new MediaInputError("order must contain numeric image ids as strings.");
    }
    if (seen.has(raw)) throw new MediaInputError("order must not contain duplicate ids.");
    seen.add(raw);
    ids.push(raw);
  }
  return ids;
}

function toIdArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === "string")
    : [];
}

/**
 * Extracts contributor id arrays. `provided` reports whether either key was
 * present so PATCH can leave contributors untouched when they were omitted.
 */
export function parseContributorIds(value: unknown): {
  provided: boolean;
  coveredByIds: string[];
  editedByIds: string[];
} {
  const body = asRecord(value);
  return {
    provided: "coveredByIds" in body || "editedByIds" in body,
    coveredByIds: toIdArray(body.coveredByIds),
    editedByIds: toIdArray(body.editedByIds),
  };
}
