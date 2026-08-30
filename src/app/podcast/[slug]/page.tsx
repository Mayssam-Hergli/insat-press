import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import PodcastContent from "@/components/podcast/PodcastContent";
import { getPublishedPodcastEpisodeBySlug } from "@/lib/data/podcastEpisodes";

type PodcastEpisodePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PodcastEpisodePage({
  params,
}: PodcastEpisodePageProps) {
  const { slug } = await params;
  const episode = await getPublishedPodcastEpisodeBySlug(slug);

  if (!episode) notFound();

  const date =
    episode.displayDate ??
    episode.releasedAt?.toLocaleDateString("en", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }) ??
    "";

  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <article className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/podcast"
            data-cursor-label="Back"
            className="text-sm font-black uppercase tracking-[0.18em] text-[var(--press-red)]"
          >
            ← Back to Podcast
          </Link>

          <section className="mt-8 grid gap-6 rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
            <div>
              <p className="text-sm font-bold text-[var(--muted)]">
                <span className="text-[var(--press-red)]">{episode.host}</span>{" "}
                · Guest: {episode.guest} · {date}
              </p>

              <h1 className="font-serif-display mt-4 text-5xl font-bold leading-[1.05] text-[var(--press-red)] md:text-6xl">
                {episode.title}
              </h1>

              <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-[var(--ink)]">
                {episode.description}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={episode.youtubeUrl}
                  data-cursor-label="YouTube"
                  className="btn-editorial btn-editorial-sm"
                >
                  YouTube
                </Link>

                <Link
                  href={episode.spotifyUrl}
                  data-cursor-label="Spotify"
                  className="btn-editorial btn-editorial-sm"
                >
                  Spotify
                </Link>
              </div>
            </div>

            <div className="flex min-h-64 items-center justify-center rounded-[1.2rem] border border-[var(--line)] bg-[var(--sand)]">
              {episode.coverImage ? (
                <img
                  src={episode.coverImage}
                  alt={episode.title}
                  className="h-full w-full rounded-[1.2rem] object-cover"
                />
              ) : (
                <span className="font-hand text-6xl font-bold text-[rgba(130,27,22,0.38)]">
                  {episode.coverLabel}
                </span>
              )}
            </div>
          </section>

          {/* Show notes */}
          <section className="mx-auto mt-10 max-w-3xl">
            <PodcastContent content={episode.content} />
          </section>
        </div>
      </article>
    </main>
  );
}
