import { getArticleById } from "@/lib/data/articles";
import { getAllWriters } from "@/lib/data/writers";
import { notFound } from "next/navigation";
import ArticleEditForm from "@/components/admin/ArticleEditForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [article, writers] = await Promise.all([
    getArticleById(id),
    getAllWriters(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">Edit Article</h1>
        <p className="mt-1 text-[var(--muted)]">
          Update the article information and content below.
        </p>
      </div>

      <ArticleEditForm article={article} writers={writers} />
    </div>
  );
}
