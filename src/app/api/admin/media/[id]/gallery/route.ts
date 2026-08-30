import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { canEditPost } from "@/lib/auth/permissions";
import { getMediaCoverageById } from "@/lib/data/mediaCoverage";
import {
  countGalleryImagesForMediaCoverage,
  createMediaGalleryImage,
  getMaxGallerySortOrder,
  reorderGalleryImagesForMediaCoverage,
} from "@/lib/data/mediaGalleryImages";
import { MediaInputError, parseGalleryOrder } from "@/lib/media/input";
import { ImageStorageError } from "@/lib/storage/images-server";
import { MAX_GALLERY_IMAGES } from "@/lib/storage/media-images";
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

/** Required label: trimmed alt, else a cleaned filename stem, else "Photo N". */
function deriveLabel(alt: string | null, fileName: string, ordinal: number): string {
  if (alt) return alt;
  const stem = fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80)
    .trim();
  return stem || `Photo ${ordinal}`;
}

function optionalFormText(value: FormDataEntryValue | null): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const access = await context(id);
    if ("response" in access) return access.response;

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A gallery image file is required" }, { status: 400 });
    }

    const count = await countGalleryImagesForMediaCoverage(id);
    if (count >= MAX_GALLERY_IMAGES) {
      return NextResponse.json(
        { error: `A gallery can hold at most ${MAX_GALLERY_IMAGES} images.` },
        { status: 400 }
      );
    }

    const alt = optionalFormText(form.get("alt"));
    const caption = optionalFormText(form.get("caption"));
    const label = deriveLabel(alt, file.name, count + 1);

    const output = await optimizeMediaImage(file);
    const ownerId = access.media.createdById ?? access.profile.id;
    const newPath = makeMediaImagePath(ownerId, access.media.id);
    await uploadMediaImage(newPath, output);

    const maxSortOrder = await getMaxGallerySortOrder(id);
    let image;
    try {
      image = await createMediaGalleryImage({
        src: newPath,
        alt,
        caption,
        label,
        sortOrder: maxSortOrder + 1,
        mediaCoverage: { connect: { id: access.media.id } },
      });
    } catch (error) {
      try {
        await removeMediaImage(newPath);
      } catch (rollbackError) {
        console.error("Gallery upload rollback failed:", rollbackError);
      }
      throw error;
    }

    return NextResponse.json({ image: { ...image, id: image.id.toString() } }, { status: 201 });
  } catch (error) {
    if (error instanceof ImageStorageError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Gallery image upload error:", error);
    return NextResponse.json({ error: "Failed to add the gallery image" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const access = await context(id);
    if ("response" in access) return access.response;

    const order = parseGalleryOrder(await request.json());

    // The payload must be an exact permutation of the current gallery ids so a
    // reorder can never add, drop, or reach into another coverage's images.
    const currentIds = access.media.gallery.map((image) => image.id.toString());
    const currentSet = new Set(currentIds);
    const isPermutation =
      currentIds.length === order.length && order.every((imageId) => currentSet.has(imageId));
    if (!isPermutation) {
      return NextResponse.json(
        { error: "order must be an exact permutation of the current gallery image ids." },
        { status: 400 }
      );
    }

    const images = await reorderGalleryImagesForMediaCoverage(id, order);
    return NextResponse.json({
      images: images.map((image) => ({ ...image, id: image.id.toString() })),
    });
  } catch (error) {
    if (error instanceof MediaInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Gallery reorder error:", error);
    return NextResponse.json({ error: "Failed to reorder the gallery" }, { status: 500 });
  }
}
