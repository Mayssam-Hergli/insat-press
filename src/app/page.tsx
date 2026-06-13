import Link from "next/link";
import FloatingLetters from "@/components/FloatingLetters";
import Image from "next/image";

const navLinks = [
  { label: "Accueil", href: "/", cursor: "Home" },
  { label: "Writing", href: "/writing", cursor: "Read" },
  { label: "Media", href: "/media", cursor: "View" },
  { label: "Events", href: "/events", cursor: "Explore" },
  { label: "Podcast", href: "/podcast", cursor: "Listen" },
  { label: "About Us", href: "/about", cursor: "About" },
];

const sections = [
  {
    eyebrow: "Weekly publishing",
    title: "Writing",
    description:
      "Articles, reflections, opinions, interviews, and creative pieces written by INSAT Press voices.",
    href: "/writing",
    action: "Read articles",
    cursor: "Read",
  },
  {
    eyebrow: "Captured moments",
    title: "Media Coverage",
    description:
      "Photographed events, recent activities, albums, and visual stories from the club.",
    href: "/media",
    action: "View galleries",
    cursor: "View",
  },
  {
    eyebrow: "Yearly highlights",
    title: "Events",
    description:
      "Famous INSAT Press events throughout the year, with descriptions, archives, and memories.",
    href: "/events",
    action: "Explore events",
    cursor: "Explore",
  },
  {
    eyebrow: "On air",
    title: "Podcast",
    description:
      "Episodes with hosts, guests, conversations, YouTube links, and Spotify links.",
    href: "/podcast",
    action: "Listen now",
    cursor: "Listen",
  },
];

const articles = [
  {
    title: "The Voice Behind the Words",
    writer: "INSAT Press Writer",
    date: "Coming soon",
    description:
      "A first glimpse into the weekly editorial pieces that will shape the new digital identity of INSAT Press.",
  },
  {
    title: "Campus Stories",
    writer: "Writing Department",
    date: "Coming soon",
    description:
      "Stories, opinions, and reflections from the INSAT community, written with a creative editorial spirit.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen page-bg">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(239,226,217,0.88)] backdrop-blur-xl">
  <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
    <Link
      href="/"
      data-cursor-label="Home"
      className="flex items-center gap-3 text-2xl font-black tracking-tight text-[var(--ink)]"
    >
      <Image
        src="/insat-press-logo.png"
        alt="INSAT Press logo"
        width={36}
        height={36}
        className="h-10 w-10 object-contain"
        priority
      />

      <span>
        insat <span className="text-[var(--press-red)]">press</span>
      </span>
    </Link>

<div className="hidden items-center gap-8 text-sm font-bold text-[var(--muted)] md:flex">
  {navLinks.map((link) => (
    <Link
      key={link.href}
      href={link.href}
      data-cursor-label={link.cursor}
      className="text-[var(--muted)] transition-colors duration-200 hover:!text-[var(--press-red)]"    >
      {link.label}
    </Link>
  ))}
</div>

    <Link
      href="/join"
      data-cursor-label="Join"
      className="btn-editorial btn-editorial-sm"
    >
      Join Us
    </Link>
  </nav>
</header>

      <section className="relative overflow-hidden px-6 py-20 md:py-24">
  <FloatingLetters />

  <div className="relative mx-auto max-w-7xl">
    <p className="mx-auto mb-6 w-fit rounded-full border border-[var(--line)] bg-[rgba(255,248,243,0.35)] px-5 py-2 text-center text-xs font-black uppercase tracking-[0.28em] text-[var(--press-red)]">
  Writing · Photography · Design · Journalism
</p>

    <h1 className="font-serif-display max-w-6xl text-5xl font-bold leading-[1.04] tracking-tight text-[var(--ink)] md:text-7xl">
  The{" "}
  <span className="font-hand text-[1.2em] font-bold text-[var(--press-red)]">
    creative
  </span>{" "}
  <span className="text-[var(--press-red)]">voice</span> of INSAT.
</h1>

    <p className="mt-7 max-w-3xl text-lg leading-8 text-[var(--muted)]">
      INSAT Press is a creative platform for stories, photography,
      journalism, design, events, and podcasts. A space where students
      document, question, create, and express.
    </p>

   <div className="mt-10 flex flex-wrap gap-4">
  <Link href="/writing" data-cursor-label="Read" className="btn-editorial">
    Read Articles
  </Link>

  <Link href="/media" data-cursor-label="View" className="btn-editorial">
    Explore Media
  </Link>

  <Link href="/events" data-cursor-label="Explore" className="btn-editorial">
    Explore Events
  </Link>
</div>
  </div>
</section>


      <section className="border-y border-[var(--line)] bg-[rgba(232,216,208,0.66)] px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              data-cursor-label={section.cursor}
              className="paper-card group rounded-[2rem] p-7 transition hover:-translate-y-1 hover:bg-[rgba(255,248,243,0.52)]"
            >
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--press-red)]">
                {section.eyebrow}
              </p>

              <h2 className="font-serif-display mt-5 text-4xl font-bold leading-none text-[var(--press-red)]">
                {section.title}
              </h2>

              <p className="mt-5 leading-7 text-[var(--muted)]">
                {section.description}
              </p>

              <p className="mt-7 font-bold text-[var(--press-red)]">
                {section.action} →
              </p>
            </Link>
          ))}
        </div>
      </section>

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
            {articles.map((article) => (
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

      <section className="border-t border-[var(--line)] bg-[var(--paper-soft)] px-6 py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-[2rem] border border-[var(--line)] bg-[rgba(255,248,243,0.35)] p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--press-red)]">
              Join the story
            </p>

            <h2 className="font-serif-display mt-3 text-4xl font-bold text-[var(--press-red)]">
              Become part of INSAT Press.
            </h2>

            <p className="mt-3 max-w-2xl text-[var(--muted)]">
              Apply to join the club and choose the department that matches your
              creative energy.
            </p>
          </div>

          <Link href="/join" data-cursor-label="Join" className="btn-editorial">
  Join Us
</Link>
          
        </div>
      </section>
    </main>
  );
}