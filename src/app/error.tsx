"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center page-bg px-5 text-center">
      <span className="rounded-md bg-[var(--press-red)] px-2.5 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[var(--cream)]">
        Error
      </span>
      <h1 className="mt-6 text-balance text-[clamp(2rem,4.5vw,3.5rem)] font-black leading-[1.06] tracking-[-0.04em] text-[var(--ink)]">
        Something went wrong.
      </h1>
      <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-[var(--muted)]">
        This page hit an unexpected error. You can try again, or head back to the front page.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="btn-editorial"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-xs font-black uppercase tracking-[0.2em] text-[var(--press-red)] transition-colors hover:text-[var(--ink)]"
        >
          ← Back to the front page
        </Link>
      </div>
    </div>
  );
}
