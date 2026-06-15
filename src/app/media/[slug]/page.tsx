import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { mediaCoverage } from "@/data/mediaCoverage";

type MediaDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return mediaCoverage.map((item) => ({
    slug: item.slug,
  }));
}

export default async function MediaDetailsPage({
  params,
}: MediaDetailsPageProps) {
  const { slug } = await params;

  const item = mediaCoverage.find((coverage) => coverage.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <article className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/media"
            data-cursor-label="Back"
            className="text-sm font-black uppercase tracking-[0.18em] text-[var(--press-red)]"
          >
            ← Back to Media
          </Link>

          <section className="mt-8 grid gap-6 rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
            <div>
              <p className="text-sm font-bold text-[var(--muted)]">
                <span className="text-[var(--press-red)]">{item.type}</span> ·{" "}
                {item.eventName} · {item.date}
              </p>

              <h1 className="font-serif-display mt-4 text-5xl font-bold leading-[1.05] text-[var(--press-red)] md:text-6xl">
                {item.title}
              </h1>

              <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-[var(--ink)]">
                {item.description}
              </p>
            </div>

            <div className="flex min-h-64 items-center justify-center rounded-[1.2rem] border border-[var(--line)] bg-[var(--sand)]">
              {item.coverImage ? (
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="h-full w-full rounded-[1.2rem] object-cover"
                />
              ) : (
                <span className="font-hand text-6xl font-bold text-[rgba(130,27,22,0.38)]">
                  {item.coverLabel}
                </span>
              )}
            </div>
          </section>

          <section className="mx-auto mt-10 max-w-3xl space-y-6 text-lg leading-9 text-[var(--ink)]">
            {item.content.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </section>

          <section className="mt-12 rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-5 md:p-7">
            <div className="mb-5">
              <p className="font-hand text-5xl font-bold leading-none text-[var(--press-red)]">
                Gallery
              </p>

              <p className="mt-2 text-base font-semibold text-[var(--ink)]">
                Swipe or scroll through {item.gallery.length} photos
              </p>
            </div>
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {item.gallery.map((image, index) => (
                <div
                  key={image.id}
                  className="relative flex h-[24rem] min-w-full snap-center items-center justify-center rounded-[1.2rem] border border-[var(--line)] bg-[var(--sand)] md:h-[32rem]"
                >
                  {image.src ? (
                    <img
                      src={image.src}
                      alt={image.alt ?? image.label}
                      className="h-full w-full rounded-[1.2rem] object-cover"
                    />
                  ) : (
                    <span className="font-hand text-6xl font-bold text-[rgba(130,27,22,0.38)] md:text-7xl">
                      {image.label}
                    </span>
                  )}

                  <div className="absolute bottom-4 right-4 rounded-full border border-[var(--line)] bg-[rgba(255,248,243,0.72)] px-4 py-2 text-sm font-black text-[var(--press-red)] backdrop-blur">
                    {index + 1} / {item.gallery.length}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>
    </main>
  );
}