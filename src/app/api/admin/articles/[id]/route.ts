import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import {
  canDelete,
  canEditPost,
  resolveWriteStatus,
} from "@/lib/auth/permissions";
import { updateArticle, getArticleById } from "@/lib/data/articles";
import { setArticleWriters } from "@/lib/data/articleWriters";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const profile = await requireAuth();
    const { id } = await params;

    // Verify article exists
    const article = await getArticleById(id);
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    // Admins may edit any article; writers may only edit their own.
    if (!canEditPost(profile.role, "articles", article, profile.id)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { writerIds, ...body } = await request.json();

    // Writers can only save a draft or submit for review; editing a published
    // post therefore sends it back to pending until an admin re-approves.
    const status = resolveWriteStatus(profile.role, body.status);

    // Stamp publishedAt the first time a post actually goes live.
    const publishedAt =
      status === "PUBLISHED" && !article.publishedAt
        ? new Date()
        : article.publishedAt;

    const updatedArticle = await updateArticle(id, {
      ...body,
      status,
      publishedAt,
      updatedById: profile.id,
    });

    if (writerIds !== undefined) {
      await setArticleWriters(id, writerIds);
    }

    return NextResponse.json(updatedArticle, { status: 200 });
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Only admins can delete content.
    const profile = await requireAuth();
    if (!canDelete(profile.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Note: Actual deletion would require canDelete permission
    // For now, this is a placeholder
    return NextResponse.json(
      { error: "Delete functionality not yet implemented" },
      { status: 501 }
    );
  } catch (error) {
    console.error("Delete article error:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
