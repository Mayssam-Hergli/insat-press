import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { canEdit } from "@/lib/auth/permissions";
import {
  createMediaCoverage,
  getMediaCoverageByTitle,
} from "@/lib/data/mediaCoverage";

export async function POST(request: NextRequest) {
  try {
    // Check authentication and permissions
    const profile = await requireAuth();
    if (!canEdit(profile.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Prevent duplicate titles
    const existing = await getMediaCoverageByTitle(body.title);
    if (existing) {
      return NextResponse.json(
        { error: "Media coverage exists" },
        { status: 409 }
      );
    }

    // Create the media coverage
    const newMedia = await createMediaCoverage({
      ...body,
      updatedById: profile.id,
    });

    return NextResponse.json(newMedia, { status: 200 });
  } catch (error) {
    console.error("Create media coverage error:", error);
    return NextResponse.json(
      { error: "Failed to add media coverage" },
      { status: 500 }
    );
  }
}
