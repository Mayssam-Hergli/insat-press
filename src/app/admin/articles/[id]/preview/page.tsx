import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireAuth } from "@/lib/auth/session";
import { canEditArticle, canViewArticle } from "@/lib/auth/permissions";
import { getArticleById } from "@/lib/data/articles";
import ArticleCoverImage from "@/components/articles/ArticleCoverImage";
import ArticleContent from "@/components/articles/ArticleContent";
import StatusBadge from "@/components/admin/StatusBadge";

export default async function ArticlePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const profile = await requireAuth();
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();
  if (!canViewArticle(profile.role, article, profile.id)) redirect("/admin/articles");

  return (
    <article className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div><p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">Private preview</p><StatusBadge status={article.status} /></div>
        {canEditArticle(profile.role, article, profile.id) && <Link href={`/admin/articles/${id}/edit`} className="btn-editorial btn-editorial-sm">Edit</Link>}
      </div>
      <header className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div><p className="font-bold text-[var(--press-red)]">{article.category}</p><h1 className="font-serif-display mt-3 text-5xl font-bold text-[var(--ink)]">{article.title}</h1><p className="mt-4 text-lg text-[var(--muted)]">{article.description}</p></div>
        <ArticleCoverImage path={article.coverImage} alt={`${article.title} cover`} label={article.coverLabel} className="min-h-64 rounded-[1.2rem]" sizes="40vw" priority />
      </header>
      <section className="mx-auto max-w-3xl"><ArticleContent content={article.content} /></section>
    </article>
  );
}
