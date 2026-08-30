import MediaAddForm from "@/components/admin/MediaAddForm";
import { requireAuth } from "@/lib/auth/session";
import { canAccessSection, canPublish } from "@/lib/auth/permissions";
import { getAllProfiles } from "@/lib/data/profiles";
import { redirect } from "next/navigation";

export default async function AddMediaPage() {
  const profile = await requireAuth();
  if (!canAccessSection(profile.role, "media")) {
    redirect("/admin");
  }

  const profiles = await getAllProfiles();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">Add Media Coverage</h1>
        <p className="mt-1 text-[var(--muted)]">
          Enter the media coverage information and content below.
        </p>
      </div>

      <MediaAddForm profiles={profiles} canPublish={canPublish(profile.role)} />
    </div>
  );
}
