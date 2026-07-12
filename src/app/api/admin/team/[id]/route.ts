import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { canManageProfiles } from "@/lib/auth/permissions";
import { getProfileById, updateProfile } from "@/lib/data/profiles";
import type { AdminRole } from "@/generated/prisma/client";

const VALID_ROLES: AdminRole[] = ["ADMIN", "WRITER", "MEDIA"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Only admins can manage team member roles.
    const profile = await requireAuth();
    if (!canManageProfiles(profile.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const role = body.role as AdminRole;

    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const target = await getProfileById(id);
    if (!target) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    // Prevent admins from changing their own role, which could lock the last
    // admin out of the panel.
    if (target.id === profile.id) {
      return NextResponse.json(
        { error: "You cannot change your own role" },
        { status: 400 }
      );
    }

    const updated = await updateProfile(id, { role });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Update member role error:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}
