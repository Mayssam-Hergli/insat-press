import { getMediaCoverageById } from "@/lib/data/mediaCoverage";
import { getAllProfiles } from "@/lib/data/profiles";
import { notFound, redirect } from "next/navigation";
import MediaEditForm from "@/components/admin/MediaEditForm";
import { requireAuth } from "@/lib/auth/session";
import { canEditPost, canPublish } from "@/lib/auth/permissions";

export default async function EditMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireAuth();
  const { id } = await params;
  const [media, profiles] = await Promise.all([
    getMediaCoverageById(id),
    getAllProfiles(),
  ]);

  if (!media) {
    notFound();
  }

  // Media staff may only edit their own coverage.
  if (!canEditPost(profile.role, "media", media, profile.id)) {
    redirect("/admin/media");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">Edit Media Coverage</h1>
        <p className="mt-1 text-[var(--muted)]">
          Update the media coverage information and content below.
        </p>
      </div>

      <MediaEditForm media={media} profiles={profiles} canPublish={canPublish(profile.role)} />
    </div>
  );
}
