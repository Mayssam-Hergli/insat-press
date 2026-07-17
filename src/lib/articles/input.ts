import type { ContentStatus, Prisma } from "@/generated/prisma/client";

const STATUSES = new Set<ContentStatus>(["DRAFT", "PENDING", "PUBLISHED", "ARCHIVED"]);

type ArticleWriteData = Pick<Prisma.ArticleCreateInput,
  "title" | "slug" | "category" | "description" | "content" |
  "coverLabel" | "sourceUrl" | "displayDate"
>;

export class ArticleInputError extends Error {}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ArticleInputError("Request body must be a JSON object.");
  }
  return value as Record<string, unknown>;
}

function requiredText(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  if (typeof value !== "string" || !value.trim()) throw new ArticleInputError(`${key} is required.`);
  return value.trim();
}

function optionalText(body: Record<string, unknown>, key: string): string | null {
  const value = body[key];
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") throw new ArticleInputError(`${key} must be text.`);
  return value.trim() || null;
}

function requestedStatus(body: Record<string, unknown>): ContentStatus | undefined {
  const value = body.status;
  if (value === undefined) return undefined;
  if (typeof value !== "string" || !STATUSES.has(value as ContentStatus)) {
    throw new ArticleInputError("Invalid article status.");
  }
  return value as ContentStatus;
}

export function parseNewArticleInput(value: unknown): { data: ArticleWriteData; requestedStatus?: ContentStatus } {
  const body = asRecord(value);
  return {
    data: {
      title: requiredText(body, "title"), slug: requiredText(body, "slug"),
      category: requiredText(body, "category"), description: requiredText(body, "description"),
      content: typeof body.content === "string" ? body.content : "",
      coverLabel: optionalText(body, "coverLabel"), sourceUrl: optionalText(body, "sourceUrl"),
      displayDate: optionalText(body, "displayDate"),
    },
    requestedStatus: requestedStatus(body),
  };
}

export function parseArticlePatch(value: unknown): { data: Partial<ArticleWriteData>; requestedStatus?: ContentStatus } {
  const body = asRecord(value);
  const data: Partial<ArticleWriteData> = {};
  for (const key of ["title", "slug", "category", "description"] as const) {
    if (key in body) data[key] = requiredText(body, key);
  }
  if ("content" in body) {
    if (typeof body.content !== "string") throw new ArticleInputError("content must be text.");
    data.content = body.content;
  }
  for (const key of ["coverLabel", "sourceUrl", "displayDate"] as const) {
    if (key in body) data[key] = optionalText(body, key);
  }
  return { data, requestedStatus: requestedStatus(body) };
}
