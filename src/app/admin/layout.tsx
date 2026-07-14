import { requireAuth } from "@/lib/auth/session";
import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireAuth();

  return (
    <div className="min-h-screen page-bg">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(239,226,217,0.9)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4 md:gap-8">
              <Link
                href="/admin"
                className="flex items-baseline gap-2 text-xl font-black tracking-tight text-[var(--ink)] sm:text-2xl"
              >
                <span>
                  insat <span className="text-[var(--press-red)]">press</span>
                </span>
                <span className="font-hand text-lg text-[var(--press-red)]">
                  admin
                </span>
              </Link>
              <AdminNav role={profile.role} />
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden text-sm text-[var(--muted)] sm:block">
                <span className="font-bold text-[var(--ink)]">
                  {profile.fullName || profile.email}
                </span>
                <span className="ml-2 inline-flex rounded-full border border-[var(--press-red)] bg-[rgba(130,27,22,0.08)] px-2 py-0.5 text-xs font-black uppercase text-[var(--press-red)]">
                  {profile.role}
                </span>
              </div>
              <Link
                href="/"
                className="hidden text-sm font-bold text-[var(--muted)] transition-colors hover:text-[var(--press-red)] sm:block"
              >
                View Site
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
