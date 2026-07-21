"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ArticleCoverImage from "@/components/articles/ArticleCoverImage";

export type WritingArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  coverImage: string | null;
  coverLabel: string | null;
  displayDate: string | null;
  publishedAt: string | null;
  writers: { name: string }[];
};

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .trim();

export default function WritingBrowser({ articles }: { articles: WritingArticle[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((article) => article.category.trim()).filter(Boolean)))],
    [articles],
  );

  const visibleArticles = useMemo(() => {
    const term = normalize(query);

    return articles.filter((article) => {
      const matchesCategory = category === "All" || article.category.trim() === category;
      const authors = article.writers.map(({ name }) => name).join(" ");
      const searchable = normalize(`${article.title} ${article.description} ${article.category} ${authors}`);

      return matchesCategory && (!term || searchable.includes(term));
    });
  }, [articles, category, query]);

  const hasFilters = Boolean(query.trim()) || category !== "All";
  const clearFilters = () => {
    setQuery("");
    setCategory("All");
  };

  return (
    <div>
      <div className="paper-card mb-8 rounded-[1.2rem] p-4 md:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="writing-search" className="sr-only">Search articles</label>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              id="writing-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === "Escape") setQuery(""); }}
              placeholder="Search stories, topics, or authors…"
              className="h-12 w-full appearance-none rounded-full border border-[var(--line)] bg-[rgba(255,248,243,0.72)] py-2 pl-12 pr-12 text-base text-[var(--ink)] outline-none transition placeholder:text-[var(--muted)] placeholder:opacity-70 focus:border-[var(--press-red)] focus:bg-[var(--cream)] focus:ring-3 focus:ring-[rgba(130,27,22,0.15)]"
            />
            {query && (
              <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-xl leading-none text-[var(--muted)] transition hover:bg-[rgba(130,27,22,0.08)] hover:text-[var(--press-red)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--press-red)]">
                ×
              </button>
            )}
          </div>
          {hasFilters && <button type="button" onClick={clearFilters} className="shrink-0 self-end text-xs font-black uppercase tracking-[0.12em] text-[var(--press-red)] underline underline-offset-4 sm:self-auto">Reset</button>}
        </div>

        <div className="hide-scrollbar mt-4 flex gap-2 overflow-x-auto border-t border-[var(--line)] pt-4 pb-1">
          {categories.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${category === item ? "border-[var(--press-red)] bg-[var(--press-red)] text-[var(--cream)]" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--press-red)] hover:text-[var(--press-red)]"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="mb-4 text-sm font-semibold text-[var(--muted)]">{visibleArticles.length} {visibleArticles.length === 1 ? "story" : "stories"}{hasFilters ? " found" : " published"}</p>
      {visibleArticles.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleArticles.map((article) => {
            const writers = article.writers.map(({ name }) => name).join(", ") || "INSAT Press";
            const date = article.displayDate ?? (article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" }) : "");

            return (
              <Link key={article.slug} href={`/writing/${article.slug}`} data-cursor-label="Read" className="group overflow-hidden rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(33,25,22,0.08)]">
                <ArticleCoverImage path={article.coverImage} alt={`${article.title} cover`} label={article.coverLabel} className="h-52 w-full rounded-none border-0 transition-transform duration-300 group-hover:scale-[1.02]" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--press-red)]">{article.category}</p>
                  <h2 className="mt-2 text-2xl font-black leading-tight text-[var(--ink)] transition-colors group-hover:text-[var(--press-red)]">{article.title}</h2>
                  <p className="mt-2 text-xs font-semibold text-[var(--muted)]">{writers}{date && ` · ${date}`}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-[var(--muted)]">{article.description}</p>
                  <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-[var(--press-red)]">Read story →</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[1.2rem] border border-dashed border-[var(--line)] px-6 py-16 text-center">
          <p className="font-serif-display text-2xl font-bold text-[var(--ink)]">No stories found</p>
          <button type="button" onClick={clearFilters} className="mt-4 text-sm font-black text-[var(--press-red)] underline underline-offset-4">Clear filters</button>
        </div>
      )}
    </div>
  );
}
