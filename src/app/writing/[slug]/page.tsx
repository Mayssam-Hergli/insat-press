import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import ArticleCoverImage from "@/components/articles/ArticleCoverImage";
import ArticleContent from "@/components/articles/ArticleContent";
import ArticleByline from "@/components/articles/ArticleByline";
import { getPublishedArticleBySlug } from "@/lib/data/articles";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const writers = article.writers.map(({ profile }) => profile);
  const date = article.displayDate ?? article.publishedAt?.toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" }) ?? "";
  const wordCount = typeof article.content === "string"
    ? article.content.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 220));

  return (
    <main className="min-h-screen page-bg">
      <Navbar />
      <article>
        <header className="px-5 pb-7 pt-8 md:px-10 md:pb-9 md:pt-10">
          <div className="mx-auto max-w-5xl">
            <Link href="/writing" className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--muted)] transition-colors hover:text-[var(--press-red)]">
              <span className="transition-transform group-hover:-translate-x-1">←</span> Writing department
            </Link>

            <div className="mt-8">
              <div className="flex flex-wrap items-center gap-3 text-xs font-black uppercase tracking-[0.16em]">
                <span className="rounded-md bg-[var(--press-red)] px-2.5 py-1.5 text-[var(--cream)]">{article.category}</span>
                <span className="text-[var(--muted)]">{readingTime} min read</span>
              </div>
              <h1 className="mt-5 max-w-4xl text-balance text-[clamp(2.35rem,5vw,4.5rem)] font-black leading-[1.06] tracking-[-0.04em] text-[var(--ink)]">
                {article.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg font-medium leading-8 text-[var(--muted)] md:text-xl">
                {article.description}
              </p>
              <div className="mt-7">
                {writers.length > 0 ? (
                  <ArticleByline writers={writers} />
                ) : (
                  <p className="text-sm"><span className="text-[var(--muted)]">By</span> <strong className="text-[var(--ink)]">INSAT Press</strong></p>
                )}
                {date && <p className="mt-3 text-xs font-black uppercase tracking-[0.14em] text-[var(--muted)]">{date}</p>}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 pb-12 md:px-10 md:pb-16">
          <figure>
            <ArticleCoverImage
              path={article.coverImage}
              alt={`${article.title} cover`}
              label={article.coverLabel}
              className="aspect-[16/9] w-full rounded-lg"
              sizes="(max-width: 1100px) 100vw, 1024px"
              priority
            />
            {article.coverLabel && <figcaption className="mt-2 text-right text-xs font-semibold italic text-[var(--muted)]">{article.coverLabel}</figcaption>}
          </figure>

          <div className="mx-auto mt-9 max-w-4xl md:mt-12">
          {article.sourceUrl && (
            <a href={article.sourceUrl} target="_blank" rel="noreferrer" className="mb-7 inline-block text-xs font-black uppercase tracking-[0.14em] text-[var(--press-red)] underline underline-offset-4">View original source ↗</a>
          )}
          <section><ArticleContent content={article.content} /></section>

          <footer className="mt-14 border-y border-[var(--line)] py-8 text-center md:mt-20">
            <p className="font-hand text-3xl font-bold text-[var(--press-red)]">Keep reading.</p>
            <Link href="/writing" className="btn-editorial mt-4">Explore more stories →</Link>
          </footer>
          </div>
        </div>
      </article>
    </main>
  );
}
