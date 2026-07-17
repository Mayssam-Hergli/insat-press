import { getAllArticles } from "@/lib/data/articles";
import StatusBadge from "@/components/admin/StatusBadge";
import { requireAuth } from "@/lib/auth/session";
import { canAccessSection, isAdmin } from "@/lib/auth/permissions";
import Link from "next/link";
import { redirect } from "next/navigation";
import DeleteArticleButton from "@/components/admin/DeleteArticleButton";
import ArticleCoverImage from "@/components/articles/ArticleCoverImage";

type AdminArticlesPageProps = {
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminArticlesPage({ searchParams }: AdminArticlesPageProps) {
  const { saved } = await searchParams;
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
      {saved === "1" && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-green-700/30 bg-green-50 px-4 py-3 text-sm font-bold text-green-800"
        >
          Article saved successfully.
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">
          Articles
        </h1>
        <Link href="/admin/articles/new" className="btn-editorial btn-editorial-sm">
          New Article
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
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                Updated
              </th>
              <th className="px-14 py-3 text-right text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
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
                <td className="px-6 py-4">
                  <div className="flex min-w-56 items-center gap-3">
                    <ArticleCoverImage
                      path={article.coverImage}
                      alt={`${article.title} cover`}
                      label={article.coverLabel}
                      className="h-14 w-20 shrink-0 rounded-lg"
                      sizes="80px"
                    />
                    <div className="text-sm font-bold text-[var(--ink)]">
                      {article.title}
                    </div>
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
                    href={`/admin/articles/${article.id}/preview`}
                    className="mr-4 text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                  >
                    View
                  </Link>
                  {(isAdmin(profile.role) || article.status === "DRAFT") && (
                    <Link href={`/admin/articles/${article.id}/edit`} className="mr-4 font-bold text-[var(--press-red)] hover:underline">Edit</Link>
                  )}
                  {isAdmin(profile.role) && (
                    <DeleteArticleButton id={article.id.toString()} />
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
