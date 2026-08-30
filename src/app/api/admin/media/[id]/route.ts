import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { canEdit } from "@/lib/auth/permissions";
import {
  updateMediaCoverage,
  getMediaCoverageById,
} from "@/lib/data/mediaCoverage";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and permissions
    const profile = await requireAuth();
    if (!canEdit(profile.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Verify media coverage exists
    const media = await getMediaCoverageById(id);
    if (!media) {
      return NextResponse.json(
        { error: "Media coverage not found" },
        { status: 404 }
      );
    }

    // Update the media coverage
    const updatedMedia = await updateMediaCoverage(id, {
      ...body,
      updatedById: profile.id,
    });

    return NextResponse.json(updatedMedia, { status: 200 });
  } catch (error) {
    console.error("Update media coverage error:", error);
    return NextResponse.json(
      { error: "Failed to update media coverage" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and permissions
    const profile = await requireAuth();
    if (!canEdit(profile.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Note: Actual deletion would require canDelete permission
    // For now, this is a placeholder
    return NextResponse.json(
      { error: "Delete functionality not yet implemented" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Delete media coverage error:", error);
    return NextResponse.json(
      { error: "Failed to delete media coverage" },
      { status: 500 }
    );
  }
}
