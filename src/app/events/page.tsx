import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import PageTitle from "@/components/shared/PageTitle";
import { getPublishedEvents } from "@/lib/data/events";

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <PageTitle title="Events" />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const date =
                event.displayDate ??
                event.startsAt?.toLocaleDateString("en", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }) ??
                "";

              return (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  data-cursor-label="Explore"
                  className="group overflow-hidden rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(33,25,22,0.08)]"
                >
                  <div className="flex h-40 items-center justify-center border-b border-[var(--line)] bg-[var(--sand)]">
                    <span className="font-hand text-5xl font-bold text-[rgba(130,27,22,0.36)]">
                      {event.coverLabel}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                      {event.type}
                    </p>

                    <h2 className="mt-3 text-2xl font-black leading-tight text-[var(--ink)] transition-colors group-hover:text-[var(--press-red)]">
                      {event.title}
                    </h2>

                    <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
                      {event.edition} · {date}
                    </p>

                    <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                      {event.description}
                    </p>

                    <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                      Learn more →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
