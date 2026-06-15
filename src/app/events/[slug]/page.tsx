import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/shared/Navbar";
import { events } from "@/data/events";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return events.map((event) => ({ slug: event.slug }));
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = events.find((e) => e.slug === slug);

  if (!event) notFound();

  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <article className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/events"
            data-cursor-label="Back"
            className="text-sm font-black uppercase tracking-[0.18em] text-[var(--press-red)]"
          >
            ← Back to Events
          </Link>

          <section className="mt-8 grid gap-6 rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-6 md:grid-cols-[1.1fr_0.9fr] md:p-8">
            <div>
              <p className="text-sm font-bold text-[var(--muted)]">
                <span className="text-[var(--press-red)]">{event.type}</span> ·{" "}
                {event.edition} · {event.date}
              </p>

              <h1 className="font-serif-display mt-4 text-5xl font-bold leading-[1.05] text-[var(--press-red)] md:text-6xl">
                {event.title}
              </h1>

              <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-[var(--ink)]">
                {event.description}
              </p>
            </div>

            <div className="flex min-h-64 items-center justify-center rounded-[1.2rem] border border-[var(--line)] bg-[var(--sand)]">
              {event.coverImage ? (
                <img
                  src={event.coverImage}
                  alt={event.title}
                  className="h-full w-full rounded-[1.2rem] object-cover"
                />
              ) : (
                <span className="font-hand text-6xl font-bold text-[rgba(130,27,22,0.38)]">
                  {event.coverLabel}
                </span>
              )}
            </div>
          </section>

          <section className="mx-auto mt-10 max-w-3xl space-y-6 text-lg leading-9 text-[var(--ink)]">
            {event.content.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </section>
        </div>
      </article>
    </main>
  );
}
