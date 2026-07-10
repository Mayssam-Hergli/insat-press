import { getEventById } from "@/lib/data/events";
import { notFound } from "next/navigation";
import EventEditForm from "@/components/admin/EventEditForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">Edit Event</h1>
        <p className="mt-1 text-[var(--muted)]">
          Update the event information and content below.
        </p>
      </div>

      <EventEditForm event={event} />
    </div>
  );
}
