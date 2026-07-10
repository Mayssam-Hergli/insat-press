import {
  ContentStatus,
  type MediaCoverage,
  type Prisma,
} from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import {
  runDataQuery,
  toBigIntId,
  type EntityId,
  type PaginationOptions,
} from "./utils";

const mediaCoverageOrderBy = [
  { coveredAt: "desc" },
  { publishedAt: "desc" },
  { createdAt: "desc" },
] satisfies Prisma.MediaCoverageOrderByWithRelationInput[];

const mediaCoverageWithGalleryInclude = {
  gallery: {
    orderBy: {
      sortOrder: "asc",
    },
  },
  createdBy: true,
  updatedBy: true,
} satisfies Prisma.MediaCoverageInclude;

export type MediaCoverageWithGallery = Prisma.MediaCoverageGetPayload<{
  include: typeof mediaCoverageWithGalleryInclude;
}>;

export type MediaCoverageFilters = PaginationOptions & {
  status?: ContentStatus;
  type?: string;
};

export function getAllMediaCoverage(
  filters: MediaCoverageFilters = {}
): Promise<MediaCoverageWithGallery[]> {
  return runDataQuery("get all media coverage", () =>
    getPrisma().mediaCoverage.findMany({
      where: {
        status: filters.status,
        type: filters.type,
      },
      include: mediaCoverageWithGalleryInclude,
      orderBy: mediaCoverageOrderBy,
      skip: filters.skip,
      take: filters.take,
    })
  );
}

export function getPublishedMediaCoverage(
  options: PaginationOptions = {}
): Promise<MediaCoverageWithGallery[]> {
  return getAllMediaCoverage({
    ...options,
    status: ContentStatus.PUBLISHED,
  });
}

export function getMediaCoverageById(
  id: EntityId
): Promise<MediaCoverageWithGallery | null> {
  return runDataQuery(`get media coverage by id ${String(id)}`, () =>
    getPrisma().mediaCoverage.findUnique({
      where: { id: toBigIntId(id) },
      include: mediaCoverageWithGalleryInclude,
    })
  );
}

export function getMediaCoverageBySlug(
  slug: string
): Promise<MediaCoverageWithGallery | null> {
  return runDataQuery(`get media coverage by slug ${slug}`, () =>
    getPrisma().mediaCoverage.findUnique({
      where: { slug },
      include: mediaCoverageWithGalleryInclude,
    })
  );
}

export function getMediaCoverageByTitle(
  title: string
): Promise<MediaCoverageWithGallery | null> {
  return runDataQuery(`get media coverage by title ${title}`, () =>
    getPrisma().mediaCoverage.findFirst({
      where: { title },
      include: mediaCoverageWithGalleryInclude,
      orderBy: mediaCoverageOrderBy,
    })
  );
}

export function createMediaCoverage(
  data: Prisma.MediaCoverageCreateInput
): Promise<MediaCoverage> {
  return runDataQuery("create media coverage", () =>
    getPrisma().mediaCoverage.create({ data })
  );
}

export function updateMediaCoverage(
  id: EntityId,
  data: Prisma.MediaCoverageUpdateInput
): Promise<MediaCoverage> {
  return runDataQuery(`update media coverage ${String(id)}`, () =>
    getPrisma().mediaCoverage.update({ where: { id: toBigIntId(id) }, data })
  );
}

export function publishMediaCoverage(
  id: EntityId,
  publishedAt = new Date()
): Promise<MediaCoverage> {
  return updateMediaCoverage(id, {
    status: ContentStatus.PUBLISHED,
    publishedAt,
  });
}

export function archiveMediaCoverage(id: EntityId): Promise<MediaCoverage> {
  return updateMediaCoverage(id, {
    status: ContentStatus.ARCHIVED,
  });
}

export function deleteMediaCoverage(id: EntityId): Promise<MediaCoverage> {
  return runDataQuery(`delete media coverage ${String(id)}`, () =>
    getPrisma().mediaCoverage.delete({ where: { id: toBigIntId(id) } })
  );
}
