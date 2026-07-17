import { AdminRole, type Prisma, type Profile } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import { runDataQuery, type PaginationOptions } from "./utils";

const writerOrderBy = [
  { fullName: "asc" },
  { email: "asc" },
] satisfies Prisma.ProfileOrderByWithRelationInput[];

const writerWithArticlesInclude = {
  articleWriters: {
    include: {
      article: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
  },
} satisfies Prisma.ProfileInclude;

export type WriterProfileWithArticles = Prisma.ProfileGetPayload<{
  include: typeof writerWithArticlesInclude;
}>;

export function getAllWriters(
  options: PaginationOptions = {}
): Promise<Profile[]> {
  return runDataQuery("get all writer profiles", () =>
    getPrisma().profile.findMany({
      where: { role: AdminRole.WRITER },
      orderBy: writerOrderBy,
      skip: options.skip,
      take: options.take,
    })
  );
}

export function searchWriters(query: string): Promise<Profile[]> {
  return runDataQuery(`search writer profiles "${query}"`, () =>
    getPrisma().profile.findMany({
      where: {
        role: AdminRole.WRITER,
        OR: [
          { fullName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: writerOrderBy,
    })
  );
}

export function getWriterById(id: string): Promise<Profile | null> {
  return runDataQuery(`get writer profile by id ${id}`, () =>
    getPrisma().profile.findFirst({
      where: { id, role: AdminRole.WRITER },
    })
  );
}

export function getWriterBySlug(slug: string): Promise<Profile | null> {
  return runDataQuery(`get writer profile by slug ${slug}`, () =>
    getPrisma().profile.findFirst({
      where: { slug, role: AdminRole.WRITER },
    })
  );
}

export function getWriterWithArticlesBySlug(
  slug: string
): Promise<WriterProfileWithArticles | null> {
  return runDataQuery(`get writer profile with articles by slug ${slug}`, () =>
    getPrisma().profile.findFirst({
      where: { slug, role: AdminRole.WRITER },
      include: writerWithArticlesInclude,
    })
  );
}

export function createWriter(
  data: Prisma.ProfileCreateInput
): Promise<Profile> {
  return runDataQuery("create writer profile", () =>
    getPrisma().profile.create({
      data: { ...data, role: AdminRole.WRITER },
    })
  );
}

export function updateWriter(
  id: string,
  data: Prisma.ProfileUpdateInput
): Promise<Profile> {
  return runDataQuery(`update writer profile ${id}`, () =>
    getPrisma().profile.update({ where: { id }, data })
  );
}

export function deleteWriter(id: string): Promise<Profile> {
  return runDataQuery(`delete writer profile ${id}`, () =>
    getPrisma().profile.delete({ where: { id } })
  );
}
