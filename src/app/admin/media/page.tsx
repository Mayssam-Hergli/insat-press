import { getAllMediaCoverage } from "@/lib/data/mediaCoverage";
import StatusBadge from "@/components/admin/StatusBadge";
import Link from "next/link";

export default async function AdminMediaPage() {
  const mediaItems = await getAllMediaCoverage();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">
          Media Coverage
        </h1>
        <Link href="/admin/media/new" className="btn-editorial btn-editorial-sm">
          New Media
        </Link>
      </div>

      <div className="paper-card rounded-[1.2rem] overflow-hidden">
        <table className="min-w-full divide-y divide-[var(--line)]">
          <thead className="bg-[rgba(216,201,192,0.35)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Status
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
            {mediaItems.map((media) => (
              <tr
                key={media.id.toString()}
                className="transition-colors hover:bg-[rgba(255,248,243,0.55)]"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-[var(--ink)]">
                    {media.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[var(--muted)]">{media.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={media.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted)]">
                  {new Date(media.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/admin/media/${media.id}/edit`}
                    className="mr-4 font-bold text-[var(--press-red)] hover:underline"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/media/${media.slug}`}
                    className="text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
