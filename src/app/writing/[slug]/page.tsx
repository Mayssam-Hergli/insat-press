import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { articles } from "@/data/articles";

type ArticleDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ArticleDetailsPage({
  params,
}: ArticleDetailsPageProps) {
  const { slug } = await params;

  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <article className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/writing"
            data-cursor-label="Back"
            className="text-sm font-black uppercase tracking-[0.18em] text-[var(--press-red)]"
          >
            ← Back to Writing
          </Link>

          <header className="mt-10 border-b border-[var(--line)] pb-10">
            <p className="text-sm font-bold text-[var(--muted)]">
              <span className="text-[var(--press-red)]">{article.category}</span>{" "}
              · {article.writer} · {article.date}
            </p>

            <h1 className="font-serif-display mt-5 text-5xl font-bold leading-[1.05] text-[var(--press-red)] md:text-7xl">
              {article.title}
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)] md:text-xl">
              {article.description}
            </p>
          </header>

          <div className="my-10 flex h-64 items-center justify-center rounded-[1.5rem] border border-[var(--line)] bg-[var(--sand)] md:h-80">
            <p className="font-hand text-6xl font-bold text-[rgba(130,27,22,0.35)] md:text-7xl">
              {article.coverLabel}
            </p>
          </div>

          <section className="mx-auto max-w-3xl space-y-7 text-lg leading-9 text-[var(--ink)]">
            {article.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>
        </div>
      </article>
    </main>
  );
}