import { requireRole } from "@/lib/auth/session";
import { getAllProfiles } from "@/lib/data/profiles";
import RoleSelect from "@/components/admin/RoleSelect";

export default async function AdminTeamPage() {
  const me = await requireRole("ADMIN");
  const profiles = await getAllProfiles();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">
          Team
        </h1>
        <p className="mt-1 text-[var(--muted)]">
          Manage member accounts and their roles. Admins have full access;
          writers and media submit content in their section for approval.
        </p>
      </div>

      <div className="paper-card rounded-[1.2rem] overflow-hidden">
        <table className="min-w-full divide-y divide-[var(--line)]">
          <thead className="bg-[rgba(216,201,192,0.35)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {profiles.map((profile) => {
              const isMe = profile.id === me.id;

              return (
                <tr
                  key={profile.id}
                  className="transition-colors hover:bg-[rgba(255,248,243,0.55)]"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-[var(--ink)]">
                      {profile.fullName || "—"}
                    </span>
                    {isMe && (
                      <span className="ml-2 rounded-full border border-[var(--line)] px-2 py-0.5 text-xs font-black uppercase text-[var(--muted)]">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted)]">
                    {profile.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted)]">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end">
                      <RoleSelect
                        id={profile.id}
                        role={profile.role}
                        disabled={isMe}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
