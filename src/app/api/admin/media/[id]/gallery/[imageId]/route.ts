import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { canEditPost } from "@/lib/auth/permissions";
import { getMediaCoverageById } from "@/lib/data/mediaCoverage";
import {
  deleteMediaGalleryImage,
  getMediaGalleryImageById,
  updateMediaGalleryImage,
} from "@/lib/data/mediaGalleryImages";
import { MediaInputError, parseGalleryImagePatch } from "@/lib/media/input";
import { isManagedMediaImagePath } from "@/lib/storage/media-images";
import { removeMediaImage } from "@/lib/storage/media-images-server";

async function context(id: string, imageId: string) {
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
  const image = await getMediaGalleryImageById(imageId);
  // The image must exist AND belong to this coverage — otherwise a valid owner
  // of coverage A could reach an image on coverage B by guessing its id.
  if (!image || image.mediaCoverageId !== media.id) {
    return { response: NextResponse.json({ error: "Gallery image not found" }, { status: 404 }) };
  }
  return { profile, media, image };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params;
    const access = await context(id, imageId);
    if ("response" in access) return access.response;

    const data = parseGalleryImagePatch(await request.json());
    const image = await updateMediaGalleryImage(imageId, data);
    return NextResponse.json({ image: { ...image, id: image.id.toString() } });
  } catch (error) {
    if (error instanceof MediaInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Gallery image update error:", error);
    return NextResponse.json({ error: "Failed to update the gallery image" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const { id, imageId } = await params;
    const access = await context(id, imageId);
    if ("response" in access) return access.response;
    const path = access.image.src;

    // Break the database reference first, then remove the object.
    await deleteMediaGalleryImage(imageId);

    if (isManagedMediaImagePath(path)) {
      try {
        await removeMediaImage(path);
      } catch (error) {
        console.error("Gallery image row deleted but Storage cleanup failed:", error);
        return NextResponse.json(
          { removed: true, cleanupPending: true, error: "Image removed, but Storage cleanup failed" },
          { status: 502 }
        );
      }
    }
    return NextResponse.json({ removed: true });
  } catch (error) {
    console.error("Gallery image removal error:", error);
    return NextResponse.json({ error: "Failed to remove the gallery image" }, { status: 500 });
  }
}
