/**
 * One-off import: pulls the last year of uploads from the INSAT Press YouTube
 * channel via the YouTube Data API and creates a DRAFT PodcastEpisode row for
 * each one, for a human to review, fill in the gaps (guest, Spotify link),
 * and publish from /admin/podcast.
 *
 * Usage: npm run import:youtube
 * Requires (see .env.example): YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID,
 * IMPORT_PROFILE_EMAIL, plus the app's usual DATABASE_URL/DIRECT_URL.
 *
 * Safe to re-run: each video's slug is derived from its YouTube video id, so
 * videos already imported are skipped rather than duplicated.
 */
import "dotenv/config";
import { getPrisma } from "./lib/db";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

type PlaylistItem = {
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    resourceId: { videoId: string };
    thumbnails: { high?: { url: string }; default?: { url: string } };
  };
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

async function getChannelInfo(channelId: string, apiKey: string) {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&id=${channelId}&key=${apiKey}`;
  const response = await fetch(url);
  const body = await response.json();
  if (!response.ok || !body.items?.length) {
    throw new Error(`YouTube API error: ${body.error?.message ?? response.statusText}`);
  }
  const channel = body.items[0];
  return {
    title: channel.snippet.title as string,
    uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads as string,
  };
}

async function fetchUploadsSince(playlistId: string, apiKey: string, since: Date): Promise<PlaylistItem[]> {
  const items: PlaylistItem[] = [];
  let pageToken: string | undefined;

  outer: while (true) {
    const url =
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}` +
      `&maxResults=50&key=${apiKey}` + (pageToken ? `&pageToken=${pageToken}` : "");
    const response = await fetch(url);
    const body = await response.json();
    if (!response.ok) {
      throw new Error(`YouTube API error: ${body.error?.message ?? response.statusText}`);
    }

    for (const item of body.items as PlaylistItem[]) {
      if (new Date(item.snippet.publishedAt) < since) break outer; // uploads playlist is newest-first
      items.push(item);
    }

    pageToken = body.nextPageToken;
    if (!pageToken) break;
  }

  return items;
}

async function main() {
  const apiKey = requireEnv("YOUTUBE_API_KEY");
  const channelId = requireEnv("YOUTUBE_CHANNEL_ID");
  const profileEmail = requireEnv("IMPORT_PROFILE_EMAIL");

  const prisma = getPrisma();
  const profile = await prisma.profile.findUnique({ where: { email: profileEmail } });
  if (!profile) throw new Error(`No profile found for IMPORT_PROFILE_EMAIL="${profileEmail}"`);

  const channel = await getChannelInfo(channelId, apiKey);
  const since = new Date(Date.now() - ONE_YEAR_MS);
  console.log(`Fetching "${channel.title}" uploads since ${since.toISOString()}...`);
  const videos = await fetchUploadsSince(channel.uploadsPlaylistId, apiKey, since);
  console.log(`Found ${videos.length} videos.`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const video of videos) {
    const { videoId } = video.snippet.resourceId;
    const slug = `yt-${videoId}`;
    try {
      const existing = await prisma.podcastEpisode.findUnique({ where: { slug } });
      if (existing) {
        skipped += 1;
        continue;
      }

      const title = video.snippet.title;
      const description = video.snippet.description || "Imported from YouTube.";
      const coverImage = video.snippet.thumbnails.high?.url ?? video.snippet.thumbnails.default?.url ?? null;

      await prisma.podcastEpisode.create({
        data: {
          slug,
          title,
          host: channel.title,
          editedBy: "INSAT Press",
          guest: "TBD — edit before publishing",
          description: description.slice(0, 300),
          content: description,
          coverImage,
          youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
          spotifyUrl: "#",
          releasedAt: new Date(video.snippet.publishedAt),
          status: "DRAFT",
          createdBy: { connect: { id: profile.id } },
          updatedBy: { connect: { id: profile.id } },
        },
      });

      created += 1;
      console.log(`  created: ${title}`);
    } catch (error) {
      failed += 1;
      console.error(`  failed on video ${videoId}:`, error);
    }
  }

  console.log(`\nDone. Created ${created}, skipped ${skipped} (already imported), failed ${failed}.`);
  console.log("Review and publish from /admin/podcast — everything landed as DRAFT, guest/Spotify link need filling in.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
