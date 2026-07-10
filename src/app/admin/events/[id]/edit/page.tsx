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
        <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        <p className="text-gray-600 mt-1">
          Update the event information and content below.
        </p>
      </div>

      <EventEditForm event={event} />
    </div>
  );
}
