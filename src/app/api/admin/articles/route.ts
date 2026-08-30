import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { canEdit } from "@/lib/auth/permissions";
import { createArticle,getArticleByTitle } from "@/lib/data/articles";

export async function POST(
  request: NextRequest
) {
  try {
    // Check authentication and permissions
    const profile = await requireAuth();
    if (!canEdit(profile.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }
    const body = await request.json();

    // Verify article exists
    const article = await getArticleByTitle(body.title);
    if (article) {
      return NextResponse.json(
        { error: "Article exists" },
        { status: 404 }
      );
    }

    // Update the article
    const newArticle = await createArticle( {
      ...body,
      updatedById: profile.id,
    });

    return NextResponse.json(newArticle, { status: 200 });
  } catch (error) {
    console.error("Update article error:", error);
    return NextResponse.json(
      { errorr: "Failed to add article" },
      { status: 500 }
    );
  }
}

