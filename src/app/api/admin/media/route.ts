import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { canAccessSection } from "@/lib/auth/permissions";
import {
  MediaInputError,
  parseContributorIds,
  parseNewMediaInput,
} from "@/lib/media/input";
import {
  createMediaCoverage,
  getMediaCoverageBySlug,
  getMediaCoverageByTitle,
} from "@/lib/data/mediaCoverage";
import { setMediaCoverageContributors } from "@/lib/data/mediaCoverageContributors";

export async function POST(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (!canAccessSection(profile.role, "media")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    const { data } = parseNewMediaInput(body);
    const contributors = parseContributorIds(body);

    const duplicate =
      (await getMediaCoverageByTitle(data.title)) ||
      (await getMediaCoverageBySlug(data.slug));
    if (duplicate) {
      return NextResponse.json(
        { error: "Media coverage with this title or slug already exists" },
        { status: 409 }
      );
    }

    // Creation is deliberately a draft. The client uploads its cover and gallery
    // to this stable id, then requests the desired status in a separate PATCH.
    const media = await createMediaCoverage({
      ...data,
      status: "DRAFT",
      publishedAt: null,
      createdBy: { connect: { id: profile.id } },
      updatedBy: { connect: { id: profile.id } },
    });

    await setMediaCoverageContributors(media.id, {
      coveredByIds: contributors.coveredByIds,
      editedByIds: contributors.editedByIds,
    });

    return NextResponse.json({ ...media, id: media.id.toString() }, { status: 201 });
  } catch (error) {
    if (error instanceof MediaInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Create media coverage error:", error);
    return NextResponse.json({ error: "Failed to add media coverage" }, { status: 500 });
  }
}
