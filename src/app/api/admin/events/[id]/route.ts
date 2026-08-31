import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/permissions";
import { deleteEvent, updateEvent, getEventById } from "@/lib/data/events";

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

    // Verify event exists
    const event = await getEventById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Update the event
    const updatedEvent = await updateEvent(id, {
      ...body,
      updatedById: profile.id,
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
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

    const event = await getEventById(id);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await deleteEvent(id);
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
