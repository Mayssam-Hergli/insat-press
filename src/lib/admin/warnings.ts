import "server-only";

import { ContentStatus } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";

export type WarningItem = {
  id: string;
  type: "article" | "event" | "media" | "podcast";
  title: string;
  slug: string;
  issue: string;
  editUrl: string;
};

export async function getPublishedWithoutDate(): Promise<WarningItem[]> {
  const prisma = getPrisma();
  const warnings: WarningItem[] = [];

  // Check articles
  const articles = await prisma.article.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      publishedAt: null,
    },
    select: { id: true, title: true, slug: true },
  });

  warnings.push(
    ...articles.map((a) => ({
      id: a.id.toString(),
      type: "article" as const,
      title: a.title,
      slug: a.slug,
      issue: "Published without publishedAt date",
      editUrl: `/admin/articles/${a.id}/edit`,
    }))
  );

  // Check events
  const events = await prisma.event.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      publishedAt: null,
    },
    select: { id: true, title: true, slug: true },
  });

  warnings.push(
    ...events.map((e) => ({
      id: e.id.toString(),
      type: "event" as const,
      title: e.title,
      slug: e.slug,
      issue: "Published without publishedAt date",
      editUrl: `/admin/events/${e.id}/edit`,
    }))
  );

  // Check media coverage
  const media = await prisma.mediaCoverage.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      publishedAt: null,
    },
    select: { id: true, title: true, slug: true },
  });

  warnings.push(
    ...media.map((m) => ({
      id: m.id.toString(),
      type: "media" as const,
      title: m.title,
      slug: m.slug,
      issue: "Published without publishedAt date",
      editUrl: `/admin/media/${m.id}/edit`,
    }))
  );

  // Check podcast episodes
  const podcasts = await prisma.podcastEpisode.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      publishedAt: null,
    },
    select: { id: true, title: true, slug: true },
  });

  warnings.push(
    ...podcasts.map((p) => ({
      id: p.id.toString(),
      type: "podcast" as const,
      title: p.title,
      slug: p.slug,
      issue: "Published without publishedAt date",
      editUrl: `/admin/podcast/${p.id}/edit`,
    }))
  );

  return warnings;
}

export async function getMissingCoverContent(): Promise<WarningItem[]> {
  const prisma = getPrisma();
  const warnings: WarningItem[] = [];

  // Check articles
  const articles = await prisma.article.findMany({
    where: {
      AND: [
        {
          OR: [
            { coverImage: null },
            { coverImage: "" },
          ],
        },
        {
          OR: [
            { coverLabel: null },
            { coverLabel: "" },
          ],
        },
      ],
    },
    select: { id: true, title: true, slug: true },
  });

  warnings.push(
    ...articles.map((a) => ({
      id: a.id.toString(),
      type: "article" as const,
      title: a.title,
      slug: a.slug,
      issue: "Missing both cover image and cover label",
      editUrl: `/admin/articles/${a.id}/edit`,
    }))
  );

  // Check events
  const events = await prisma.event.findMany({
    where: {
      AND: [
        {
          OR: [
            { coverImage: null },
            { coverImage: "" },
          ],
        },
        {
          OR: [
            { coverLabel: null },
            { coverLabel: "" },
          ],
        },
      ],
    },
    select: { id: true, title: true, slug: true },
  });

  warnings.push(
    ...events.map((e) => ({
      id: e.id.toString(),
      type: "event" as const,
      title: e.title,
      slug: e.slug,
      issue: "Missing both cover image and cover label",
      editUrl: `/admin/events/${e.id}/edit`,
    }))
  );

  // Check media coverage
  const media = await prisma.mediaCoverage.findMany({
    where: {
      AND: [
        {
          OR: [
            { coverImage: null },
            { coverImage: "" },
          ],
        },
        {
          OR: [
            { coverLabel: null },
            { coverLabel: "" },
          ],
        },
      ],
    },
    select: { id: true, title: true, slug: true },
  });

  warnings.push(
    ...media.map((m) => ({
      id: m.id.toString(),
      type: "media" as const,
      title: m.title,
      slug: m.slug,
      issue: "Missing both cover image and cover label",
      editUrl: `/admin/media/${m.id}/edit`,
    }))
  );

  // Check podcast episodes
  const podcasts = await prisma.podcastEpisode.findMany({
    where: {
      AND: [
        {
          OR: [
            { coverImage: null },
            { coverImage: "" },
          ],
        },
        {
          OR: [
            { coverLabel: null },
            { coverLabel: "" },
          ],
        },
      ],
    },
    select: { id: true, title: true, slug: true },
  });

  warnings.push(
    ...podcasts.map((p) => ({
      id: p.id.toString(),
      type: "podcast" as const,
      title: p.title,
      slug: p.slug,
      issue: "Missing both cover image and cover label",
      editUrl: `/admin/podcast/${p.id}/edit`,
    }))
  );

  return warnings;
}

export async function getEmptyMediaGalleries(): Promise<WarningItem[]> {
  const prisma = getPrisma();

  const mediaWithEmptyGallery = await prisma.mediaCoverage.findMany({
    where: {
      gallery: {
        none: {},
      },
    },
    select: { id: true, title: true, slug: true },
  });

  return mediaWithEmptyGallery.map((m) => ({
    id: m.id.toString(),
    type: "media" as const,
    title: m.title,
    slug: m.slug,
    issue: "Media coverage has empty gallery",
    editUrl: `/admin/media/${m.id}/edit`,
  }));
}

export async function getInvalidPodcastUrls(): Promise<WarningItem[]> {
  const prisma = getPrisma();

  const podcasts = await prisma.podcastEpisode.findMany({
    where: {
      youtubeUrl: "",
    },
    select: { id: true, title: true, slug: true, youtubeUrl: true },
  });

  const warnings: WarningItem[] = podcasts.map((p) => ({
    id: p.id.toString(),
    type: "podcast" as const,
    title: p.title,
    slug: p.slug,
    issue: "Invalid or empty YouTube URL",
    editUrl: `/admin/podcast/${p.id}/edit`,
  }));

  // Also check for malformed URLs
  const allPodcasts = await prisma.podcastEpisode.findMany({
    select: { id: true, title: true, slug: true, youtubeUrl: true },
  });

  for (const podcast of allPodcasts) {
    if (
      podcast.youtubeUrl &&
      !podcast.youtubeUrl.includes("youtube.com") &&
      !podcast.youtubeUrl.includes("youtu.be")
    ) {
      warnings.push({
        id: podcast.id.toString(),
        type: "podcast" as const,
        title: podcast.title,
        slug: podcast.slug,
        issue: "YouTube URL doesn't appear valid",
        editUrl: `/admin/podcast/${podcast.id}/edit`,
      });
    }
  }

  return warnings;
}

export async function getAllWarnings(): Promise<WarningItem[]> {
  const [
    publishedWithoutDate,
    missingCover,
    emptyGalleries,
    invalidUrls,
  ] = await Promise.all([
    getPublishedWithoutDate(),
    getMissingCoverContent(),
    getEmptyMediaGalleries(),
    getInvalidPodcastUrls(),
  ]);

  return [
    ...publishedWithoutDate,
    ...missingCover,
    ...emptyGalleries,
    ...invalidUrls,
  ];
}
