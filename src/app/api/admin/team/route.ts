import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { canManageProfiles } from "@/lib/auth/permissions";
import {
  createProfile,
  generateUniqueProfileSlug,
  getProfileByEmail,
} from "@/lib/data/profiles";
import { deleteAuthUser, inviteUserByEmail } from "@/lib/auth/supabase-admin";
import type { AdminRole } from "@/generated/prisma/client";

const VALID_ROLES: AdminRole[] = ["ADMIN", "WRITER", "MEDIA"];

export async function POST(request: NextRequest) {
  try {
    const profile = await requireAuth();
    if (!canManageProfiles(profile.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";
    const role = body.role as AdminRole;

    if (!email || !fullName || !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: "email, fullName, and a valid role are required" },
        { status: 400 }
      );
    }

    const existing = await getProfileByEmail(email);
    if (existing) {
      return NextResponse.json(
        { error: "A team member with this email already exists" },
        { status: 409 }
      );
    }

    const redirectTo = `${request.nextUrl.origin}/auth/confirm?next=/auth/set-password`;
    const invitedUser = await inviteUserByEmail(email, redirectTo);
    if (!invitedUser) {
      return NextResponse.json(
        { error: "Failed to invite user" },
        { status: 500 }
      );
    }

    const slug = await generateUniqueProfileSlug(fullName);

    try {
      const newProfile = await createProfile({
        id: invitedUser.id,
        email,
        fullName,
        role,
        slug,
      });
      return NextResponse.json(newProfile, { status: 200 });
    } catch (profileError) {
      // Best-effort rollback so a half-invited auth user doesn't linger.
      await deleteAuthUser(invitedUser.id).catch(() => {});
      throw profileError;
    }
  } catch (error) {
    console.error("Invite team member error:", error);
    return NextResponse.json(
      { error: "Failed to invite team member" },
      { status: 500 }
    );
  }
}
