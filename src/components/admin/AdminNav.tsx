"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/podcast", label: "Podcast" },
  { href: "/admin/writers", label: "Writers" },
];

export default function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

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
