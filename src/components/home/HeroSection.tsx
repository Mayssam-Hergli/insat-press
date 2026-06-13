import Link from "next/link";
import FloatingLetters from "@/components/FloatingLetters";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-24">
      <FloatingLetters />

      <div className="relative mx-auto max-w-7xl">
        <p className="mx-auto mb-6 w-fit rounded-full border border-[var(--line)] bg-[rgba(255,248,243,0.35)] px-5 py-2 text-center text-xs font-black uppercase tracking-[0.28em] text-[var(--press-red)]">
          Writing · Photography · Design · Journalism
        </p>

        <h1 className="font-serif-display max-w-6xl text-5xl font-bold leading-[1.04] tracking-tight text-[var(--ink)] md:text-7xl">
          The{" "}
          <span className="font-hand text-[1.2em] font-bold text-[var(--press-red)]">
            creative
          </span>{" "}
          <span className="text-[var(--press-red)]">voice</span> of INSAT.
        </h1>

        <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          INSAT Press is a creative platform for stories, photography,
          journalism, design, events, and podcasts. A space where students
          document, question, create, and express.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/writing" data-cursor-label="Read" className="btn-editorial">
            Read Articles
          </Link>

          <Link href="/media" data-cursor-label="View" className="btn-editorial">
            Explore Media
          </Link>

          <Link
            href="/events"
            data-cursor-label="Explore"
            className="btn-editorial"
          >
            Explore Events
          </Link>
        </div>
      </div>
    </section>
  );
}