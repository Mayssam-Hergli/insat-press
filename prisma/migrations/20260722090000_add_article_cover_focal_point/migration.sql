ALTER TABLE "articles"
ADD COLUMN "cover_focal_x" DOUBLE PRECISION NOT NULL DEFAULT 50,
ADD COLUMN "cover_focal_y" DOUBLE PRECISION NOT NULL DEFAULT 50;

ALTER TABLE "articles"
ADD CONSTRAINT "articles_cover_focal_x_range"
CHECK ("cover_focal_x" >= 0 AND "cover_focal_x" <= 100),
ADD CONSTRAINT "articles_cover_focal_y_range"
CHECK ("cover_focal_y" >= 0 AND "cover_focal_y" <= 100);
