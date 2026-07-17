import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import ArticleCoverImage from "@/components/articles/ArticleCoverImage";
import ArticleContent from "@/components/articles/ArticleContent";
import { getPublishedArticleBySlug } from "@/lib/data/articles";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const writers = article.writers.map(({ profile }) => profile.fullName ?? profile.email).join(", ") || "INSAT Press";
  const date = article.displayDate ?? article.publishedAt?.toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" }) ?? "";

  return (
    <main className="min-h-screen page-bg">
      <Navbar />
      <article className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <Link href="/writing" className="text-sm font-black uppercase tracking-[0.18em] text-[var(--press-red)]">← Back to Writing</Link>
          <section className="mt-8 grid gap-6 rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
            <div>
              <p className="text-sm font-bold text-[var(--muted)]"><span className="text-[var(--press-red)]">{article.category}</span> · {writers}{date && ` · ${date}`}</p>
              <h1 className="font-serif-display mt-4 text-5xl font-bold leading-[1.05] text-[var(--press-red)] md:text-6xl">{article.title}</h1>
              <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-[var(--ink)]">{article.description}</p>
            </div>
            <ArticleCoverImage path={article.coverImage} alt={`${article.title} cover`} label={article.coverLabel} className="min-h-64 rounded-[1.2rem]" sizes="(max-width: 768px) 100vw, 40vw" priority />
          </section>
          <section className="mx-auto mt-10 max-w-3xl"><ArticleContent content={article.content} /></section>
        </div>
      </article>
    </main>
  );
}
