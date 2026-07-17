import "server-only";

import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { getSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import {
  ARTICLE_IMAGE_BUCKET,
  ARTICLE_IMAGE_MAX_WIDTH,
  ARTICLE_IMAGE_MIME_TYPES,
  isManagedArticleImagePath,
  validateArticleImageFile,
} from "./article-images";

export class ArticleImageError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = "ArticleImageError";
  }
}

export async function optimizeArticleImage(file: File): Promise<Buffer> {
  const metadataError = validateArticleImageFile(file);
  if (metadataError) throw new ArticleImageError(metadataError);

  const input = Buffer.from(await file.arrayBuffer());
  try {
    const image = sharp(input, {
      failOn: "warning",
      limitInputPixels: 40_000_000,
    });
    const metadata = await image.metadata();
    if (!metadata.format || !["jpeg", "png", "webp"].includes(metadata.format)) {
      throw new ArticleImageError("The uploaded file is not a valid JPEG, PNG, or WebP image.");
    }

    return await image
      .rotate()
      .resize({
        width: ARTICLE_IMAGE_MAX_WIDTH,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();
  } catch (error) {
    if (error instanceof ArticleImageError) throw error;
    throw new ArticleImageError("The uploaded image could not be decoded safely.");
  }
}

export function makeArticleImagePath(ownerId: string, articleId: bigint): string {
  const path = `articles/${ownerId}/${articleId.toString()}/${randomUUID()}.webp`;
  if (!isManagedArticleImagePath(path)) {
    throw new ArticleImageError("Cannot create a safe Storage path.", 500);
  }
  return path;
}

export async function uploadArticleImage(path: string, body: Buffer): Promise<void> {
  if (!isManagedArticleImagePath(path)) {
    throw new ArticleImageError("Invalid article image path.", 500);
  }
  const { error } = await getSupabaseAdminClient()
    .storage.from(ARTICLE_IMAGE_BUCKET)
    .upload(path, body, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) throw new ArticleImageError(`Storage upload failed: ${error.message}`, 502);
}

export async function removeArticleImage(path: string): Promise<void> {
  if (!isManagedArticleImagePath(path)) return;
  const { error } = await getSupabaseAdminClient()
    .storage.from(ARTICLE_IMAGE_BUCKET)
    .remove([path]);
  if (error) throw new ArticleImageError(`Storage deletion failed: ${error.message}`, 502);
}

export const ARTICLE_IMAGE_BUCKET_MIME_TYPES = [...ARTICLE_IMAGE_MIME_TYPES];
