import Link from "next/link";
import { homeSections } from "@/data/home";

export default function FeaturedSections() {
  return (
    <section className="border-y border-[var(--line)] bg-[rgba(232,216,208,0.66)] px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
        {homeSections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            data-cursor-label={section.cursor}
            className="paper-card group rounded-[2rem] p-7 transition hover:-translate-y-1 hover:bg-[rgba(255,248,243,0.52)]"
          >
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--press-red)]">
              {section.eyebrow}
            </p>

            <h2 className="font-serif-display mt-5 text-4xl font-bold leading-none text-[var(--press-red)]">
              {section.title}
            </h2>

            <p className="mt-5 leading-7 text-[var(--muted)]">
              {section.description}
            </p>

            <p className="mt-7 font-bold text-[var(--press-red)]">
              {section.action} →
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}