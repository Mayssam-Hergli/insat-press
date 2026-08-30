-- CreateEnum
CREATE TYPE "contributor_role" AS ENUM ('covered_by', 'edited_by');

-- DropForeignKey
ALTER TABLE "article_writers" DROP CONSTRAINT "article_writers_writer_id_fkey";

-- DropIndex
DROP INDEX "article_writers_writer_id_idx";

-- AlterTable
ALTER TABLE "article_writers" DROP CONSTRAINT "article_writers_pkey",
DROP COLUMN "writer_id",
ADD COLUMN     "profile_id" UUID NOT NULL,
ADD CONSTRAINT "article_writers_pkey" PRIMARY KEY ("article_id", "profile_id");

-- AlterTable
ALTER TABLE "media_coverage" DROP COLUMN "coveredBy",
DROP COLUMN "editedBy";

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "slug" TEXT;

-- DropTable
DROP TABLE "writers";

-- CreateTable
CREATE TABLE "media_coverage_contributors" (
    "media_coverage_id" BIGINT NOT NULL,
    "profile_id" UUID NOT NULL,
    "role" "contributor_role" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "media_coverage_contributors_pkey" PRIMARY KEY ("media_coverage_id","profile_id","role")
);

-- CreateIndex
CREATE INDEX "media_coverage_contributors_profile_id_idx" ON "media_coverage_contributors"("profile_id");

-- CreateIndex
CREATE INDEX "media_coverage_contributors_media_coverage_id_role_sort_ord_idx" ON "media_coverage_contributors"("media_coverage_id", "role", "sort_order");

-- CreateIndex
CREATE INDEX "article_writers_profile_id_idx" ON "article_writers"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_slug_key" ON "profiles"("slug");

-- AddForeignKey
ALTER TABLE "article_writers" ADD CONSTRAINT "article_writers_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_coverage_contributors" ADD CONSTRAINT "media_coverage_contributors_media_coverage_id_fkey" FOREIGN KEY ("media_coverage_id") REFERENCES "media_coverage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_coverage_contributors" ADD CONSTRAINT "media_coverage_contributors_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

