import { getAllProfiles } from "@/lib/data/profiles";
import ArticleAddForm from "@/components/admin/ArticleAddForm";
import { requireAuth } from "@/lib/auth/session";
import { canAccessSection, canPublish } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";

export default async function AddArticlePage(){
  const profile = await requireAuth();
  if (!canAccessSection(profile.role, "articles")) {
    redirect("/admin");
  }

  const profiles = await getAllProfiles();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif-display text-3xl font-bold text-[var(--ink)]">Add Article</h1>
        <p className="mt-1 text-[var(--muted)]">
          Enter the article information and content below.
        </p>
      </div>

      <ArticleAddForm profiles={profiles} canPublish={canPublish(profile.role)} />
    </div>
  );
}