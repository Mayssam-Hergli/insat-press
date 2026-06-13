import Link from "next/link";

export default function JoinCTA() {
  return (
    <section className="border-t border-[var(--line)] bg-[var(--paper-soft)] px-6 py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.35)] p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--press-red)]">
            Join the story
          </p>

          <h2 className="font-serif-display mt-3 text-4xl font-bold text-[var(--press-red)]">
            Become part of INSAT Press.
          </h2>

          <p className="mt-3 max-w-2xl text-[var(--muted)]">
            Apply to join the club and choose the department that matches your
            creative energy.
          </p>
        </div>

        <Link href="/join" data-cursor-label="Join" className="btn-editorial">
          Join Us
        </Link>
      </div>
    </section>
  );
}