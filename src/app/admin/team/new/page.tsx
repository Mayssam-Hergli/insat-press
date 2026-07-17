import { requireRole } from "@/lib/auth/session";
import TeamInviteForm from "@/components/admin/TeamInviteForm";

export default async function NewTeamMemberPage() {
  await requireRole("ADMIN");

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">
          Invite Team Member
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          They&apos;ll receive an email invite to set their password and join
          the panel.
        </p>
      </div>

      <TeamInviteForm />
    </div>
  );
}
