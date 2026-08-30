import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { canManageProfiles } from "@/lib/auth/permissions";
import {
  countProfileContributions,
  deleteProfile,
  getProfileById,
  updateProfile,
} from "@/lib/data/profiles";
import { deleteAuthUser, updateAuthUserEmail } from "@/lib/auth/supabase-admin";
import type { AdminRole, Prisma } from "@/generated/prisma/client";

const VALID_ROLES: AdminRole[] = ["ADMIN", "WRITER", "MEDIA"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Only admins can manage team member accounts.
    const profile = await requireAuth();
    if (!canManageProfiles(profile.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const target = await getProfileById(id);
    if (!target) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const body = await request.json();
    const data: Prisma.ProfileUpdateInput = {};

    if (body.role !== undefined) {
      if (!VALID_ROLES.includes(body.role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      // Prevent admins from changing their own role, which could lock the
      // last admin out of the panel.
      if (target.id === profile.id) {
        return NextResponse.json(
          { error: "You cannot change your own role" },
          { status: 400 }
        );
      }
      data.role = body.role;
    }

    if (typeof body.fullName === "string") data.fullName = body.fullName.trim();
    if (typeof body.bio === "string") data.bio = body.bio;
    if (typeof body.avatarUrl === "string") data.avatarUrl = body.avatarUrl;
    if (typeof body.slug === "string") data.slug = body.slug.trim();

    if (typeof body.email === "string" && body.email.trim() !== target.email) {
      const email = body.email.trim();
      await updateAuthUserEmail(target.id, email);
      data.email = email;
    }

    const updated = await updateProfile(id, data);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Update team member error:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await requireAuth();
    if (!canManageProfiles(profile.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (id === profile.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    const target = await getProfileById(id);
    if (!target) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const { articleCount, mediaCount } = await countProfileContributions(id);
    if (articleCount > 0 || mediaCount > 0) {
      return NextResponse.json(
        {
          error:
            "This member still has article or media credits. Reassign them before deleting.",
        },
        { status: 409 }
      );
    }

    await deleteAuthUser(id);
    await deleteProfile(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete team member error:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
