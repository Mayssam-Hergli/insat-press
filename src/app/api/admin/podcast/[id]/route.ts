import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/permissions";
import {
  deletePodcastEpisode,
  updatePodcastEpisode,
  getPodcastEpisodeById,
} from "@/lib/data/podcastEpisodes";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and permissions
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (!isAdmin(profile.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Verify episode exists
    const episode = await getPodcastEpisodeById(id);
    if (!episode) {
      return NextResponse.json(
        { error: "Podcast episode not found" },
        { status: 404 }
      );
    }

    // Update the podcast episode
    const updatedEpisode = await updatePodcastEpisode(id, {
      ...body,
      updatedById: profile.id,
    });

    return NextResponse.json(updatedEpisode, { status: 200 });
  } catch (error) {
    console.error("Update podcast episode error:", error);
    return NextResponse.json(
      { error: "Failed to update podcast episode" },
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
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (!isAdmin(profile.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const episode = await getPodcastEpisodeById(id);
    if (!episode) {
      return NextResponse.json(
        { error: "Podcast episode not found" },
        { status: 404 }
      );
    }

    await deletePodcastEpisode(id);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Delete podcast episode error:", error);
    return NextResponse.json(
      { error: "Failed to delete podcast episode" },
      { status: 500 }
    );
  }
}
