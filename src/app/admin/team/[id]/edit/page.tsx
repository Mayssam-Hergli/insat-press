import { notFound, redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getProfileById } from "@/lib/data/profiles";
import TeamEditForm from "@/components/admin/TeamEditForm";

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const me = await requireRole("ADMIN");
  const { id } = await params;

  // Admins edit their own account from the dedicated profile page.
  if (id === me.id) {
    redirect("/admin/profile");
  }

  const profile = await getProfileById(id);
  if (!profile) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">
          Edit Team Member
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          Update their account details and role.
        </p>
      </div>

      <TeamEditForm profile={profile} />
    </div>
  );
}
