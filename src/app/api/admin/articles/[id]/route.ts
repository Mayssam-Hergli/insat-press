import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { canDelete, canEditArticle, resolveWriteStatus } from "@/lib/auth/permissions";
import { ArticleInputError, parseArticlePatch } from "@/lib/articles/input";
import { deleteArticle, getArticleById, updateArticle } from "@/lib/data/articles";
import { removeArticleImage } from "@/lib/storage/article-images-server";
import { isManagedArticleImagePath } from "@/lib/storage/article-images";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    const { id } = await params;
    const article = await getArticleById(id);
    if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });
    if (!canEditArticle(profile.role, article, profile.id)) {
      return NextResponse.json({ error: "This article is locked or you do not own it" }, { status: 403 });
    }

    const { data, requestedStatus } = parseArticlePatch(await request.json());
    const status = requestedStatus
      ? resolveWriteStatus(profile.role, requestedStatus)
      : article.status;
    const publishedAt = status === "PUBLISHED" && !article.publishedAt
      ? new Date()
      : article.publishedAt;
    const updated = await updateArticle(id, {
      ...data,
      status,
      publishedAt,
      updatedById: profile.id,
    });
    return NextResponse.json({ ...updated, id: updated.id.toString() });
  } catch (error) {
    if (error instanceof ArticleInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Update article error:", error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (!canDelete(profile.role)) return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });

    const { id } = await params;
    const article = await getArticleById(id);
    if (!article) return NextResponse.json({ error: "Article not found" }, { status: 404 });

    // Delete the database record first so a Storage outage cannot leave a live
    // article pointing to an unavailable object.
    await deleteArticle(id);
    if (isManagedArticleImagePath(article.coverImage)) {
      try {
        await removeArticleImage(article.coverImage);
      } catch (error) {
        console.error("Article deleted but cover cleanup failed:", error);
        return NextResponse.json(
          { deleted: true, cleanupPending: true, error: "Article deleted, but its Storage object could not be cleaned up" },
          { status: 502 }
        );
      }
    }
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
