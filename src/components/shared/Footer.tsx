import Link from "next/link";

const footerLinks = [
  { label: "Writing", href: "/writing" },
  { label: "Media", href: "/media" },
  { label: "Events", href: "/events" },
  { label: "Podcast", href: "/podcast" },
  { label: "About Us", href: "/about" },
  { label: "Join Us", href: "/join" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[rgba(239,226,217,0.76)] px-6 py-10 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[var(--ink)]">
              insat <span className="text-[var(--press-red)]">press</span>
            </h2>

            <p className="mt-4 max-w-xl text-base font-semibold leading-7 text-[var(--muted)]">
              The creative voice of INSAT — writing, media coverage, design,
              journalism, and podcasting.
            </p>
          </div>

        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-[var(--line)] pt-5 text-sm font-semibold text-[var(--muted)] md:flex-row md:items-center md:justify-between">
          <p>© 2026 INSAT Press. All rights reserved.</p>
          <p>Made by Mayssam Hergli & Israa Soudani .</p>
        </div>
      </div>
    </footer>
  );
}