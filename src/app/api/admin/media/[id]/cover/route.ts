import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { canEditPost } from "@/lib/auth/permissions";
import { getMediaCoverageById, updateMediaCoverage } from "@/lib/data/mediaCoverage";
import { ImageStorageError } from "@/lib/storage/images-server";
import { isManagedMediaImagePath } from "@/lib/storage/media-images";
import {
  makeMediaImagePath,
  optimizeMediaImage,
  removeMediaImage,
  uploadMediaImage,
} from "@/lib/storage/media-images-server";

async function context(id: string) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return { response: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
  }
  const media = await getMediaCoverageById(id);
  if (!media) {
    return { response: NextResponse.json({ error: "Media coverage not found" }, { status: 404 }) };
  }
  if (!canEditPost(profile.role, "media", media, profile.id)) {
    return { response: NextResponse.json({ error: "You do not own this media coverage" }, { status: 403 }) };
  }
  return { profile, media };
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const access = await context(id);
    if ("response" in access) return access.response;

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A cover image file is required" }, { status: 400 });
    }

    const output = await optimizeMediaImage(file);
    const ownerId = access.media.createdById ?? access.profile.id;
    const newPath = makeMediaImagePath(ownerId, access.media.id);
    await uploadMediaImage(newPath, output);

    try {
      await updateMediaCoverage(id, {
        coverImage: newPath,
        updatedBy: { connect: { id: access.profile.id } },
      });
    } catch (error) {
      try {
        await removeMediaImage(newPath);
      } catch (rollbackError) {
        console.error("Media cover upload rollback failed:", rollbackError);
      }
      throw error;
    }

    let cleanupPending = false;
    if (isManagedMediaImagePath(access.media.coverImage)) {
      try {
        await removeMediaImage(access.media.coverImage);
      } catch (error) {
        cleanupPending = true;
        console.error("Old media cover cleanup failed:", error);
      }
    }
    return NextResponse.json({ path: newPath, cleanupPending });
  } catch (error) {
    if (error instanceof ImageStorageError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Media cover upload error:", error);
    return NextResponse.json({ error: "Failed to save the media cover" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const access = await context(id);
    if ("response" in access) return access.response;
    const oldPath = access.media.coverImage;

    // Break the public database reference first, then clean up the object.
    await updateMediaCoverage(id, {
      coverImage: null,
      updatedBy: { connect: { id: access.profile.id } },
    });
    if (isManagedMediaImagePath(oldPath)) {
      try {
        await removeMediaImage(oldPath);
      } catch (error) {
        console.error("Media cover reference removed but Storage cleanup failed:", error);
        return NextResponse.json(
          { removed: true, cleanupPending: true, error: "Cover removed, but Storage cleanup failed" },
          { status: 502 }
        );
      }
    }
    return NextResponse.json({ removed: true });
  } catch (error) {
    console.error("Media cover removal error:", error);
    return NextResponse.json({ error: "Failed to remove the media cover" }, { status: 500 });
  }
}
