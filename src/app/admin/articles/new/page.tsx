import { getAllWriters } from "@/lib/data/writers";
import ArticleAddForm from "@/components/admin/ArticleAddForm";

export default async function AddArticlePage(){
  const  [writers] = await Promise.all([
    getAllWriters(),
  ]);


  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">Add Article</h1>
        <p className="mt-1 text-[var(--muted)]">
          Enter the article information and content below.
        </p>
      </div>

      <ArticleAddForm  writers={writers} />
    </div>
  );
}
