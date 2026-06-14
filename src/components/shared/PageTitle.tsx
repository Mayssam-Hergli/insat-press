type PageTitleProps = {
  title: string;
};

export default function PageTitle({ title }: PageTitleProps) {
  return (
    <div className="mb-10">
      <h1 className="gradient-title font-serif-display pb-3 text-5xl font-bold leading-[1.08] md:text-6xl lg:text-7xl">
        {title}
      </h1>

      <div className="mt-4 h-[1px] w-full bg-[var(--line)]" />
    </div>
  );
}