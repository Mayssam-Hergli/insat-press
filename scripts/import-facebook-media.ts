/**
 * One-off import: pulls the last year of posts from the INSAT Press Facebook
 * Page via the Graph API and creates a DRAFT MediaCoverage row for each one,
 * for a human to review, edit, and publish from /admin/media.
 *
 * Usage: npm run import:facebook
 * Requires (see .env.example): FACEBOOK_PAGE_ID, FACEBOOK_PAGE_ACCESS_TOKEN,
 * IMPORT_PROFILE_EMAIL, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 * plus the app's usual DATABASE_URL/DIRECT_URL.
 *
 * Safe to re-run: each post's slug is derived from its Facebook post id, so
 * posts already imported are skipped rather than duplicated.
 */
import "dotenv/config";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { createClient } from "@supabase/supabase-js";
import { getPrisma } from "./lib/db";
import { IMAGE_MAX_WIDTH } from "../src/lib/storage/images";
import { MEDIA_IMAGE_BUCKET, isManagedMediaImagePath } from "../src/lib/storage/media-images";

const GRAPH_API_VERSION = "v21.0";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

type FacebookPost = {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
};

type FacebookPostsResponse = {
  data: FacebookPost[];
  paging?: { next?: string };
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function slugForPost(post: FacebookPost): string {
  // Post ids look like "{page-id}_{post-id}" — keep it short and unique.
  const suffix = post.id.split("_").pop() ?? post.id;
  return `fb-${suffix}`;
}

function titleForPost(post: FacebookPost): string {
  const firstLine = post.message?.split("\n").find((line) => line.trim().length > 0)?.trim();
  if (firstLine) return firstLine.slice(0, 120);
  return `Facebook post — ${new Date(post.created_time).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" })}`;
}

async function fetchPostsSince(pageId: string, token: string, sinceUnix: number): Promise<FacebookPost[]> {
  const posts: FacebookPost[] = [];
  let url: string | undefined =
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${pageId}/posts` +
    `?fields=id,message,created_time,full_picture&since=${sinceUnix}&limit=50&access_token=${token}`;

  while (url) {
    const response = await fetch(url);
    const body = (await response.json()) as FacebookPostsResponse & { error?: { message: string } };
    if (!response.ok) {
      throw new Error(`Graph API error: ${body.error?.message ?? response.statusText}`);
    }
    posts.push(...body.data);
    url = body.paging?.next;
  }

  return posts;
}

function getSupabaseAdmin() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const secret = process.env.SUPABASE_SECRET_KEY ?? requireEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

/**
 * Downloads a Facebook-hosted photo and re-hosts it in our own Supabase
 * Storage bucket, resized to the same max width used for admin uploads.
 * We don't want to store Facebook's CDN URL directly — those can rot.
 */
async function importCoverImage(ownerId: string, mediaId: bigint, sourceUrl: string): Promise<string> {
  const response = await fetch(sourceUrl);
  if (!response.ok) throw new Error(`Failed to download image: ${response.statusText}`);
  const input = Buffer.from(await response.arrayBuffer());

  const optimized = await sharp(input, { failOn: "warning", limitInputPixels: 40_000_000 })
    .rotate()
    .resize({ width: IMAGE_MAX_WIDTH, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const path = `media/${ownerId}/${mediaId.toString()}/${randomUUID()}.webp`;
  if (!isManagedMediaImagePath(path)) throw new Error("Generated an invalid Storage path.");

  const { error } = await getSupabaseAdmin().storage.from(MEDIA_IMAGE_BUCKET).upload(path, optimized, {
    contentType: "image/webp",
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  return path;
}

async function main() {
  const pageId = requireEnv("FACEBOOK_PAGE_ID");
  const token = requireEnv("FACEBOOK_PAGE_ACCESS_TOKEN");
  const profileEmail = requireEnv("IMPORT_PROFILE_EMAIL");
  const prisma = getPrisma();

  const profile = await prisma.profile.findUnique({ where: { email: profileEmail } });
  if (!profile) throw new Error(`No profile found for IMPORT_PROFILE_EMAIL="${profileEmail}"`);

  const sinceUnix = Math.floor((Date.now() - ONE_YEAR_MS) / 1000);
  console.log(`Fetching posts since ${new Date(sinceUnix * 1000).toISOString()}...`);
  const posts = await fetchPostsSince(pageId, token, sinceUnix);
  console.log(`Found ${posts.length} posts.`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const post of posts) {
    const slug = slugForPost(post);
    try {
      const existing = await prisma.mediaCoverage.findUnique({ where: { slug } });
      if (existing) {
        skipped += 1;
        continue;
      }

      const title = titleForPost(post);
      const description = (post.message ?? "Imported from Facebook.").slice(0, 300);

      const mediaCoverage = await prisma.mediaCoverage.create({
        data: {
          slug,
          title,
          eventName: title,
          type: "Facebook Recap",
          description,
          content: post.message ?? "",
          status: "DRAFT",
          coveredAt: new Date(post.created_time),
          createdBy: { connect: { id: profile.id } },
          updatedBy: { connect: { id: profile.id } },
        },
      });

      if (post.full_picture) {
        try {
          const path = await importCoverImage(profile.id, mediaCoverage.id, post.full_picture);
          await prisma.mediaCoverage.update({ where: { id: mediaCoverage.id }, data: { coverImage: path } });
        } catch (imageError) {
          console.error(`  cover image failed for "${title}":`, imageError);
        }
      }

      created += 1;
      console.log(`  created: ${title}`);
    } catch (error) {
      failed += 1;
      console.error(`  failed on post ${post.id}:`, error);
    }
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped} (already imported), failed ${failed}.`);
  console.log("Review and publish from /admin/media — everything landed as DRAFT.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
