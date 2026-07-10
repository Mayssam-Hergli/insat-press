import Navbar from "@/components/shared/Navbar";
import PageTitle from "@/components/shared/PageTitle";
import ArticleCard from "@/components/cards/ArticleCard";
import { getPublishedArticles } from "@/lib/data/articles";

export default async function WritingPage() {
  const articles = await getPublishedArticles();

  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <PageTitle title="Writing Department" />

          <div className="overflow-hidden rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)]">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}