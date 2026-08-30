const base =
  "inline-flex rounded-full px-2.5 py-0.5 text-xs font-black uppercase tracking-[0.14em]";

function variantFor(status: string): string {
  switch (status) {
    case "PUBLISHED":
      return "bg-[var(--press-red)] text-[var(--cream)]";
    case "PENDING":
      return "border border-[var(--press-red)] bg-[rgba(130,27,22,0.08)] text-[var(--press-red)]";
    case "DRAFT":
      return "bg-[var(--sand)] text-[var(--ink)]";
    default:
      return "border border-[var(--line)] text-[var(--muted)]";
  }
}

export default function StatusBadge({ status }: { status: string }) {
  return <span className={`${base} ${variantFor(status)}`}>{status}</span>;
}
