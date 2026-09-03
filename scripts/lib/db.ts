/**
 * Standalone Prisma client for one-off scripts. Deliberately does NOT import
 * from src/lib/db/prisma.ts: that file starts with `import "server-only"`,
 * which Next.js's bundler treats as a no-op guard but which unconditionally
 * throws in a plain Node/tsx process (there's no bundler here to intercept
 * it). This is the same connection setup, just runnable outside Next.
 */
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";

let prisma: PrismaClient | undefined;

export function getPrisma(): PrismaClient {
  if (prisma) return prisma;

  const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL;
  if (!connectionString) {
    throw new Error("Missing DATABASE_URL or DIRECT_URL. Prisma needs a PostgreSQL connection string.");
  }

  const adapter = new PrismaPg({ connectionString });
  prisma = new PrismaClient({ adapter });
  return prisma;
}
