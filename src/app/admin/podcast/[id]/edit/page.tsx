import { getPodcastEpisodeById } from "@/lib/data/podcastEpisodes";
import { notFound } from "next/navigation";
import PodcastEditForm from "@/components/admin/PodcastEditForm";

export default async function EditPodcastPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const episode = await getPodcastEpisodeById(id);

  if (!episode) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">Edit Podcast Episode</h1>
        <p className="mt-1 text-[var(--muted)]">
          Update the episode information and content below.
        </p>
      </div>

      <PodcastEditForm episode={episode} />
    </div>
  );
}
