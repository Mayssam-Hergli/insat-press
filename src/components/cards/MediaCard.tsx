import type { MediaCoverage } from "@/data/mediaCoverage";

type MediaCardProps = {
  item: MediaCoverage;
};

export default function MediaCard({ item }: MediaCardProps) {
  return (
    <a
      href={`/media/${item.slug}`}
      data-cursor-label="View"
      className="relative z-20 block overflow-hidden rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(33,25,22,0.08)]"
    >
      <div className="flex h-40 items-center justify-center border-b border-[var(--line)] bg-[var(--sand)]">
        <span className="font-hand text-5xl font-bold text-[rgba(130,27,22,0.36)]">
          {item.coverLabel}
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
          {item.type}
        </p>

        <h2 className="mt-3 text-2xl font-black leading-tight text-[var(--ink)] transition-colors hover:text-[var(--press-red)]">
          {item.title}
        </h2>

        <p className="mt-2 text-sm font-semibold text-[var(--muted)]">
          {item.eventName} · {item.date}
        </p>

        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          {item.description}
        </p>

        <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
          View coverage →
        </p>
      </div>
    </a>
  );
}