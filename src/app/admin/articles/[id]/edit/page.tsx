import { getArticleById } from "@/lib/data/articles";
import { getAllProfiles } from "@/lib/data/profiles";
import { notFound, redirect } from "next/navigation";
import ArticleEditForm from "@/components/admin/ArticleEditForm";
import { requireAuth } from "@/lib/auth/session";
import { canEditArticle, canPublish } from "@/lib/auth/permissions";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const profile = await requireAuth();
  const { id } = await params;
  const [article, profiles] = await Promise.all([
    getArticleById(id),
    getAllProfiles(),
  ]);

  if (!article) {
    notFound();
  }

  // Writers may only edit their own articles.
  if (!canEditArticle(profile.role, article, profile.id)) {
    redirect("/admin/articles");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">Edit Article</h1>
        <p className="mt-1 text-[var(--muted)]">
          Update the article information and content below.
        </p>
      </div>

      <ArticleEditForm
        article={article}
        profiles={profiles}
        canPublish={canPublish(profile.role)}
      />
    </div>
  );
}
