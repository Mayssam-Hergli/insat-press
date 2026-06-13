type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function PageHeader({
  eyebrow,
  title,
  description,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)] px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="mb-5 w-fit rounded-full border border-[var(--line)] bg-[rgba(255,248,243,0.35)] px-5 py-2 text-xs font-black uppercase tracking-[0.28em] text-[var(--press-red)]">
          {eyebrow}
        </p>

        <h1 className="font-serif-display max-w-4xl text-5xl font-bold leading-tight text-[var(--press-red)] md:text-7xl">
          {title}
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          {description}
        </p>
      </div>
    </section>
  );
}