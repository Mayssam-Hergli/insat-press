"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { AdminRole } from "@/generated/prisma/client";
import {
  canManageProfiles,
  sectionsForRole,
  type Section,
} from "@/lib/auth/permissions";

const SECTION_LINKS: Record<Section, { href: string; label: string }> = {
  articles: { href: "/admin/articles", label: "Articles" },
  media: { href: "/admin/media", label: "Media" },
  events: { href: "/admin/events", label: "Events" },
  podcast: { href: "/admin/podcast", label: "Podcast" },
};

export default function AdminNav({ role }: { role: AdminRole }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const links = sectionsForRole(role).map((section) => SECTION_LINKS[section]);
  if (canManageProfiles(role)) {
    links.push({ href: "/admin/team", label: "Team" });
  }
  links.push({ href: "/admin/profile", label: "My Profile" });

  const linkClasses = (active: boolean) =>
    `transition-colors duration-200 ${
      active
        ? "!text-[var(--press-red)]"
        : "!text-[var(--muted)] hover:!text-[var(--press-red)]"
    }`;

  return (
    <>
      <nav className="hidden items-center gap-6 text-sm font-bold md:flex">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={linkClasses(isActive(link.href))}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile menu */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--ink)] transition-colors hover:text-[var(--press-red)] md:hidden"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          {open ? (
            <>
              <line x1="5" y1="5" x2="19" y2="19" />
              <line x1="19" y1="5" x2="5" y2="19" />
            </>
          ) : (
            <>
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </>
          )}
        </svg>
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-full z-50 flex flex-col gap-1 border-b border-[var(--line)] bg-[rgba(239,226,217,0.97)] px-4 py-3 text-sm font-bold backdrop-blur-xl md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-md px-3 py-2 ${linkClasses(isActive(link.href))}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="rounded-md px-3 py-2 !text-[var(--muted)] transition-colors duration-200 hover:!text-[var(--press-red)]"
          >
            View Site
          </Link>
        </nav>
      )}
    </>
  );
}
