import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { canManageProfiles } from "@/lib/auth/permissions";
import { getProfileById } from "@/lib/data/profiles";
import { getAuthUsersMap, inviteUserByEmail } from "@/lib/auth/supabase-admin";

export async function POST(
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
    const target = await getProfileById(id);
    if (!target) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const authUsers = await getAuthUsersMap();
    const status = authUsers.get(id);
    if (status?.lastSignInAt) {
      return NextResponse.json(
        { error: "This member has already accepted their invite" },
        { status: 409 }
      );
    }

    const redirectTo = `${request.nextUrl.origin}/auth/confirm?next=/auth/set-password`;
    await inviteUserByEmail(target.email, redirectTo);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Resend invite error:", error);
    return NextResponse.json(
      { error: "Failed to resend invite" },
      { status: 500 }
    );
  }
}
