import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import MediaCoverageContent from "@/components/media/MediaCoverageContent";
import MediaImage from "@/components/media/MediaImage";
import MediaCarousel from "@/components/media/MediaCarousel";
import { getPublishedMediaCoverageBySlug } from "@/lib/data/mediaCoverage";

type MediaDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};


export default async function MediaDetailsPage({
  params,
}: MediaDetailsPageProps) {
  const { slug } = await params;

  const item = await getPublishedMediaCoverageBySlug(slug);

  if (!item) {
    notFound();
  }

  const displayDate =
    item.displayDate ??
    item.publishedAt?.toLocaleDateString("en", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const galleryImages = item.gallery.map((image) => ({
    id: image.id.toString(),
    src: image.src,
    alt: image.alt,
    label: image.label,
    caption: image.caption,
  }));

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
                {item.eventName} · {displayDate}
              </p>

              <h1 className="font-serif-display mt-4 text-5xl font-bold leading-[1.05] text-[var(--press-red)] md:text-6xl">
                {item.title}
              </h1>

              <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-[var(--ink)]">
                {item.description}
              </p>
            </div>

            <MediaImage
              path={item.coverImage}
              alt={item.title}
              label={item.coverLabel ?? item.title}
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="min-h-64 rounded-[1.2rem]"
            />
          </section>

          <section className="mx-auto mt-10 max-w-3xl">
            <MediaCoverageContent content={item.content} />
          </section>

          {galleryImages.length > 0 && <MediaCarousel images={galleryImages} />}
        </div>
      </article>
    </main>
  );
}