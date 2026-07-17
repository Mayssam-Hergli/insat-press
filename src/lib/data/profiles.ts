import type { Prisma, Profile } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import { runDataQuery, slugify, type PaginationOptions } from "./utils";

const profileOrderBy = { createdAt: "desc" } satisfies Prisma.ProfileOrderByWithRelationInput;

export function getAllProfiles(
  options: PaginationOptions = {}
): Promise<Profile[]> {
  return runDataQuery("get all profiles", () =>
    getPrisma().profile.findMany({
      orderBy: profileOrderBy,
      skip: options.skip,
      take: options.take,
    })
  );
}

export function searchProfiles(query: string): Promise<Profile[]> {
  return runDataQuery(`search profiles "${query}"`, () =>
    getPrisma().profile.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: profileOrderBy,
    })
  );
}

export function getProfileById(id: string): Promise<Profile | null> {
  return runDataQuery(`get profile by id ${id}`, () =>
    getPrisma().profile.findUnique({ where: { id } })
  );
}

export function getProfileByEmail(email: string): Promise<Profile | null> {
  return runDataQuery(`get profile by email ${email}`, () =>
    getPrisma().profile.findUnique({ where: { email } })
  );
}

export function getProfileBySlug(slug: string): Promise<Profile | null> {
  return runDataQuery(`get profile by slug ${slug}`, () =>
    getPrisma().profile.findUnique({ where: { slug } })
  );
}

export async function generateUniqueProfileSlug(fullName: string): Promise<string> {
  return runDataQuery(`generate unique profile slug for "${fullName}"`, async () => {
    const prisma = getPrisma();
    const base = slugify(fullName) || "member";

    let candidate = base;
    let suffix = 1;
    while (await prisma.profile.findUnique({ where: { slug: candidate } })) {
      suffix += 1;
      candidate = `${base}-${suffix}`;
    }

    return candidate;
  });
}

export async function countProfileContributions(
  id: string
): Promise<{ articleCount: number; mediaCount: number }> {
  return runDataQuery(`count contributions for profile ${id}`, async () => {
    const prisma = getPrisma();
    const [articleCount, mediaCount] = await Promise.all([
      prisma.articleWriter.count({ where: { profileId: id } }),
      prisma.mediaCoverageContributor.count({ where: { profileId: id } }),
    ]);
    return { articleCount, mediaCount };
  });
}

export function createProfile(data: Prisma.ProfileCreateInput): Promise<Profile> {
  return runDataQuery("create profile", () =>
    getPrisma().profile.create({ data })
  );
}

export function updateProfile(
  id: string,
  data: Prisma.ProfileUpdateInput
): Promise<Profile> {
  return runDataQuery(`update profile ${id}`, () =>
    getPrisma().profile.update({ where: { id }, data })
  );
}

export function deleteProfile(id: string): Promise<Profile> {
  return runDataQuery(`delete profile ${id}`, () =>
    getPrisma().profile.delete({ where: { id } })
  );
}
