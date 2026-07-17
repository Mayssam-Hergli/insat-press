import {
  ContentStatus,
  type Article,
  type Prisma,
} from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import {
  runDataQuery,
  toBigIntId,
  type EntityId,
  type PaginationOptions,
} from "./utils";

const articleOrderBy = [
  { publishedAt: "desc" },
  { createdAt: "desc" },
] satisfies Prisma.ArticleOrderByWithRelationInput[];

const articleWithContributorsInclude = {
  writers: {
    include: {
      profile: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  },
  createdBy: true,
  updatedBy: true,
} satisfies Prisma.ArticleInclude;

export type ArticleWithContributors = Prisma.ArticleGetPayload<{
  include: typeof articleWithContributorsInclude;
}>;

export type ArticleFilters = PaginationOptions & {
  category?: string;
  status?: ContentStatus;
  createdById?: string;
};

export function getAllArticles(
  filters: ArticleFilters = {}
): Promise<ArticleWithContributors[]> {
  return runDataQuery("get all articles", () =>
    getPrisma().article.findMany({
      where: {
        category: filters.category,
        status: filters.status,
        createdById: filters.createdById,
      },
      include: articleWithContributorsInclude,
      orderBy: articleOrderBy,
      skip: filters.skip,
      take: filters.take,
    })
  );
}

export function getPublishedArticles(
  options: PaginationOptions = {}
): Promise<ArticleWithContributors[]> {
  return getAllArticles({ ...options, status: ContentStatus.PUBLISHED });
}

export function getArticleById(id: EntityId): Promise<ArticleWithContributors | null> {
  return runDataQuery(`get article by id ${String(id)}`, () =>
    getPrisma().article.findUnique({
      where: { id: toBigIntId(id) },
      include: articleWithContributorsInclude,
    })
  );
}

export function getArticleBySlug(
  slug: string
): Promise<ArticleWithContributors | null> {
  return runDataQuery(`get article by slug ${slug}`, () =>
    getPrisma().article.findUnique({
      where: { slug },
      include: articleWithContributorsInclude,
    })
  );
}

export function getArticleByTitle(
  title: string
): Promise<ArticleWithContributors | null> {
  return runDataQuery(`get article by title ${title}`, () =>
    getPrisma().article.findFirst({
      where: { title },
      include: articleWithContributorsInclude,
      orderBy: articleOrderBy,
    })
  );
}

export function getPublishedArticleBySlug(
  slug: string
): Promise<ArticleWithContributors | null> {
  return runDataQuery(`get published article by slug ${slug}`, () =>
    getPrisma().article.findFirst({
      where: {
        slug,
        status: ContentStatus.PUBLISHED,
      },
      include: articleWithContributorsInclude,
    })
  );
}

export function createArticle(
  data: Prisma.ArticleCreateInput
): Promise<Article> {
  return runDataQuery("create article", () =>
    getPrisma().article.create({ data })
  );
}

export function updateArticle(
  id: EntityId,
  data: Prisma.ArticleUpdateInput
): Promise<Article> {
  return runDataQuery(`update article ${String(id)}`, () =>
    getPrisma().article.update({ where: { id: toBigIntId(id) }, data })
  );
}

export function publishArticle(
  id: EntityId,
  publishedAt = new Date()
): Promise<Article> {
  return updateArticle(id, {
    status: ContentStatus.PUBLISHED,
    publishedAt,
  });
}

export function archiveArticle(id: EntityId): Promise<Article> {
  return updateArticle(id, {
    status: ContentStatus.ARCHIVED,
  });
}

export function deleteArticle(id: EntityId): Promise<Article> {
  return runDataQuery(`delete article ${String(id)}`, () =>
    getPrisma().article.delete({ where: { id: toBigIntId(id) } })
  );
}
