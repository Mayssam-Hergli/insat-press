"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const links = sectionsForRole(role).map((section) => SECTION_LINKS[section]);
  if (canManageProfiles(role)) {
    links.push({ href: "/admin/writers", label: "Writers" });
    links.push({ href: "/admin/team", label: "Team" });
  }

  return (
    <nav className="hidden items-center gap-6 text-sm font-bold md:flex">
      {links.map((link) => {
        const active = isActive(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
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
    </nav>
  );
}
