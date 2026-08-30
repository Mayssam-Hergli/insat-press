import EventAddForm from "@/components/admin/EventAddForm";
import { requireRole } from "@/lib/auth/session";

export default async function AddEventPage() {
  await requireRole("ADMIN");
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">Add Event</h1>
        <p className="mt-1 text-[var(--muted)]">
          Enter the event information and content below.
        </p>
      </div>

      <EventAddForm />
    </div>
  );
}
