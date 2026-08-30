import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/permissions";
import { createEvent, getEventByTitle } from "@/lib/data/events";

export async function POST(request: NextRequest) {
  try {
    // Check authentication and permissions
    const profile = await requireAuth();
    if (!isAdmin(profile.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Prevent duplicate titles
    const existing = await getEventByTitle(body.title);
    if (existing) {
      return NextResponse.json({ error: "Event exists" }, { status: 409 });
    }

    // Create the event
    const newEvent = await createEvent({
      ...body,
      updatedById: profile.id,
    });

    return NextResponse.json(newEvent, { status: 200 });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json(
      { error: "Failed to add event" },
      { status: 500 }
    );
  }
}
