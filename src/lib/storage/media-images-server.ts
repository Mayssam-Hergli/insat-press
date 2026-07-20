import "server-only";

import { randomUUID } from "node:crypto";
import {
  ImageStorageError,
  optimizeImage,
  removeImageObject,
  uploadImageObject,
} from "./images-server";
import { MEDIA_IMAGE_BUCKET, isManagedMediaImagePath } from "./media-images";

export function optimizeMediaImage(file: File): Promise<Buffer> {
  return optimizeImage(file);
}

export function makeMediaImagePath(ownerId: string, mediaId: bigint): string {
  const path = `media/${ownerId}/${mediaId.toString()}/${randomUUID()}.webp`;
  if (!isManagedMediaImagePath(path)) {
    throw new ImageStorageError("Cannot create a safe Storage path.", 500);
  }
  return path;
}

export async function uploadMediaImage(path: string, body: Buffer): Promise<void> {
  if (!isManagedMediaImagePath(path)) {
    throw new ImageStorageError("Invalid media image path.", 500);
  }
  await uploadImageObject(MEDIA_IMAGE_BUCKET, path, body);
}

export async function removeMediaImage(path: string): Promise<void> {
  if (!isManagedMediaImagePath(path)) return;
  await removeImageObject(MEDIA_IMAGE_BUCKET, path);
}
