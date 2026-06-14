type PageTitleProps = {
  title: string;
};

export default function PageTitle({ title }: PageTitleProps) {
  return (
    <div className="mb-10">
      <h1 className="font-serif-display bg-[linear-gradient(90deg,#821b16_0%,#9e2d27_45%,#c45a50_75%,#d9877d_100%)] bg-clip-text pb-3 text-5xl font-bold leading-[1.08] text-transparent md:text-6xl lg:text-7xl">
        {title}
      </h1>

      <div className="mt-3 h-[1px] w-full bg-[var(--line)]" />
    </div>
  );
}