import type { ArticleWriter, Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import { runDataQuery, toBigIntId, type EntityId } from "./utils";

function articleWriterWhere(articleId: EntityId, writerId: EntityId) {
  return {
    articleId_writerId: {
      articleId: toBigIntId(articleId),
      writerId: toBigIntId(writerId),
    },
  };
}

export function getWritersForArticle(
  articleId: EntityId
): Promise<ArticleWriter[]> {
  return runDataQuery(`get writers for article ${String(articleId)}`, () =>
    getPrisma().articleWriter.findMany({
      where: { articleId: toBigIntId(articleId) },
      orderBy: { sortOrder: "asc" },
    })
  );
}

export function createArticleWriter(
  data: Prisma.ArticleWriterCreateInput
): Promise<ArticleWriter> {
  return runDataQuery("create article writer", () =>
    getPrisma().articleWriter.create({ data })
  );
}

export function updateArticleWriter(
  articleId: EntityId,
  writerId: EntityId,
  data: Prisma.ArticleWriterUpdateInput
): Promise<ArticleWriter> {
  return runDataQuery(
    `update writer ${String(writerId)} for article ${String(articleId)}`,
    () =>
      getPrisma().articleWriter.update({
        where: articleWriterWhere(articleId, writerId),
        data,
      })
  );
}

export function deleteArticleWriter(
  articleId: EntityId,
  writerId: EntityId
): Promise<ArticleWriter> {
  return runDataQuery(
    `delete writer ${String(writerId)} for article ${String(articleId)}`,
    () =>
      getPrisma().articleWriter.delete({
        where: articleWriterWhere(articleId, writerId),
      })
  );
}

export function setArticleWriters(
  articleId: EntityId,
  writerIds: EntityId[]
): Promise<ArticleWriter[]> {
  return runDataQuery(`set writers for article ${String(articleId)}`, async () => {
    const prisma = getPrisma();
    const parsedArticleId = toBigIntId(articleId);
    const rows = writerIds.map((writerId, index) => ({
      articleId: parsedArticleId,
      writerId: toBigIntId(writerId),
      sortOrder: index,
    }));

    return prisma.$transaction(async (tx) => {
      await tx.articleWriter.deleteMany({
        where: { articleId: parsedArticleId },
      });

      if (rows.length > 0) {
        await tx.articleWriter.createMany({ data: rows });
      }

      return tx.articleWriter.findMany({
        where: { articleId: parsedArticleId },
        orderBy: { sortOrder: "asc" },
      });
    });
  });
}
