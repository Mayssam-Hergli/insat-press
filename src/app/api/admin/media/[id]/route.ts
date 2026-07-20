import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { canDelete, canEditPost, resolveWriteStatus } from "@/lib/auth/permissions";
import {
  MediaInputError,
  parseContributorIds,
  parseMediaPatch,
} from "@/lib/media/input";
import {
  deleteMediaCoverage,
  getMediaCoverageById,
  updateMediaCoverage,
} from "@/lib/data/mediaCoverage";
import { setMediaCoverageContributors } from "@/lib/data/mediaCoverageContributors";
import { isManagedMediaImagePath } from "@/lib/storage/media-images";
import { removeMediaImage } from "@/lib/storage/media-images-server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    const { id } = await params;

    const media = await getMediaCoverageById(id);
    if (!media) {
      return NextResponse.json({ error: "Media coverage not found" }, { status: 404 });
    }
    // Admins may edit any media coverage; media staff only their own. The cover
    // and gallery are never accepted here — they flow through dedicated routes.
    if (!canEditPost(profile.role, "media", media, profile.id)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    const { data, requestedStatus } = parseMediaPatch(body);
    const contributors = parseContributorIds(body);

    // Only touch status when the client actually requested one (the edit form
    // saves fields with status omitted, then flips status in a final PATCH).
    const status =
      requestedStatus !== undefined
        ? resolveWriteStatus(profile.role, requestedStatus)
        : undefined;
    const publishedAt =
      status === "PUBLISHED" && !media.publishedAt ? new Date() : media.publishedAt;

    const updated = await updateMediaCoverage(id, {
      ...data,
      ...(status !== undefined ? { status, publishedAt } : {}),
      updatedBy: { connect: { id: profile.id } },
    });

    if (contributors.provided) {
      await setMediaCoverageContributors(id, {
        coveredByIds: contributors.coveredByIds,
        editedByIds: contributors.editedByIds,
      });
    }

    return NextResponse.json({ ...updated, id: updated.id.toString() }, { status: 200 });
  } catch (error) {
    if (error instanceof MediaInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Update media coverage error:", error);
    return NextResponse.json({ error: "Failed to update media coverage" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Only admins can delete content.
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (!canDelete(profile.role)) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { id } = await params;
    const media = await getMediaCoverageById(id);
    if (!media) {
      return NextResponse.json({ error: "Media coverage not found" }, { status: 404 });
    }

    // Capture managed object paths before the rows (and their cascade) are gone.
    const managedPaths = [
      media.coverImage,
      ...media.gallery.map((image) => image.src),
    ].filter(isManagedMediaImagePath);

    // Delete the record first; gallery rows cascade via their FK.
    await deleteMediaCoverage(id);

    // Best-effort Storage cleanup; surface if any object could not be removed.
    let cleanupPending = false;
    for (const path of managedPaths) {
      try {
        await removeMediaImage(path);
      } catch (error) {
        cleanupPending = true;
        console.error("Media object cleanup failed after delete:", error);
      }
    }

    if (cleanupPending) {
      return NextResponse.json(
        {
          deleted: true,
          cleanupPending: true,
          error: "Media coverage deleted, but some Storage objects remain",
        },
        { status: 502 }
      );
    }
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Delete media coverage error:", error);
    return NextResponse.json({ error: "Failed to delete media coverage" }, { status: 500 });
  }
}
