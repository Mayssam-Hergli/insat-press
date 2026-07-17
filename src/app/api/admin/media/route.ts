import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { canAccessSection, resolveWriteStatus } from "@/lib/auth/permissions";
import {
  createMediaCoverage,
  getMediaCoverageByTitle,
} from "@/lib/data/mediaCoverage";
import { setMediaCoverageContributors } from "@/lib/data/mediaCoverageContributors";

export async function POST(request: NextRequest) {
  try {
    // Media staff and admins may create media coverage; other roles may not.
    const profile = await requireAuth();
    if (!canAccessSection(profile.role, "media")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { coveredByIds, editedByIds, ...body } = await request.json();

    // Prevent duplicate titles
    const existing = await getMediaCoverageByTitle(body.title);
    if (existing) {
      return NextResponse.json(
        { error: "Media coverage exists" },
        { status: 409 }
      );
    }

    // Media staff can only save a draft or submit for review; admins may publish.
    const status = resolveWriteStatus(profile.role, body.status);

    const newMedia = await createMediaCoverage({
      ...body,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      createdById: profile.id,
      updatedById: profile.id,
    });

    await setMediaCoverageContributors(newMedia.id, {
      coveredByIds: coveredByIds ?? [],
      editedByIds: editedByIds ?? [],
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
