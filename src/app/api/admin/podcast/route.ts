import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { canEdit } from "@/lib/auth/permissions";
import {
  createPodcastEpisode,
  getPodcastEpisodeByTitle,
} from "@/lib/data/podcastEpisodes";

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
    const existing = await getPodcastEpisodeByTitle(body.title);
    if (existing) {
      return NextResponse.json(
        { error: "Podcast episode exists" },
        { status: 409 }
      );
    }

    // Create the podcast episode
    const newEpisode = await createPodcastEpisode({
      ...body,
      updatedById: profile.id,
    });

    return NextResponse.json(newEpisode, { status: 200 });
  } catch (error) {
    console.error("Create podcast episode error:", error);
    return NextResponse.json(
      { error: "Failed to add podcast episode" },
      { status: 500 }
    );
  }
}
