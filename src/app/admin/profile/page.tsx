import { requireAuth } from "@/lib/auth/session";
import ProfileEditForm from "@/components/admin/ProfileEditForm";

export default async function MyProfilePage() {
  const profile = await requireAuth();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">
          My Profile
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          Update how you appear on bylines and coverage credits.
        </p>
      </div>

      <ProfileEditForm profile={profile} />
    </div>
  );
}
