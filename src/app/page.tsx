import Link from "next/link";
import FloatingLetters from "@/components/FloatingLetters";
import Navbar from "@/components/shared/Navbar";
import { getPublishedArticles } from "@/lib/data/articles";

const sections = [
  {
    title: "Writing",
    description:
      "Weekly articles, creative pieces, opinions, interviews, and reflections from the INSAT community.",
    href: "/writing",
    label: "Read",
  },
  {
    title: "Media Coverage",
    description:
      "Captured moments, event recaps, and visual stories through the lens of INSAT Press.",
    href: "/media",
    label: "View",
  },
  {
    title: "Events",
    description:
      "Our major events, creative workshops, and recurring activities throughout the year.",
    href: "/events",
    label: "Explore",
  },
  {
    title: "Podcast",
    description:
      "Student conversations, campus voices, and stories told through audio and video.",
    href: "/podcast",
    label: "Listen",
  },
];

export default async function Home() {
  const publishedArticles = await getPublishedArticles({ take: 3 });
  const articles = publishedArticles.map((article) => ({
    title: article.title,
    category: article.category,
    href: `/writing/${article.slug}`,
  }));

  return (
    <main className="min-h-screen page-bg">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-20 md:px-12 lg:px-20">
        <FloatingLetters />

        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center text-center">
          <p className="mb-6 rounded-full border border-[var(--line)] bg-[rgba(255,248,243,0.35)] px-6 py-2 text-xs font-black uppercase tracking-[0.28em] text-[var(--press-red)]">
            Writing · Photography · Design · Journalism
          </p>

          <h1 className="font-serif-display max-w-5xl text-6xl font-bold leading-[0.95] text-[var(--ink)] md:text-8xl lg:text-9xl">
            The{" "}
            <span className="font-hand text-[var(--press-red)]">creative</span>{" "}
            <span className="text-[var(--press-red)]">voice</span> of INSAT.
          </h1>

          <p className="mt-8 max-w-2xl text-lg font-semibold leading-8 text-[var(--muted)] md:text-xl">
            INSAT Press is where stories, visuals, events, and student voices
            come together to document campus life with creativity and purpose.
          </p>

   
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="font-hand text-5xl font-bold leading-none text-[var(--press-red)]">
              What we create
            </p>

            <div className="mt-5 h-[1px] w-full bg-[var(--line)]" />
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => (
              <Link
                key={section.title}
                href={section.href}
                data-cursor-label={section.label}
                className="group rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)] p-6 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(33,25,22,0.08)]"
              >
                <h2 className="font-serif-display text-4xl font-bold leading-tight text-[var(--ink)] transition-colors group-hover:text-[var(--press-red)]">
                  {section.title}
                </h2>

                <p className="mt-4 text-sm font-semibold leading-7 text-[var(--muted)]">
                  {section.description}
                </p>

                <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                  {section.label} →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="font-hand text-5xl font-bold leading-none text-[var(--press-red)]">
              Latest writing
            </p>

            <div className="mt-5 h-[1px] w-full bg-[var(--line)]" />
          </div>

          <div className="overflow-hidden rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.28)]">
            {articles.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                data-cursor-label="Read"
                className="group block border-b border-[var(--line)] px-6 py-6 last:border-b-0 transition hover:bg-[rgba(255,248,243,0.38)] md:px-8"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--press-red)]">
                  {article.category}
                </p>

                <h3 className="mt-2 text-2xl font-black leading-tight text-[var(--ink)] transition-colors group-hover:text-[var(--press-red)] md:text-3xl">
                  {article.title}
                </h3>

                <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--press-red)]">
                  Read article →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,248,243,0.3)] p-8 text-center md:p-12">
          <p className="font-hand text-5xl font-bold leading-none text-[var(--press-red)]">
            Ready to be part of the story?
          </p>

          <h2 className="font-serif-display mx-auto mt-4 max-w-3xl text-4xl font-bold leading-tight text-[var(--ink)] md:text-5xl">
            Join INSAT Press and help shape the creative voice of campus.
          </h2>

          <div className="mt-8 flex justify-center">
            <Link href="/join" data-cursor-label="Join" className="btn-editorial">
              Join Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}