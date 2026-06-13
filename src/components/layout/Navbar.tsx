import Image from "next/image";
import Link from "next/link";
import { navLinks } from "@/data/home";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(239,226,217,0.88)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          data-cursor-label="Home"
          className="flex items-center gap-3 text-2xl font-black tracking-tight text-[var(--ink)]"
        >
          <Image
            src="/insat-press-logo-transparent.png"
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
              className="transition hover:text-[var(--press-red)]"
            >
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
  );
}