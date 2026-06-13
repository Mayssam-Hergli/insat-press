import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { podcasts } from "@/data/podcasts";

export default function PodcastPage() {
  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="font-serif-display bg-[linear-gradient(90deg,#821b16_0%,#9e2d27_35%,#b9433a_65%,#d2766c_100%)] bg-clip-text pb-3 text-5xl font-bold leading-[1.08] text-transparent md:text-6xl lg:text-7xl">
              Podcast
            </h1>

            <div className="mt-4 h-[1px] w-full bg-[var(--line)]" />
          </div>

          <div className="overflow-hidden rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)]">
            {podcasts.map((episode) => (
              <article
                key={episode.slug}
                className="flex flex-col gap-5 border-b border-[var(--line)] px-5 py-5 last:border-b-0 md:flex-row md:items-center md:px-7"
              >
                <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--sand)] md:w-36">
                  <span className="font-hand text-4xl font-bold text-[rgba(130,27,22,0.38)]">
                    {episode.coverLabel}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[var(--muted)]">
                    <span className="font-bold text-[var(--press-red)]">
                      {episode.host}
                    </span>{" "}
                    · Guest: {episode.guest} · {episode.date}
                  </p>

                  <h2 className="mt-2 text-2xl font-black leading-tight text-[var(--ink)] md:text-[1.7rem]">
                    {episode.title}
                  </h2>

                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                    {episode.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
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
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}