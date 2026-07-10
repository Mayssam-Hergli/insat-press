import type { AdminRole } from "@/generated/prisma/client";

export function canManageProfiles(role: AdminRole): boolean {
  return role === "ADMIN";
}

export function canPublish(role: AdminRole): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function canDelete(role: AdminRole): boolean {
  return role === "ADMIN";
}

export function canEdit(role: AdminRole): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function canCreateContent(role: AdminRole): boolean {
  return role === "ADMIN" || role === "EDITOR";
}

export function isAdmin(role: AdminRole): boolean {
  return role === "ADMIN";
}
