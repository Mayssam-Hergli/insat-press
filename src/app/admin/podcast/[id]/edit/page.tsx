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
        <h1 className="text-3xl font-bold text-gray-900">Edit Podcast Episode</h1>
        <p className="text-gray-600 mt-1">
          Update the episode information and content below.
        </p>
      </div>

      <PodcastEditForm episode={episode} />
    </div>
  );
}
