import type { Prisma, Writer } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import {
  runDataQuery,
  toBigIntId,
  type EntityId,
  type PaginationOptions,
} from "./utils";

const writerOrderBy = { name: "asc" } satisfies Prisma.WriterOrderByWithRelationInput;

export type WriterWithArticles = Prisma.WriterGetPayload<{
  include: typeof writerWithArticlesInclude;
}>;

const writerWithArticlesInclude = {
  articles: {
    include: {
      article: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  },
} satisfies Prisma.WriterInclude;

export function getAllWriters(
  options: PaginationOptions = {}
): Promise<Writer[]> {
  return runDataQuery("get all writers", () =>
    getPrisma().writer.findMany({
      orderBy: writerOrderBy,
      skip: options.skip,
      take: options.take,
    })
  );
}

export function searchWriters(query: string): Promise<Writer[]> {
  return runDataQuery(`search writers "${query}"`, () =>
    getPrisma().writer.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      orderBy: writerOrderBy,
    })
  );
}

export function getWriterById(id: EntityId): Promise<Writer | null> {
  return runDataQuery(`get writer by id ${String(id)}`, () =>
    getPrisma().writer.findUnique({ where: { id: toBigIntId(id) } })
  );
}

export function getWriterBySlug(slug: string): Promise<Writer | null> {
  return runDataQuery(`get writer by slug ${slug}`, () =>
    getPrisma().writer.findUnique({ where: { slug } })
  );
}

export function getWriterWithArticlesBySlug(
  slug: string
): Promise<WriterWithArticles | null> {
  return runDataQuery(`get writer with articles by slug ${slug}`, () =>
    getPrisma().writer.findUnique({
      where: { slug },
      include: writerWithArticlesInclude,
    })
  );
}

export function createWriter(data: Prisma.WriterCreateInput): Promise<Writer> {
  return runDataQuery("create writer", () => getPrisma().writer.create({ data }));
}

export function updateWriter(
  id: EntityId,
  data: Prisma.WriterUpdateInput
): Promise<Writer> {
  return runDataQuery(`update writer ${String(id)}`, () =>
    getPrisma().writer.update({ where: { id: toBigIntId(id) }, data })
  );
}

export function deleteWriter(id: EntityId): Promise<Writer> {
  return runDataQuery(`delete writer ${String(id)}`, () =>
    getPrisma().writer.delete({ where: { id: toBigIntId(id) } })
  );
}
