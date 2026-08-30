import {
  ContributorRole,
  type MediaCoverageContributor,
} from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import { runDataQuery, toBigIntId, type EntityId } from "./utils";

export function getContributorsForMedia(
  mediaCoverageId: EntityId
): Promise<MediaCoverageContributor[]> {
  return runDataQuery(
    `get contributors for media coverage ${String(mediaCoverageId)}`,
    () =>
      getPrisma().mediaCoverageContributor.findMany({
        where: { mediaCoverageId: toBigIntId(mediaCoverageId) },
        orderBy: [{ role: "asc" }, { sortOrder: "asc" }],
      })
  );
}

export function setMediaCoverageContributors(
  mediaCoverageId: EntityId,
  contributors: { coveredByIds: string[]; editedByIds: string[] }
): Promise<MediaCoverageContributor[]> {
  return runDataQuery(
    `set contributors for media coverage ${String(mediaCoverageId)}`,
    async () => {
      const prisma = getPrisma();
      const parsedMediaCoverageId = toBigIntId(mediaCoverageId);

      const rows = [
        ...contributors.coveredByIds.map((profileId, index) => ({
          mediaCoverageId: parsedMediaCoverageId,
          profileId,
          role: ContributorRole.COVERED_BY,
          sortOrder: index,
        })),
        ...contributors.editedByIds.map((profileId, index) => ({
          mediaCoverageId: parsedMediaCoverageId,
          profileId,
          role: ContributorRole.EDITED_BY,
          sortOrder: index,
        })),
      ];

      return prisma.$transaction(async (tx) => {
        await tx.mediaCoverageContributor.deleteMany({
          where: { mediaCoverageId: parsedMediaCoverageId },
        });

        if (rows.length > 0) {
          await tx.mediaCoverageContributor.createMany({ data: rows });
        }

        return tx.mediaCoverageContributor.findMany({
          where: { mediaCoverageId: parsedMediaCoverageId },
          orderBy: [{ role: "asc" }, { sortOrder: "asc" }],
        });
      });
    }
  );
}
