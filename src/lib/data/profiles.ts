import type { Prisma, Profile } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/db/prisma";
import { runDataQuery, type PaginationOptions } from "./utils";

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
