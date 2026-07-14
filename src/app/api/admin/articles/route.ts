import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { canAccessSection, resolveWriteStatus } from "@/lib/auth/permissions";
import { createArticle, getArticleByTitle } from "@/lib/data/articles";
import { setArticleWriters } from "@/lib/data/articleWriters";

export async function POST(request: NextRequest) {
  try {
    // Writers and admins may create articles; other roles may not.
    const profile = await requireAuth();
    if (!canAccessSection(profile.role, "articles")) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }
    const { writerIds, ...body } = await request.json();

    // Verify article does not already exist
    const article = await getArticleByTitle(body.title);
    if (article) {
      return NextResponse.json({ error: "Article exists" }, { status: 409 });
    }

    // Writers can only save a draft or submit for review; admins may publish.
    const status = resolveWriteStatus(profile.role, body.status);

    const newArticle = await createArticle({
      ...body,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      createdById: profile.id,
      updatedById: profile.id,
    });

    await setArticleWriters(newArticle.id, writerIds ?? []);

    return NextResponse.json(newArticle, { status: 200 });
  } catch (error) {
    console.error("Create article error:", error);
    return NextResponse.json(
      { error: "Failed to add article" },
      { status: 500 }
    );
  }
}
