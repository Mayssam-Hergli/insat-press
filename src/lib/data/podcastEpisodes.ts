import {
  ContentStatus,
  type PodcastEpisode,
  type Prisma,
} from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import {
  runDataQuery,
  toBigIntId,
  type EntityId,
  type PaginationOptions,
} from "./utils";

const podcastOrderBy = [
  { releasedAt: "desc" },
  { publishedAt: "desc" },
  { createdAt: "desc" },
] satisfies Prisma.PodcastEpisodeOrderByWithRelationInput[];

const podcastWithEditorsInclude = {
  createdBy: true,
  updatedBy: true,
} satisfies Prisma.PodcastEpisodeInclude;

export type PodcastEpisodeWithEditors = Prisma.PodcastEpisodeGetPayload<{
  include: typeof podcastWithEditorsInclude;
}>;

export type PodcastEpisodeFilters = PaginationOptions & {
  status?: ContentStatus;
};

export function getAllPodcastEpisodes(
  filters: PodcastEpisodeFilters = {}
): Promise<PodcastEpisodeWithEditors[]> {
  return runDataQuery("get all podcast episodes", () =>
    getPrisma().podcastEpisode.findMany({
      where: {
        status: filters.status,
      },
      include: podcastWithEditorsInclude,
      orderBy: podcastOrderBy,
      skip: filters.skip,
      take: filters.take,
    })
  );
}

export function getPublishedPodcastEpisodes(
  options: PaginationOptions = {}
): Promise<PodcastEpisodeWithEditors[]> {
  return getAllPodcastEpisodes({
    ...options,
    status: ContentStatus.PUBLISHED,
  });
}

export function getPodcastEpisodeById(
  id: EntityId
): Promise<PodcastEpisodeWithEditors | null> {
  return runDataQuery(`get podcast episode by id ${String(id)}`, () =>
    getPrisma().podcastEpisode.findUnique({
      where: { id: toBigIntId(id) },
      include: podcastWithEditorsInclude,
    })
  );
}

export function getPodcastEpisodeBySlug(
  slug: string
): Promise<PodcastEpisodeWithEditors | null> {
  return runDataQuery(`get podcast episode by slug ${slug}`, () =>
    getPrisma().podcastEpisode.findUnique({
      where: { slug },
      include: podcastWithEditorsInclude,
    })
  );
}

export function getPublishedPodcastEpisodeBySlug(
  slug: string
): Promise<PodcastEpisodeWithEditors | null> {
  return runDataQuery(`get published podcast episode by slug ${slug}`, () =>
    getPrisma().podcastEpisode.findFirst({
      where: { slug, status: ContentStatus.PUBLISHED },
      include: podcastWithEditorsInclude,
    })
  );
}

export function getPodcastEpisodeByTitle(
  title: string
): Promise<PodcastEpisodeWithEditors | null> {
  return runDataQuery(`get podcast episode by title ${title}`, () =>
    getPrisma().podcastEpisode.findFirst({
      where: { title },
      include: podcastWithEditorsInclude,
      orderBy: podcastOrderBy,
    })
  );
}

export function createPodcastEpisode(
  data: Prisma.PodcastEpisodeCreateInput
): Promise<PodcastEpisode> {
  return runDataQuery("create podcast episode", () =>
    getPrisma().podcastEpisode.create({ data })
  );
}

export function updatePodcastEpisode(
  id: EntityId,
  data: Prisma.PodcastEpisodeUpdateInput
): Promise<PodcastEpisode> {
  return runDataQuery(`update podcast episode ${String(id)}`, () =>
    getPrisma().podcastEpisode.update({ where: { id: toBigIntId(id) }, data })
  );
}

export function publishPodcastEpisode(
  id: EntityId,
  publishedAt = new Date()
): Promise<PodcastEpisode> {
  return updatePodcastEpisode(id, {
    status: ContentStatus.PUBLISHED,
    publishedAt,
  });
}

export function archivePodcastEpisode(id: EntityId): Promise<PodcastEpisode> {
  return updatePodcastEpisode(id, {
    status: ContentStatus.ARCHIVED,
  });
}

export function deletePodcastEpisode(id: EntityId): Promise<PodcastEpisode> {
  return runDataQuery(`delete podcast episode ${String(id)}`, () =>
    getPrisma().podcastEpisode.delete({ where: { id: toBigIntId(id) } })
  );
}
