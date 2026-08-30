import "server-only";

import { randomUUID } from "node:crypto";
import {
  ImageStorageError,
  optimizeImage,
  removeImageObject,
  uploadImageObject,
} from "./images-server";
import {
  ARTICLE_IMAGE_BUCKET,
  ARTICLE_IMAGE_MIME_TYPES,
  isManagedArticleImagePath,
} from "./article-images";

/**
 * Retained export name. It is the shared `ImageStorageError` so existing
 * `error instanceof ArticleImageError` checks keep matching errors thrown by
 * the shared image core.
 */
export { ImageStorageError as ArticleImageError } from "./images-server";

export function optimizeArticleImage(file: File): Promise<Buffer> {
  return optimizeImage(file);
}

export function makeArticleImagePath(ownerId: string, articleId: bigint): string {
  const path = `articles/${ownerId}/${articleId.toString()}/${randomUUID()}.webp`;
  if (!isManagedArticleImagePath(path)) {
    throw new ImageStorageError("Cannot create a safe Storage path.", 500);
  }
  return path;
}

export async function uploadArticleImage(path: string, body: Buffer): Promise<void> {
  if (!isManagedArticleImagePath(path)) {
    throw new ImageStorageError("Invalid article image path.", 500);
  }
  await uploadImageObject(ARTICLE_IMAGE_BUCKET, path, body);
}

export async function removeArticleImage(path: string): Promise<void> {
  if (!isManagedArticleImagePath(path)) return;
  await removeImageObject(ARTICLE_IMAGE_BUCKET, path);
}

export const ARTICLE_IMAGE_BUCKET_MIME_TYPES = [...ARTICLE_IMAGE_MIME_TYPES];
