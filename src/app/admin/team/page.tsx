import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { getAllProfiles } from "@/lib/data/profiles";
import { getAuthUsersMap } from "@/lib/auth/supabase-admin";
import RoleSelect from "@/components/admin/RoleSelect";
import TeamRowActions from "@/components/admin/TeamRowActions";

export default async function AdminTeamPage() {
  const me = await requireRole("ADMIN");
  const [profiles, authUsers] = await Promise.all([
    getAllProfiles(),
    getAuthUsersMap(),
  ]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">
            Team
          </h1>
          <p className="mt-1 text-[var(--muted)]">
            Invite and manage member accounts. Admins have full access;
            writers and media submit content in their section for approval.
          </p>
        </div>
        <Link href="/admin/team/new" className="btn-editorial btn-editorial-sm">
          Invite Member
        </Link>
      </div>

      <div className="paper-card rounded-[1.2rem] overflow-x-auto">
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
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Role
              </th>
              <th className="px-6 py-3 text-right text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {profiles.map((profile) => {
              const isMe = profile.id === me.id;
              const pending = !authUsers.get(profile.id)?.lastSignInAt;

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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-black uppercase ${
                        pending
                          ? "bg-[rgba(216,201,192,0.5)] text-[var(--muted)]"
                          : "bg-[rgba(46,125,50,0.12)] text-[#2e7d32]"
                      }`}
                    >
                      {pending ? "Pending invite" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end">
                      <RoleSelect id={profile.id} role={profile.role} disabled={isMe} />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {!isMe && <TeamRowActions id={profile.id} pending={pending} />}
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
