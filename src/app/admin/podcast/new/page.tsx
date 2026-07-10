import PodcastAddForm from "@/components/admin/PodcastAddForm";

export default function AddPodcastPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add Podcast Episode</h1>
        <p className="text-gray-600 mt-1">
          Enter the episode information and content below.
        </p>
      </div>

      <PodcastAddForm />
    </div>
  );
}
