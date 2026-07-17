import type { NextConfig } from "next";
import path from "node:path";

function supabaseStoragePattern() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) return [];
  try {
    const url = new URL(value);
    return [{
      protocol: "https" as const,
      hostname: url.hostname,
      port: "",
      pathname: "/storage/v1/object/public/article-images/**",
      search: "",
    }];
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL.");
  }
}

const nextConfig: NextConfig = {
  images: { remotePatterns: supabaseStoragePattern() },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
