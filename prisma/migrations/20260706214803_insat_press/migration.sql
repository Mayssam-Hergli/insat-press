-- CreateEnum
CREATE TYPE "content_status" AS ENUM ('draft', 'published', 'archived');

-- CreateEnum
CREATE TYPE "admin_role" AS ENUM ('admin', 'editor');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "role" "admin_role" NOT NULL DEFAULT 'editor',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "writers" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "bio" TEXT,
    "avatar_url" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "writers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" BIGSERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT '[]',
    "cover_image" TEXT,
    "cover_label" TEXT,
    "source_url" TEXT,
    "display_date" TEXT,
    "status" "content_status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by_id" UUID,
    "updated_by_id" UUID,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_writers" (
    "article_id" BIGINT NOT NULL,
    "writer_id" BIGINT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "article_writers_pkey" PRIMARY KEY ("article_id","writer_id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" BIGSERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "edition" TEXT,
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT '[]',
    "cover_image" TEXT,
    "cover_label" TEXT,
    "display_date" TEXT,
    "starts_at" TIMESTAMPTZ(6),
    "location" TEXT,
    "status" "content_status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by_id" UUID,
    "updated_by_id" UUID,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "podcast_episodes" (
    "id" BIGSERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "editedBy" TEXT NOT NULL,
    "guest" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT '[]',
    "cover_image" TEXT,
    "cover_label" TEXT,
    "youtube_url" TEXT NOT NULL,
    "display_date" TEXT,
    "released_at" TIMESTAMPTZ(6),
    "status" "content_status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by_id" UUID,
    "updated_by_id" UUID,

    CONSTRAINT "podcast_episodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_coverage" (
    "id" BIGSERIAL NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "coveredBy" TEXT NOT NULL,
    "editedBy" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" JSONB NOT NULL DEFAULT '[]',
    "cover_image" TEXT,
    "cover_label" TEXT,
    "display_date" TEXT,
    "covered_at" TIMESTAMPTZ(6),
    "status" "content_status" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "created_by_id" UUID,
    "updated_by_id" UUID,

    CONSTRAINT "media_coverage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_gallery_images" (
    "id" BIGSERIAL NOT NULL,
    "media_coverage_id" BIGINT NOT NULL,
    "src" TEXT,
    "alt" TEXT,
    "label" TEXT NOT NULL,
    "caption" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "media_gallery_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "writers_slug_key" ON "writers"("slug");

-- CreateIndex
CREATE INDEX "writers_name_idx" ON "writers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_published_at_idx" ON "articles"("status", "published_at");

-- CreateIndex
CREATE INDEX "articles_category_idx" ON "articles"("category");

-- CreateIndex
CREATE INDEX "articles_created_by_id_idx" ON "articles"("created_by_id");

-- CreateIndex
CREATE INDEX "articles_updated_by_id_idx" ON "articles"("updated_by_id");

-- CreateIndex
CREATE INDEX "article_writers_writer_id_idx" ON "article_writers"("writer_id");

-- CreateIndex
CREATE INDEX "article_writers_article_id_sort_order_idx" ON "article_writers"("article_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_status_published_at_idx" ON "events"("status", "published_at");

-- CreateIndex
CREATE INDEX "events_type_idx" ON "events"("type");

-- CreateIndex
CREATE INDEX "events_starts_at_idx" ON "events"("starts_at");

-- CreateIndex
CREATE INDEX "events_created_by_id_idx" ON "events"("created_by_id");

-- CreateIndex
CREATE INDEX "events_updated_by_id_idx" ON "events"("updated_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "podcast_episodes_slug_key" ON "podcast_episodes"("slug");

-- CreateIndex
CREATE INDEX "podcast_episodes_status_published_at_idx" ON "podcast_episodes"("status", "published_at");

-- CreateIndex
CREATE INDEX "podcast_episodes_released_at_idx" ON "podcast_episodes"("released_at");

-- CreateIndex
CREATE INDEX "podcast_episodes_created_by_id_idx" ON "podcast_episodes"("created_by_id");

-- CreateIndex
CREATE INDEX "podcast_episodes_updated_by_id_idx" ON "podcast_episodes"("updated_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_coverage_slug_key" ON "media_coverage"("slug");

-- CreateIndex
CREATE INDEX "media_coverage_status_published_at_idx" ON "media_coverage"("status", "published_at");

-- CreateIndex
CREATE INDEX "media_coverage_type_idx" ON "media_coverage"("type");

-- CreateIndex
CREATE INDEX "media_coverage_covered_at_idx" ON "media_coverage"("covered_at");

-- CreateIndex
CREATE INDEX "media_coverage_created_by_id_idx" ON "media_coverage"("created_by_id");

-- CreateIndex
CREATE INDEX "media_coverage_updated_by_id_idx" ON "media_coverage"("updated_by_id");

-- CreateIndex
CREATE INDEX "media_gallery_images_media_coverage_id_sort_order_idx" ON "media_gallery_images"("media_coverage_id", "sort_order");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_writers" ADD CONSTRAINT "article_writers_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_writers" ADD CONSTRAINT "article_writers_writer_id_fkey" FOREIGN KEY ("writer_id") REFERENCES "writers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_episodes" ADD CONSTRAINT "podcast_episodes_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "podcast_episodes" ADD CONSTRAINT "podcast_episodes_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_coverage" ADD CONSTRAINT "media_coverage_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_coverage" ADD CONSTRAINT "media_coverage_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_gallery_images" ADD CONSTRAINT "media_gallery_images_media_coverage_id_fkey" FOREIGN KEY ("media_coverage_id") REFERENCES "media_coverage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
