import Navbar from "@/components/shared/Navbar";
import { events } from "@/data/events";

export default function EventsPage() {
  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
             <h1 className="font-serif-display bg-[linear-gradient(90deg,#821b16_0%,#9e2d27_35%,#b9433a_65%,#d2766c_100%)] bg-clip-text pb-3 text-5xl font-bold leading-[1.08] text-transparent md:text-6xl lg:text-7xl">
  Events
</h1>
            <div className="mt-4 h-[1px] w-full bg-[var(--line)]" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event.slug}
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
                    {event.edition} · {event.date}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                    {event.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}