import { getAllWriters } from "@/lib/data/writers";
import { requireRole } from "@/lib/auth/session";
import Link from "next/link";

export default async function AdminWritersPage() {
  await requireRole("ADMIN");
  const writers = await getAllWriters();
  const canManage = true;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">
          Writers
        </h1>
        {canManage && (
          <Link href="/admin/writers/new" className="btn-editorial btn-editorial-sm">
            New Writer
          </Link>
        )}
      </div>

      <div className="paper-card rounded-[1.2rem] overflow-hidden">
        <table className="min-w-full divide-y divide-[var(--line)]">
          <thead className="bg-[rgba(216,201,192,0.35)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {writers.map((writer) => (
              <tr
                key={writer.id.toString()}
                className="transition-colors hover:bg-[rgba(255,248,243,0.55)]"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {writer.avatarUrl && (
                      <img
                        src={writer.avatarUrl}
                        alt={writer.name}
                        className="mr-3 h-10 w-10 rounded-full border border-[var(--line)] object-cover"
                      />
                    )}
                    <div className="text-sm font-bold text-[var(--ink)]">
                      {writer.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[var(--muted)]">{writer.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted)]">
                  {new Date(writer.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {canManage && (
                    <Link
                      href={`/admin/writers/${writer.id}/edit`}
                      className="font-bold text-[var(--press-red)] hover:underline"
                    >
                      Edit
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
