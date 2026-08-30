-- AlterTable
ALTER TABLE "articles" ALTER COLUMN "content" SET DEFAULT '',
ALTER COLUMN "content" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "events" ALTER COLUMN "content" SET DEFAULT '',
ALTER COLUMN "content" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "media_coverage" ALTER COLUMN "content" SET DEFAULT '',
ALTER COLUMN "content" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "podcast_episodes" ALTER COLUMN "content" SET DEFAULT '',
ALTER COLUMN "content" SET DATA TYPE TEXT;
