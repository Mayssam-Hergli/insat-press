-- Add a "pending" content status for the approval workflow.
-- (New enum value only; it is not referenced elsewhere in this migration.)
ALTER TYPE "content_status" ADD VALUE IF NOT EXISTS 'pending' AFTER 'draft';

-- Split the "editor" role into section-scoped "writer" and "media" roles.
-- Postgres cannot drop an enum value in place, so recreate the type and remap
-- any existing "editor" profiles to "writer".
ALTER TABLE "profiles" ALTER COLUMN "role" DROP DEFAULT;

ALTER TYPE "admin_role" RENAME TO "admin_role_old";

CREATE TYPE "admin_role" AS ENUM ('admin', 'writer', 'media');

ALTER TABLE "profiles"
  ALTER COLUMN "role" TYPE "admin_role"
  USING (
    CASE "role"::text
      WHEN 'editor' THEN 'writer'
      ELSE "role"::text
    END::"admin_role"
  );

ALTER TABLE "profiles" ALTER COLUMN "role" SET DEFAULT 'writer';

DROP TYPE "admin_role_old";
