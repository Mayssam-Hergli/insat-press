import type { NextConfig } from "next";
import path from "node:path";

/** Public Supabase Storage buckets whose objects are rendered via next/image. */
const SUPABASE_IMAGE_BUCKETS = ["article-images", "media-images"];

function supabaseStoragePatterns() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) return [];
  try {
    const url = new URL(value);
    return SUPABASE_IMAGE_BUCKETS.map((bucket) => ({
      protocol: "https" as const,
      hostname: url.hostname,
      port: "",
      pathname: `/storage/v1/object/public/${bucket}/**`,
      search: "",
    }));
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL.");
  }
}

const nextConfig: NextConfig = {
  images: { remotePatterns: supabaseStoragePatterns() },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
