"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Accueil", href: "/", cursor: "Home" },
  { label: "Writing", href: "/writing", cursor: "Read" },
  { label: "Media", href: "/media", cursor: "View" },
  { label: "Events", href: "/events", cursor: "Explore" },
  { label: "Podcast", href: "/podcast", cursor: "Listen" },
  { label: "About Us", href: "/about", cursor: "About" },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(239,226,217,0.88)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          data-cursor-label="Home"
          className="flex items-center gap-4 text-3xl font-black tracking-tight text-[var(--ink)]"
        >
          <Image
            src="/insat-press-logo.png"
            alt="INSAT Press logo"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            priority
          />

          <span>
            insat <span className="text-[var(--press-red)]">press</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-bold md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                data-cursor-label={link.cursor}
                className={`transition-colors duration-200 ${
                  active
                    ? "!text-[var(--press-red)]"
                    : "!text-[var(--muted)] hover:!text-[var(--press-red)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/join"
          data-cursor-label="Join"
          className={`btn-editorial btn-editorial-sm ${
            isActive("/join") ? "!bg-[var(--press-red)] !text-[var(--cream)]" : ""
          }`}
        >
          Join Us
        </Link>
      </nav>
    </header>
  );
}