"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/data/siteConfig";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(239,226,217,0.9)] backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-6">
        <Link
          href="/"
          data-cursor-label="Home"
          onClick={closeMenu}
          className="flex items-center gap-3 text-2xl font-black tracking-tight text-[var(--ink)] md:text-3xl"
        >
          <Image
            src={siteConfig.logo}
            alt="INSAT Press logo"
            width={44}
            height={44}
            className="h-10 w-10 object-contain md:h-11 md:w-11"
            priority
          />

          <span>
            insat <span className="text-[var(--press-red)]">press</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-bold md:flex">
          {siteConfig.navLinks.map((link) => {
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

        <div className="hidden md:block">
          <Link
            href="/join"
            data-cursor-label="Join"
            className={`btn-editorial btn-editorial-sm ${
              isActive("/join")
                ? "!bg-[var(--press-red)] !text-[var(--cream)]"
                : ""
            }`}
          >
            Join Us
          </Link>
        </div>

        <button
          type="button"
          data-cursor-label="Menu"
          onClick={() => setMenuOpen((current) => !current)}
          className="rounded-full border border-[var(--press-red)] px-4 py-2 text-sm font-black text-[var(--press-red)] md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-[var(--line)] bg-[rgba(239,226,217,0.96)] px-5 py-5 md:hidden">
          <div className="flex flex-col gap-3">
            {siteConfig.navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-cursor-label={link.cursor}
                  onClick={closeMenu}
                  className={`rounded-xl border border-[var(--line)] px-4 py-3 text-base font-black transition ${
                    active
                      ? "bg-[rgba(130,27,22,0.08)] text-[var(--press-red)]"
                      : "text-[var(--muted)] hover:text-[var(--press-red)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/join"
              data-cursor-label="Join"
              onClick={closeMenu}
              className={`mt-2 rounded-xl border border-[var(--press-red)] px-4 py-3 text-center text-base font-black transition ${
                isActive("/join")
                  ? "bg-[var(--press-red)] text-[var(--cream)]"
                  : "text-[var(--press-red)]"
              }`}
            >
              Join Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}