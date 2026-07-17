import { ContentStatus, type Profile } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import { getAllWarnings } from "@/lib/admin/warnings";
import { getAllArticles } from "@/lib/data/articles";
import { getAllMediaCoverage } from "@/lib/data/mediaCoverage";
import { requireAuth } from "@/lib/auth/session";
import { isAdmin, sectionsForRole } from "@/lib/auth/permissions";
import StatusBadge from "@/components/admin/StatusBadge";
import ApprovalActions from "@/components/admin/ApprovalActions";
import Link from "next/link";

async function getPendingApprovals() {
  const [articles, media] = await Promise.all([
    getAllArticles({ status: ContentStatus.PENDING }),
    getAllMediaCoverage({ status: ContentStatus.PENDING }),
  ]);
  return { articles, media };
}

async function getDashboardStats() {
  const prisma = getPrisma();

  const [
    draftArticles,
    publishedArticles,
    archivedArticles,
    publishedEvents,
    mediaCoverageCount,
    podcastEpisodeCount,
    writerCount,
  ] = await Promise.all([
    prisma.article.count({ where: { status: ContentStatus.DRAFT } }),
    prisma.article.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.article.count({ where: { status: ContentStatus.ARCHIVED } }),
    prisma.event.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.mediaCoverage.count(),
    prisma.podcastEpisode.count(),
    prisma.profile.count({ where: { role: "WRITER" } }),
  ]);

  return {
    articles: {
      draft: draftArticles,
      published: publishedArticles,
      archived: archivedArticles,
    },
    publishedEvents,
    mediaCoverageCount,
    podcastEpisodeCount,
    writerCount,
  };
}

async function getRecentActivity() {
  const prisma = getPrisma();

  const [recentArticles, recentEvents, recentMedia, recentPodcasts] =
    await Promise.all([
      prisma.article.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, slug: true, status: true, updatedAt: true },
      }),
      prisma.event.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, slug: true, status: true, updatedAt: true },
      }),
      prisma.mediaCoverage.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, slug: true, status: true, updatedAt: true },
      }),
      prisma.podcastEpisode.findMany({
        take: 5,
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, slug: true, status: true, updatedAt: true },
      }),
    ]);

  return {
    articles: recentArticles,
    events: recentEvents,
    media: recentMedia,
    podcasts: recentPodcasts,
  };
}

function StatCard({
  title,
  value,
  href,
}: {
  title: string;
  value: number;
  href?: string;
}) {
  const content = (
    <div
      className={`paper-card rounded-[1.2rem] p-6 ${href ? "transition hover:-translate-y-1 hover:shadow-xl" : ""}`}
    >
      <div className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
        {title}
      </div>
      <div className="font-serif-display text-4xl font-bold text-[var(--ink)]">
        {value}
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export default async function AdminDashboard() {
  const profile = await requireAuth();

  // Writers and media staff get a focused view of their own submissions.
  if (!isAdmin(profile.role)) {
    return <ContributorDashboard profile={profile} />;
  }

  const [stats, recentActivity, warnings, pending] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getAllWarnings(),
    getPendingApprovals(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 font-serif-display text-3xl font-bold text-[var(--ink)]">
          Dashboard
        </h1>
        <p className="text-[var(--muted)]">
          Welcome to the INSAT Press admin panel. Here&apos;s an overview of your content.
        </p>
      </div>

      <PendingApprovalQueue articles={pending.articles} media={pending.media} />

      {/* Statistics Grid */}
      <div>
        <h2 className="mb-4 font-serif-display text-xl font-bold text-[var(--ink)]">
          Content Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Draft Articles"
            value={stats.articles.draft}
            href="/admin/articles"
          />
          <StatCard
            title="Published Articles"
            value={stats.articles.published}
            href="/admin/articles"
          />
          <StatCard
            title="Archived Articles"
            value={stats.articles.archived}
            href="/admin/articles"
          />
          <StatCard
            title="Published Events"
            value={stats.publishedEvents}
            href="/admin/events"
          />
          <StatCard
            title="Media Coverage"
            value={stats.mediaCoverageCount}
            href="/admin/media"
          />
          <StatCard
            title="Podcast Episodes"
            value={stats.podcastEpisodeCount}
            href="/admin/podcast"
          />
          <StatCard
            title="Writers"
            value={stats.writerCount}
            href="/admin/writers"
          />
        </div>
      </div>

      {/* Data Quality Warnings */}
      {warnings.length > 0 && (
        <div>
          <h2 className="mb-4 font-serif-display text-xl font-bold text-[var(--ink)]">
            Data Quality Warnings
          </h2>
          <div className="rounded-[1.2rem] border border-[var(--press-red)] bg-[rgba(130,27,22,0.06)] p-4">
            <div className="flex items-start mb-3">
              <svg
                className="h-6 w-6 text-[var(--press-red)] mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="flex-1">
                <h3 className="mb-1 font-serif-display text-lg font-bold text-[var(--ink)]">
                  {warnings.length} Issue{warnings.length !== 1 ? "s" : ""} Found
                </h3>
                <p className="mb-3 text-sm text-[var(--muted)]">
                  Please review and fix these data quality issues before deployment.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {warnings.slice(0, 10).map((warning, index) => (
                <div
                  key={`${warning.type}-${warning.id}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-[var(--line)] bg-[rgba(255,248,243,0.5)] p-3"
                >
                  <div>
                    <span className="mr-2 text-xs font-black uppercase text-[var(--press-red)]">
                      {warning.type}
                    </span>
                    <span className="text-sm font-bold text-[var(--ink)]">
                      {warning.title}
                    </span>
                    <p className="mt-1 text-sm text-[var(--muted)]">{warning.issue}</p>
                  </div>
                  <Link
                    href={warning.editUrl}
                    className="whitespace-nowrap text-sm font-bold text-[var(--press-red)] hover:underline"
                  >
                    Fix →
                  </Link>
                </div>
              ))}
              {warnings.length > 10 && (
                <p className="mt-2 text-center text-sm text-[var(--muted)]">
                  ... and {warnings.length - 10} more issue{warnings.length - 10 !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h2 className="mb-4 font-serif-display text-xl font-bold text-[var(--ink)]">
          Recent Activity
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Articles */}
          <div className="paper-card rounded-[1.2rem] p-5">
            <h3 className="mb-3 font-serif-display text-lg font-bold text-[var(--ink)]">
              Recent Articles
            </h3>
            <div className="space-y-3">
              {recentActivity.articles.map((article) => (
                <Link
                  key={article.id.toString()}
                  href={`/admin/articles/${article.id}/edit`}
                  className="block rounded-xl p-3 transition-colors hover:bg-[rgba(255,248,243,0.55)]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold text-[var(--ink)]">
                        {article.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Updated {new Date(article.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="ml-2 shrink-0">
                      <StatusBadge status={article.status} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Events */}
          <div className="paper-card rounded-[1.2rem] p-5">
            <h3 className="mb-3 font-serif-display text-lg font-bold text-[var(--ink)]">
              Recent Events
            </h3>
            <div className="space-y-3">
              {recentActivity.events.map((event) => (
                <Link
                  key={event.id.toString()}
                  href={`/admin/events/${event.id}/edit`}
                  className="block rounded-xl p-3 transition-colors hover:bg-[rgba(255,248,243,0.55)]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold text-[var(--ink)]">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Updated {new Date(event.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="ml-2 shrink-0">
                      <StatusBadge status={event.status} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Media Coverage */}
          <div className="paper-card rounded-[1.2rem] p-5">
            <h3 className="mb-3 font-serif-display text-lg font-bold text-[var(--ink)]">
              Recent Media Coverage
            </h3>
            <div className="space-y-3">
              {recentActivity.media.map((media) => (
                <Link
                  key={media.id.toString()}
                  href={`/admin/media/${media.id}/edit`}
                  className="block rounded-xl p-3 transition-colors hover:bg-[rgba(255,248,243,0.55)]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold text-[var(--ink)]">
                        {media.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Updated {new Date(media.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="ml-2 shrink-0">
                      <StatusBadge status={media.status} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Podcast Episodes */}
          <div className="paper-card rounded-[1.2rem] p-5">
            <h3 className="mb-3 font-serif-display text-lg font-bold text-[var(--ink)]">
              Recent Podcast Episodes
            </h3>
            <div className="space-y-3">
              {recentActivity.podcasts.map((podcast) => (
                <Link
                  key={podcast.id.toString()}
                  href={`/admin/podcast/${podcast.id}/edit`}
                  className="block rounded-xl p-3 transition-colors hover:bg-[rgba(255,248,243,0.55)]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-bold text-[var(--ink)]">
                        {podcast.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Updated {new Date(podcast.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="ml-2 shrink-0">
                      <StatusBadge status={podcast.status} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type QueueItem = { id: bigint; title: string };

function PendingApprovalQueue({
  articles,
  media,
}: {
  articles: QueueItem[];
  media: QueueItem[];
}) {
  const total = articles.length + media.length;
  if (total === 0) return null;

  return (
    <div>
      <h2 className="mb-4 font-serif-display text-xl font-bold text-[var(--ink)]">
        Pending Approval{" "}
        <span className="text-[var(--press-red)]">({total})</span>
      </h2>
      <div className="paper-card divide-y divide-[var(--line)] overflow-hidden rounded-[1.2rem]">
        {articles.map((item) => (
          <PendingRow
            key={`article-${item.id}`}
            kind="Article"
            title={item.title}
            section="articles"
            id={item.id.toString()}
          />
        ))}
        {media.map((item) => (
          <PendingRow
            key={`media-${item.id}`}
            kind="Media"
            title={item.title}
            section="media"
            id={item.id.toString()}
          />
        ))}
      </div>
    </div>
  );
}

function PendingRow({
  kind,
  title,
  section,
  id,
}: {
  kind: string;
  title: string;
  section: "articles" | "media";
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="min-w-0">
        <span className="mr-2 text-xs font-black uppercase text-[var(--press-red)]">
          {kind}
        </span>
        <Link
          href={`/admin/${section}/${id}/edit`}
          className="text-sm font-bold text-[var(--ink)] hover:underline"
        >
          {title}
        </Link>
      </div>
      <ApprovalActions section={section} id={id} />
    </div>
  );
}

async function ContributorDashboard({ profile }: { profile: Profile }) {
  const [section] = sectionsForRole(profile.role);
  const isArticles = section === "articles";
  const sectionLabel = isArticles ? "Articles" : "Media Coverage";

  const items: { id: bigint; title: string; status: ContentStatus }[] =
    isArticles
      ? await getAllArticles({ createdById: profile.id })
      : await getAllMediaCoverage({ createdById: profile.id });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 font-serif-display text-3xl font-bold text-[var(--ink)]">
            My {sectionLabel}
          </h1>
          <p className="text-[var(--muted)]">
            Create and manage your submissions. Posts go live once an admin
            approves them.
          </p>
        </div>
        <Link
          href={`/admin/${section}/new`}
          className="btn-editorial btn-editorial-sm"
        >
          New
        </Link>
      </div>

      <div className="paper-card overflow-hidden rounded-[1.2rem]">
        {items.length === 0 ? (
          <p className="p-6 text-sm text-[var(--muted)]">
            No submissions yet. Use “New” to create your first one.
          </p>
        ) : (
          <ul className="divide-y divide-[var(--line)]">
            {items.map((item) => (
              <li
                key={item.id.toString()}
                className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-[rgba(255,248,243,0.55)]"
              >
                <Link
                  href={`/admin/${section}/${item.id}/edit`}
                  className="truncate text-sm font-bold text-[var(--ink)] hover:underline"
                >
                  {item.title}
                </Link>
                <span className="shrink-0">
                  <StatusBadge status={item.status} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
