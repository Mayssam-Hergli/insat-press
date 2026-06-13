import Link from "next/link";
import { latestArticles } from "@/data/home";

export default function LatestWriting() {
  return (
    <section className="subtle-pattern px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--press-red)]">
              Latest Writing
            </p>

            <h2 className="font-serif-display mt-3 text-5xl font-bold leading-none text-[var(--press-red)]">
              Fresh from the press
            </h2>
          </div>

          <Link
            href="/writing"
            data-cursor-label="Read"
            className="hidden font-bold text-[var(--press-red)] md:block"
          >
            View all articles →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {latestArticles.map((article) => (
            <Link
              key={article.title}
              href="/writing"
              data-cursor-label="Read"
              className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--paper-soft)] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(33,25,22,0.08)]"
            >
              <div className="flex h-44 items-center justify-center border-b border-[var(--line)] bg-[var(--sand)]">
                <p className="font-hand text-6xl font-bold text-[rgba(130,27,22,0.33)]">
                  press
                </p>
              </div>

              <div className="p-7">
                <p className="text-sm font-medium text-[var(--muted)]">
                  {article.writer} · {article.date}
                </p>

                <h3 className="font-serif-display mt-4 text-4xl font-bold leading-tight text-[var(--press-red)]">
                  {article.title}
                </h3>

                <p className="mt-4 leading-7 text-[var(--muted)]">
                  {article.description}
                </p>

                <p className="mt-7 inline-block font-bold text-[var(--press-red)]">
                  Read more →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}