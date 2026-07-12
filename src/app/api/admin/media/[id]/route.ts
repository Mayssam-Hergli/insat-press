import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import {
  canDelete,
  canEditPost,
  resolveWriteStatus,
} from "@/lib/auth/permissions";
import {
  updateMediaCoverage,
  getMediaCoverageById,
} from "@/lib/data/mediaCoverage";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await requireAuth();
    const { id } = await params;

    // Verify media coverage exists
    const media = await getMediaCoverageById(id);
    if (!media) {
      return NextResponse.json(
        { error: "Media coverage not found" },
        { status: 404 }
      );
    }

    // Admins may edit any media coverage; media staff only their own.
    if (!canEditPost(profile.role, "media", media, profile.id)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Media staff can only save a draft or submit for review; editing a
    // published post sends it back to pending until an admin re-approves.
    const status = resolveWriteStatus(profile.role, body.status);

    const publishedAt =
      status === "PUBLISHED" && !media.publishedAt
        ? new Date()
        : media.publishedAt;

    const updatedMedia = await updateMediaCoverage(id, {
      ...body,
      status,
      publishedAt,
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
    // Only admins can delete content.
    const profile = await requireAuth();
    if (!canDelete(profile.role)) {
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
