import EventAddForm from "@/components/admin/EventAddForm";

export default function AddEventPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add Event</h1>
        <p className="text-gray-600 mt-1">
          Enter the event information and content below.
        </p>
      </div>

      <EventAddForm />
    </div>
  );
}
