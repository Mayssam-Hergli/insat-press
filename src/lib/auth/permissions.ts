import type { AdminRole, ContentStatus } from "@/generated/prisma/client";

/** Content sections the admin panel manages. */
export type Section = "articles" | "media" | "events" | "podcast";

/**
 * Section each restricted role owns. Admins are not listed here because they
 * own every section (see `canAccessSection`).
 */
const ROLE_SECTION: Partial<Record<AdminRole, Section>> = {
  WRITER: "articles",
  MEDIA: "media",
};

export function isAdmin(role: AdminRole): boolean {
  return role === "ADMIN";
}

/** Only primary admins (president/vice) manage writer/media profiles. */
export function canManageProfiles(role: AdminRole): boolean {
  return isAdmin(role);
}

/** Only admins can publish/approve content. Writers/media submit for review. */
export function canPublish(role: AdminRole): boolean {
  return isAdmin(role);
}

/** Only admins can delete content. */
export function canDelete(role: AdminRole): boolean {
  return isAdmin(role);
}

/** Can this role touch this section at all? Admins can touch every section. */
export function canAccessSection(role: AdminRole, section: Section): boolean {
  return isAdmin(role) || ROLE_SECTION[role] === section;
}

/** Sections a role may see in the nav / dashboard. */
export function sectionsForRole(role: AdminRole): Section[] {
  if (isAdmin(role)) return ["articles", "media", "events", "podcast"];
  const section = ROLE_SECTION[role];
  return section ? [section] : [];
}

/**
 * Can this user edit a specific post? Admins can edit anything. Writers/media
 * can only edit posts in their own section that they created.
 */
export function canEditPost(
  role: AdminRole,
  section: Section,
  post: { createdById: string | null },
  userId: string
): boolean {
  if (isAdmin(role)) return true;
  return canAccessSection(role, section) && post.createdById === userId;
}

const VALID_STATUSES: ContentStatus[] = [
  "DRAFT",
  "PENDING",
  "PUBLISHED",
  "ARCHIVED",
];

/**
 * Resolve the status a write is actually allowed to produce.
 *
 * - Admins keep whatever valid status they requested (defaulting to DRAFT).
 * - Writers/media can only keep a post as DRAFT or submit it for review
 *   (PENDING). They can never publish or archive, so any other requested value
 *   — including an edit to a currently-published post — collapses to PENDING.
 */
export function resolveWriteStatus(
  role: AdminRole,
  requested: ContentStatus | string | undefined
): ContentStatus {
  if (isAdmin(role)) {
    return VALID_STATUSES.includes(requested as ContentStatus)
      ? (requested as ContentStatus)
      : "DRAFT";
  }
  return requested === "DRAFT" ? "DRAFT" : "PENDING";
}
