-- Add the spotify_url column that the schema declares but the database never
-- received (schema drift). The table is empty, so a NOT NULL column with no
-- default is safe.
ALTER TABLE "podcast_episodes" ADD COLUMN "spotify_url" TEXT NOT NULL;
