import { ContentStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import { getAllWarnings } from "@/lib/admin/warnings";
import Link from "next/link";

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
    prisma.writer.count(),
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
  color = "blue",
}: {
  title: string;
  value: number;
  href?: string;
  color?: "blue" | "green" | "yellow" | "gray" | "purple" | "pink";
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    gray: "bg-gray-50 text-gray-700 border-gray-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    pink: "bg-pink-50 text-pink-700 border-pink-200",
  };

  const content = (
    <div
      className={`p-6 rounded-lg border-2 ${colorClasses[color]} ${href ? "hover:shadow-md transition-shadow cursor-pointer" : ""}`}
    >
      <div className="text-sm font-medium uppercase tracking-wider mb-2">
        {title}
      </div>
      <div className="text-4xl font-bold">{value}</div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export default async function AdminDashboard() {
  const [stats, recentActivity, warnings] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
    getAllWarnings(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to the INSAT Press admin panel. Here's an overview of your content.
        </p>
      </div>

      {/* Statistics Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Draft Articles"
            value={stats.articles.draft}
            href="/admin/articles"
            color="yellow"
          />
          <StatCard
            title="Published Articles"
            value={stats.articles.published}
            href="/admin/articles"
            color="green"
          />
          <StatCard
            title="Archived Articles"
            value={stats.articles.archived}
            href="/admin/articles"
            color="gray"
          />
          <StatCard
            title="Published Events"
            value={stats.publishedEvents}
            href="/admin/events"
            color="purple"
          />
          <StatCard
            title="Media Coverage"
            value={stats.mediaCoverageCount}
            href="/admin/media"
            color="pink"
          />
          <StatCard
            title="Podcast Episodes"
            value={stats.podcastEpisodeCount}
            href="/admin/podcast"
            color="blue"
          />
          <StatCard
            title="Writers"
            value={stats.writerCount}
            href="/admin/writers"
            color="blue"
          />
        </div>
      </div>

      {/* Data Quality Warnings */}
      {warnings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Data Quality Warnings
          </h2>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="flex items-start mb-3">
              <svg
                className="h-6 w-6 text-yellow-600 mr-2"
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
                <h3 className="text-lg font-semibold text-yellow-900 mb-1">
                  {warnings.length} Issue{warnings.length !== 1 ? "s" : ""} Found
                </h3>
                <p className="text-sm text-yellow-800 mb-3">
                  Please review and fix these data quality issues before deployment.
                </p>
              </div>
            </div>
            <div className="space-y-2">
              {warnings.slice(0, 10).map((warning) => (
                <div
                  key={`${warning.type}-${warning.id}`}
                  className="bg-white rounded border border-yellow-300 p-3 flex justify-between items-center"
                >
                  <div>
                    <span className="text-xs font-medium text-gray-500 uppercase mr-2">
                      {warning.type}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {warning.title}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">{warning.issue}</p>
                  </div>
                  <Link
                    href={warning.editUrl}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap"
                  >
                    Fix →
                  </Link>
                </div>
              ))}
              {warnings.length > 10 && (
                <p className="text-sm text-yellow-800 text-center mt-2">
                  ... and {warnings.length - 10} more issue{warnings.length - 10 !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Articles */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Recent Articles
            </h3>
            <div className="space-y-3">
              {recentActivity.articles.map((article) => (
                <Link
                  key={article.id.toString()}
                  href={`/admin/articles/${article.id}/edit`}
                  className="block p-3 rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Updated {new Date(article.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                        article.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : article.status === "DRAFT"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {article.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Recent Events
            </h3>
            <div className="space-y-3">
              {recentActivity.events.map((event) => (
                <Link
                  key={event.id.toString()}
                  href={`/admin/events/${event.id}/edit`}
                  className="block p-3 rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Updated {new Date(event.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                        event.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : event.status === "DRAFT"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Media Coverage */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Recent Media Coverage
            </h3>
            <div className="space-y-3">
              {recentActivity.media.map((media) => (
                <Link
                  key={media.id.toString()}
                  href={`/admin/media/${media.id}/edit`}
                  className="block p-3 rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {media.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Updated {new Date(media.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                        media.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : media.status === "DRAFT"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {media.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Podcast Episodes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Recent Podcast Episodes
            </h3>
            <div className="space-y-3">
              {recentActivity.podcasts.map((podcast) => (
                <Link
                  key={podcast.id.toString()}
                  href={`/admin/podcast/${podcast.id}/edit`}
                  className="block p-3 rounded hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {podcast.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Updated {new Date(podcast.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                        podcast.status === "PUBLISHED"
                          ? "bg-green-100 text-green-800"
                          : podcast.status === "DRAFT"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {podcast.status}
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
