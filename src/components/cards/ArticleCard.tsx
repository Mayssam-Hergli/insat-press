import type { ArticleWithWriters } from "@/lib/data/articles";
import ArticleCoverImage from "@/components/articles/ArticleCoverImage";

type ArticleCardProps = {
  article: ArticleWithWriters;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const writerNames = article.writers
    .map(
      (articleWriter) =>
        articleWriter.profile.fullName ?? articleWriter.profile.email
    )
    .join(", ");
  const displayWriter = writerNames || "INSAT Press";
  const displayDate =
    article.displayDate ??
    article.publishedAt?.toLocaleDateString("en", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) ??
    "Coming soon";

  return (
    <a
      href={`/writing/${article.slug}`}
      data-cursor-label="Read"
      className="relative z-20 block border-b border-[var(--line)] last:border-b-0 transition hover:bg-[rgba(255,248,243,0.38)]"
    >
      <article className="flex items-center gap-5 px-5 py-4 md:px-7">
        <div className="min-w-0 flex-1">
          <p className="text-[0.78rem] font-semibold text-[var(--muted)]">
            <span className="font-bold text-[var(--press-red)]">
              {article.category}
            </span>{" "}
            · {displayWriter} · {displayDate}
          </p>

          <h2 className="mt-1.5 max-w-3xl text-2xl font-black leading-tight text-[var(--ink)] transition-colors hover:text-[var(--press-red)] md:text-[1.7rem]">
            {article.title}
          </h2>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--muted)]">
            {article.description}
          </p>

          <p className="mt-3 text-[0.7rem] font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
            Read article →
          </p>
        </div>

        <ArticleCoverImage
          path={article.coverImage}
          alt={`${article.title} cover`}
          label={article.coverLabel}
          className="hidden h-20 w-32 shrink-0 rounded-xl md:block"
          sizes="128px"
        />
      </article>
    </a>
  );
}
