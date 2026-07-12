import PodcastAddForm from "@/components/admin/PodcastAddForm";
import { requireRole } from "@/lib/auth/session";

export default async function AddPodcastPage() {
  await requireRole("ADMIN");
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">Add Podcast Episode</h1>
        <p className="mt-1 text-[var(--muted)]">
          Enter the episode information and content below.
        </p>
      </div>

      <PodcastAddForm />
    </div>
  );
}
