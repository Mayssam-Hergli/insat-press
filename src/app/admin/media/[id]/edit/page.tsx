import { getMediaCoverageById } from "@/lib/data/mediaCoverage";
import { notFound } from "next/navigation";
import MediaEditForm from "@/components/admin/MediaEditForm";

export default async function EditMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const media = await getMediaCoverageById(id);

  if (!media) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">Edit Media Coverage</h1>
        <p className="mt-1 text-[var(--muted)]">
          Update the media coverage information and content below.
        </p>
      </div>

      <MediaEditForm media={media} />
    </div>
  );
}
