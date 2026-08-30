import type { MediaGalleryImage, Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import {
  runDataQuery,
  toBigIntId,
  type EntityId,
  type PaginationOptions,
} from "./utils";

const galleryOrderBy = {
  sortOrder: "asc",
} satisfies Prisma.MediaGalleryImageOrderByWithRelationInput;

export function getAllMediaGalleryImages(
  options: PaginationOptions = {}
): Promise<MediaGalleryImage[]> {
  return runDataQuery("get all media gallery images", () =>
    getPrisma().mediaGalleryImage.findMany({
      orderBy: galleryOrderBy,
      skip: options.skip,
      take: options.take,
    })
  );
}

export function getGalleryImagesForMediaCoverage(
  mediaCoverageId: EntityId
): Promise<MediaGalleryImage[]> {
  return runDataQuery(
    `get gallery images for media coverage ${String(mediaCoverageId)}`,
    () =>
      getPrisma().mediaGalleryImage.findMany({
        where: { mediaCoverageId: toBigIntId(mediaCoverageId) },
        orderBy: galleryOrderBy,
      })
  );
}

export function getMediaGalleryImageById(
  id: EntityId
): Promise<MediaGalleryImage | null> {
  return runDataQuery(`get media gallery image by id ${String(id)}`, () =>
    getPrisma().mediaGalleryImage.findUnique({
      where: { id: toBigIntId(id) },
    })
  );
}

export function createMediaGalleryImage(
  data: Prisma.MediaGalleryImageCreateInput
): Promise<MediaGalleryImage> {
  return runDataQuery("create media gallery image", () =>
    getPrisma().mediaGalleryImage.create({ data })
  );
}

export function updateMediaGalleryImage(
  id: EntityId,
  data: Prisma.MediaGalleryImageUpdateInput
): Promise<MediaGalleryImage> {
  return runDataQuery(`update media gallery image ${String(id)}`, () =>
    getPrisma().mediaGalleryImage.update({
      where: { id: toBigIntId(id) },
      data,
    })
  );
}

export function deleteMediaGalleryImage(
  id: EntityId
): Promise<MediaGalleryImage> {
  return runDataQuery(`delete media gallery image ${String(id)}`, () =>
    getPrisma().mediaGalleryImage.delete({
      where: { id: toBigIntId(id) },
    })
  );
}

export function replaceGalleryImagesForMediaCoverage(
  mediaCoverageId: EntityId,
  images: Omit<Prisma.MediaGalleryImageCreateManyInput, "mediaCoverageId">[]
): Promise<MediaGalleryImage[]> {
  return runDataQuery(
    `replace gallery images for media coverage ${String(mediaCoverageId)}`,
    async () => {
      const prisma = getPrisma();
      const parsedMediaCoverageId = toBigIntId(mediaCoverageId);
      const rows = images.map((image, index) => ({
        ...image,
        mediaCoverageId: parsedMediaCoverageId,
        sortOrder: image.sortOrder ?? index,
      }));

      return prisma.$transaction(async (tx) => {
        await tx.mediaGalleryImage.deleteMany({
          where: { mediaCoverageId: parsedMediaCoverageId },
        });

        if (rows.length > 0) {
          await tx.mediaGalleryImage.createMany({ data: rows });
        }

        return tx.mediaGalleryImage.findMany({
          where: { mediaCoverageId: parsedMediaCoverageId },
          orderBy: galleryOrderBy,
        });
      });
    }
  );
}
