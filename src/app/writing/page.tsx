import Navbar from "@/components/shared/Navbar";
import ArticleCard from "@/components/cards/ArticleCard";
import { articles } from "@/data/articles";

export default function WritingPage() {
  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="font-serif-display bg-[linear-gradient(90deg,#821b16_0%,#9e2d27_45%,#c45a50_75%,#d9877d_100%)] bg-clip-text pb-3 text-5xl font-bold leading-[1.08] text-transparent md:text-6xl lg:text-7xl">
              Writing Department
            </h1>

            <div className="mt-3 h-[1px] w-full bg-[var(--line)]" />
          </div>

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