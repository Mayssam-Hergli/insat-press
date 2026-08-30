import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { canEditArticle } from "@/lib/auth/permissions";
import { getArticleById, updateArticle } from "@/lib/data/articles";
import {
  ArticleImageError,
  makeArticleImagePath,
  optimizeArticleImage,
  removeArticleImage,
  uploadArticleImage,
} from "@/lib/storage/article-images-server";
import { isManagedArticleImagePath } from "@/lib/storage/article-images";

async function context(id: string) {
  const profile = await getCurrentProfile();
  if (!profile) return { response: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
  const article = await getArticleById(id);
  if (!article) return { response: NextResponse.json({ error: "Article not found" }, { status: 404 }) };
  if (!canEditArticle(profile.role, article, profile.id)) {
    return { response: NextResponse.json({ error: "This article is locked or you do not own it" }, { status: 403 }) };
  }
  return { profile, article };
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const access = await context(id);
    if ("response" in access) return access.response;

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ error: "A cover image file is required" }, { status: 400 });

    const output = await optimizeArticleImage(file);
    const ownerId = access.article.createdById ?? access.profile.id;
    const newPath = makeArticleImagePath(ownerId, access.article.id);
    await uploadArticleImage(newPath, output);

    try {
      await updateArticle(id, { coverImage: newPath, updatedBy: { connect: { id: access.profile.id } } });
    } catch (error) {
      try { await removeArticleImage(newPath); } catch (rollbackError) {
        console.error("Cover upload rollback failed:", rollbackError);
      }
      throw error;
    }

    let cleanupPending = false;
    if (isManagedArticleImagePath(access.article.coverImage)) {
      try { await removeArticleImage(access.article.coverImage); }
      catch (error) { cleanupPending = true; console.error("Old cover cleanup failed:", error); }
    }
    return NextResponse.json({ path: newPath, cleanupPending });
  } catch (error) {
    if (error instanceof ArticleImageError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Article cover upload error:", error);
    return NextResponse.json({ error: "Failed to save the article cover" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const access = await context(id);
    if ("response" in access) return access.response;
    const oldPath = access.article.coverImage;

    // Break the public database reference first, then clean up the object.
    await updateArticle(id, { coverImage: null, updatedBy: { connect: { id: access.profile.id } } });
    if (isManagedArticleImagePath(oldPath)) {
      try { await removeArticleImage(oldPath); }
      catch (error) {
        console.error("Cover reference removed but Storage cleanup failed:", error);
        return NextResponse.json(
          { removed: true, cleanupPending: true, error: "Cover removed from the article, but Storage cleanup failed" },
          { status: 502 }
        );
      }
    }
    return NextResponse.json({ removed: true });
  } catch (error) {
    console.error("Article cover removal error:", error);
    return NextResponse.json({ error: "Failed to remove the article cover" }, { status: 500 });
  }
}
