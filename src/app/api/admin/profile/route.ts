import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { updateProfile } from "@/lib/data/profiles";

export async function PATCH(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const body = await request.json();

    // Only self-editable fields — role and email changes are admin-only,
    // handled via /api/admin/team/[id].
    const { fullName, bio, avatarUrl } = body;

    const updated = await updateProfile(profile.id, {
      ...(typeof fullName === "string" && { fullName: fullName.trim() }),
      ...(typeof bio === "string" && { bio }),
      ...(typeof avatarUrl === "string" && { avatarUrl }),
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
