export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center page-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--press-red)]" />
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--muted)]">
          Loading…
        </p>
      </div>
    </div>
  );
}
