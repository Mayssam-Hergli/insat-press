import "server-only";

import { redirect } from "next/navigation";
import type { AdminRole, Profile } from "@/generated/prisma/client";
import { createSupabaseServerClient } from "./supabase-server";
import { getProfileById, getProfileByEmail } from "../data/profiles";

export async function getCurrentUser() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (error) {
    return null;
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  // Try to get profile by user ID first
  let profile = await getProfileById(user.id);

  // If not found, try by email
  if (!profile && user.email) {
    profile = await getProfileByEmail(user.email);
  }

  return profile;
}

export async function requireAuth(): Promise<Profile> {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  return profile;
}

export async function requireRole(
  allowedRoles: AdminRole | AdminRole[]
): Promise<Profile> {
  const profile = await requireAuth();

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(profile.role)) {
    redirect("/admin");
  }

  return profile;
}
