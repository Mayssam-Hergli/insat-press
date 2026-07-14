import { getAllArticles } from "@/lib/data/articles";
import StatusBadge from "@/components/admin/StatusBadge";
import { requireAuth } from "@/lib/auth/session";
import { canAccessSection, isAdmin } from "@/lib/auth/permissions";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminArticlesPage() {
  const profile = await requireAuth();
  if (!canAccessSection(profile.role, "articles")) {
    redirect("/admin");
  }

  // Writers only see their own articles; admins see all.
  const articles = await getAllArticles(
    isAdmin(profile.role) ? {} : { createdById: profile.id }
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">
          Articles
        </h1>
        <Link href="/admin/articles/new" className="btn-editorial btn-editorial-sm">
          New Article
        </Link>
      </div>

      <div className="paper-card rounded-[1.2rem] overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--line)]">
          <thead className="bg-[rgba(216,201,192,0.35)]">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Category
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
            {articles.map((article) => (
              <tr
                key={article.id.toString()}
                className="transition-colors hover:bg-[rgba(255,248,243,0.55)]"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-[var(--ink)]">
                    {article.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[var(--muted)]">{article.category}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={article.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--muted)]">
                  {new Date(article.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/writing/${article.slug}`}
                    className="mr-4 text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="mr-4 font-bold text-[var(--press-red)] hover:underline"
                  >
                    Edit
                  </Link>
                  {isAdmin(profile.role) && (
                    <Link
                      href={`/admin/articles/${article.id}/`}
                      className="text-[var(--muted)] transition-colors hover:text-[var(--press-red)]"
                    >
                      Delete
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
