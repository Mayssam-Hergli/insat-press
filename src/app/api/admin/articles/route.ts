import { NextRequest, NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";
import { canAccessSection } from "@/lib/auth/permissions";
import { ArticleInputError, parseNewArticleInput } from "@/lib/articles/input";
import { createArticle, getArticleBySlug, getArticleByTitle } from "@/lib/data/articles";

export async function POST(request: NextRequest) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    if (!canAccessSection(profile.role, "articles")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { data } = parseNewArticleInput(await request.json());
    const duplicate = (await getArticleByTitle(data.title)) || (await getArticleBySlug(data.slug));
    if (duplicate) return NextResponse.json({ error: "An article with this title or slug already exists" }, { status: 409 });

    // Creation is deliberately a draft. The client uploads its cover to this
    // stable article ID, then requests the desired status in a separate PATCH.
    const article = await createArticle({
      ...data,
      status: "DRAFT",
      publishedAt: null,
      createdById: profile.id,
      updatedById: profile.id,
    });
    return NextResponse.json({ ...article, id: article.id.toString() }, { status: 201 });
  } catch (error) {
    if (error instanceof ArticleInputError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Create article error:", error);
    return NextResponse.json({ error: "Failed to add article" }, { status: 500 });
  }
}
