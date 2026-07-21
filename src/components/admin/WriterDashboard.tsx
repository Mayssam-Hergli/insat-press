import Link from "next/link";
import type { ContentStatus, Profile } from "@/generated/prisma/client";
import ArticleCoverImage from "@/components/articles/ArticleCoverImage";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  getAllArticles,
  type ArticleWithContributors,
} from "@/lib/data/articles";

type WriterDashboardProps = {
  profile: Profile;
};

const STATUS_COPY: Record<
  ContentStatus,
  { eyebrow: string; title: string; description: string }
> = {
  DRAFT: {
    eyebrow: "In progress",
    title: "Drafts",
    description: "Keep shaping these stories before you send them to the desk.",
  },
  PENDING: {
    eyebrow: "With the editors",
    title: "Awaiting review",
    description: "These submissions are locked while an admin reviews them.",
  },
  PUBLISHED: {
    eyebrow: "Now live",
    title: "Published",
    description: "Your finished stories, ready for the INSAT community to read.",
  },
  ARCHIVED: {
    eyebrow: "History",
    title: "Archived",
    description: "Previous submissions kept here for your records.",
  },
};

const STATUS_ORDER: ContentStatus[] = [
  "DRAFT",
  "PENDING",
  "PUBLISHED",
  "ARCHIVED",
];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function FirstName({ profile }: { profile: Profile }) {
  const name = profile.fullName?.trim().split(/\s+/)[0];
  return <>{name || "Writer"}</>;
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.25rem] border border-[var(--line)] bg-[rgba(255,248,243,0.45)] p-5 text-[var(--ink)] shadow-[0_16px_40px_rgba(33,25,22,0.05)]">
      <span
        className="absolute -right-3 -top-7 font-serif-display text-8xl font-bold text-[rgba(130,27,22,0.045)]"
        aria-hidden="true"
      >
        {value}
      </span>
      <p className="relative text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </p>
      <p className="relative mt-3 font-serif-display text-4xl font-bold">
        {value}
      </p>
    </div>
  );
}

function ArticleActions({ article }: { article: ArticleWithContributors }) {
  const id = article.id.toString();

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold">
      <Link
        href={`/admin/articles/${id}/preview`}
        className="text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
      >
        Preview
      </Link>

      {article.status === "DRAFT" && (
        <Link
          href={`/admin/articles/${id}/edit`}
          className="text-[var(--press-red)] hover:underline"
        >
          Continue writing →
        </Link>
      )}

      {article.status === "PUBLISHED" && (
        <Link
          href={`/writing/${article.slug}`}
          className="text-[var(--press-red)] hover:underline"
        >
          Read live →
        </Link>
      )}

      {article.status === "PENDING" && (
        <span className="font-normal text-[var(--muted)]">Locked for review</span>
      )}
    </div>
  );
}

function ArticleCard({ article }: { article: ArticleWithContributors }) {
  return (
    <article className="group grid overflow-hidden rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.36)] transition duration-200 hover:-translate-y-0.5 hover:bg-[rgba(255,248,243,0.62)] hover:shadow-[0_18px_45px_rgba(33,25,22,0.08)] sm:grid-cols-[9rem_1fr]">
      <ArticleCoverImage
        path={article.coverImage}
        alt={`${article.title} cover`}
        label={article.coverLabel}
        className="h-40 w-full rounded-none border-0 sm:h-full sm:min-h-40"
        sizes="(max-width: 640px) 100vw, 144px"
      />
      <div className="flex min-w-0 flex-col justify-between gap-5 p-5">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={article.status} />
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
              {article.category}
            </span>
          </div>
          <h3 className="font-serif-display text-2xl font-bold leading-tight text-[var(--ink)] transition-colors group-hover:text-[var(--press-red)]">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
            {article.description}
          </p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-3 border-t border-[var(--line)] pt-4">
          <p className="text-xs text-[var(--muted)]">
            Updated {formatDate(article.updatedAt)}
          </p>
          <ArticleActions article={article} />
        </div>
      </div>
    </article>
  );
}

function ArticleSection({
  status,
  articles,
}: {
  status: ContentStatus;
  articles: ArticleWithContributors[];
}) {
  if (articles.length === 0) return null;
  const copy = STATUS_COPY[status];

  return (
    <section aria-labelledby={`writer-${status.toLowerCase()}`}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--press-red)]">
            {copy.eyebrow}
          </p>
          <h2
            id={`writer-${status.toLowerCase()}`}
            className="mt-1 font-serif-display text-3xl font-bold text-[var(--ink)]"
          >
            {copy.title}
            <span className="ml-2 text-xl text-[var(--muted)]">
              {articles.length}
            </span>
          </h2>
        </div>
        <p className="max-w-lg text-sm text-[var(--muted)]">{copy.description}</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.id.toString()} article={article} />
        ))}
      </div>
    </section>
  );
}

function EmptyWriterState() {
  return (
    <div className="paper-card relative overflow-hidden rounded-[1.5rem] px-6 py-16 text-center">
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif-display text-[12rem] font-bold leading-none text-[rgba(130,27,22,0.035)]"
        aria-hidden="true"
      >
        Aa
      </span>
      <div className="relative mx-auto max-w-lg">
        <p className="font-hand text-2xl font-bold text-[var(--press-red)]">
          A blank page is an invitation.
        </p>
        <h2 className="mt-3 font-serif-display text-3xl font-bold text-[var(--ink)]">
          Your first story starts here
        </h2>
        <p className="mt-3 leading-7 text-[var(--muted)]">
          Create a draft, develop your idea, and submit it when it is ready for
          the editorial desk.
        </p>
        <Link href="/admin/articles/new" className="btn-editorial mt-7">
          Start writing
        </Link>
      </div>
    </div>
  );
}

export default async function WriterDashboard({
  profile,
}: WriterDashboardProps) {
  const articles = await getAllArticles({ createdById: profile.id });
  const grouped = Object.fromEntries(
    STATUS_ORDER.map((status) => [
      status,
      articles.filter((article) => article.status === status),
    ])
  ) as Record<ContentStatus, ArticleWithContributors[]>;

  return (
    <div className="space-y-10">
      <section className="paper-card relative isolate overflow-hidden rounded-[1.75rem] px-6 py-9 text-[var(--ink)] sm:px-9 lg:px-12 lg:py-12">
        <div
          className="absolute inset-0 -z-10 opacity-60 [background-image:linear-gradient(rgba(130,27,22,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(130,27,22,.035)_1px,transparent_1px)] [background-size:42px_42px]"
          aria-hidden="true"
        />
        <div
          className="absolute -left-24 -top-28 -z-10 h-72 w-72 rounded-full bg-[rgba(255,248,243,0.55)] blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -right-10 -top-24 -z-10 font-serif-display text-[18rem] font-bold leading-none text-[rgba(130,27,22,0.045)]"
          aria-hidden="true"
        >
          W
        </div>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--press-red)]">
              The writer&apos;s room
            </p>
            <h1 className="mt-3 font-serif-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Welcome back, <FirstName profile={profile} />.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Follow every story from its first draft to publication. Your next
              idea deserves a place on the page.
            </p>
          </div>
          <Link
            href="/admin/articles/new"
            className="btn-editorial shrink-0"
          >
            <span aria-hidden="true">＋</span>
            New article
          </Link>
        </div>
      </section>

      <section aria-label="Article overview" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Drafts" value={grouped.DRAFT.length} />
        <StatCard label="In review" value={grouped.PENDING.length} />
        <StatCard label="Published" value={grouped.PUBLISHED.length} />
        <StatCard label="All stories" value={articles.length} />
      </section>

      <section className="paper-card rounded-[1.35rem] p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
              Editorial journey
            </p>
            <h2 className="mt-1 font-serif-display text-2xl font-bold text-[var(--ink)]">
              From idea to front page
            </h2>
          </div>
          <ol className="grid grid-cols-3 overflow-hidden rounded-xl border border-[var(--line)] text-center text-xs font-black uppercase tracking-[0.12em]">
            <li className="bg-[rgba(255,248,243,0.5)] px-2 py-3 text-[var(--ink)]">
              1. Draft
            </li>
            <li className="border-x border-[var(--line)] bg-[rgba(255,248,243,0.5)] px-2 py-3 text-[var(--ink)]">
              2. Review
            </li>
            <li className="bg-[rgba(255,248,243,0.5)] px-2 py-3 text-[var(--ink)]">
              3. Published
            </li>
          </ol>
        </div>
      </section>

      {articles.length === 0 ? (
        <EmptyWriterState />
      ) : (
        <div className="space-y-12">
          {STATUS_ORDER.map((status) => (
            <ArticleSection
              key={status}
              status={status}
              articles={grouped[status]}
            />
          ))}
        </div>
      )}

      {articles.length > 0 && (
        <div className="flex justify-center border-t border-[var(--line)] pt-8">
          <Link href="/admin/articles" className="btn-editorial btn-editorial-sm">
            Open full article library
          </Link>
        </div>
      )}
    </div>
  );
}
