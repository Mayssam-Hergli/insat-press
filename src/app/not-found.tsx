import Link from "next/link";
import Navbar from "@/components/shared/Navbar";

export default function NotFound() {
  return (
    <main className="min-h-screen page-bg">
      <Navbar />
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-24 text-center md:py-32">
        <span className="rounded-md bg-[var(--press-red)] px-2.5 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[var(--cream)]">
          404
        </span>
        <h1 className="mt-6 text-balance text-[clamp(2.35rem,5vw,4.5rem)] font-black leading-[1.06] tracking-[-0.04em] text-[var(--ink)]">
          This story doesn&apos;t exist.
        </h1>
        <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-[var(--muted)]">
          The page you're looking for was moved, renamed, or never published.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[var(--press-red)] transition-colors hover:text-[var(--ink)]"
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span> Back to the front page
        </Link>
      </div>
    </main>
  );
}
