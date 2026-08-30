import "server-only";

import sharp from "sharp";
import { getSupabaseAdminClient } from "@/lib/auth/supabase-admin";
import { IMAGE_MAX_WIDTH, validateImageFile } from "./images";

/** Carries an HTTP status so route handlers can surface the right code. */
export class ImageStorageError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message);
    this.name = "ImageStorageError";
  }
}

type SniffedFormat = "jpeg" | "png" | "webp";

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

function startsWith(buffer: Buffer, bytes: number[], offset = 0): boolean {
  if (buffer.length < offset + bytes.length) return false;
  for (let i = 0; i < bytes.length; i += 1) {
    if (buffer[offset + i] !== bytes[i]) return false;
  }
  return true;
}

/**
 * Reads the leading magic bytes to classify the container before we hand the
 * buffer to `sharp`. A `null` result means the bytes match none of the allowed
 * formats — reject before decoding. This defends against polyglots and
 * mislabeled uploads independently of the client-declared MIME type.
 */
export function sniffImageFormat(buffer: Buffer): SniffedFormat | null {
  // JPEG: FF D8 FF (SOI + start of first marker).
  if (startsWith(buffer, [0xff, 0xd8, 0xff])) return "jpeg";
  // PNG: 8-byte signature.
  if (startsWith(buffer, PNG_SIGNATURE)) return "png";
  // WebP: "RIFF" at 0, "WEBP" at 8.
  if (
    startsWith(buffer, [0x52, 0x49, 0x46, 0x46]) &&
    startsWith(buffer, [0x57, 0x45, 0x42, 0x50], 8)
  ) {
    return "webp";
  }
  return null;
}

/**
 * Validates, verifies, and re-encodes an uploaded image to WebP. The pipeline
 * is deliberately paranoid: metadata allowlist, magic-byte sniff, a sharp
 * decode that must agree with the sniffed format, then an unconditional
 * re-encode that strips EXIF/metadata and destroys any embedded payload.
 */
export async function optimizeImage(file: File): Promise<Buffer> {
  const metadataError = validateImageFile(file);
  if (metadataError) throw new ImageStorageError(metadataError);

  const input = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffImageFormat(input);
  if (!sniffed) {
    throw new ImageStorageError(
      "The uploaded file is not a valid JPEG, PNG, or WebP image."
    );
  }

  try {
    const image = sharp(input, {
      failOn: "warning",
      limitInputPixels: 40_000_000,
    });
    const metadata = await image.metadata();
    if (metadata.format !== sniffed) {
      throw new ImageStorageError(
        "The uploaded file is not a valid JPEG, PNG, or WebP image."
      );
    }

    return await image
      .rotate()
      .resize({
        width: IMAGE_MAX_WIDTH,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();
  } catch (error) {
    if (error instanceof ImageStorageError) throw error;
    throw new ImageStorageError("The uploaded image could not be decoded safely.");
  }
}

/** Uploads a WebP buffer to a bucket at a fixed content type; never upserts. */
export async function uploadImageObject(
  bucket: string,
  path: string,
  body: Buffer
): Promise<void> {
  const { error } = await getSupabaseAdminClient()
    .storage.from(bucket)
    .upload(path, body, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });
  if (error) {
    throw new ImageStorageError(`Storage upload failed: ${error.message}`, 502);
  }
}

/** Removes a single object from a bucket. */
export async function removeImageObject(
  bucket: string,
  path: string
): Promise<void> {
  const { error } = await getSupabaseAdminClient()
    .storage.from(bucket)
    .remove([path]);
  if (error) {
    throw new ImageStorageError(`Storage deletion failed: ${error.message}`, 502);
  }
}
