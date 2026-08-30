import Image from "next/image";
import { isHttpUrl } from "@/lib/storage/images";
import { getMediaImageUrl } from "@/lib/storage/media-images";

/**
 * Renders a stored media image reference: managed object paths go through
 * `next/image`, legacy http(s) URLs fall back to a plain `<img>` (their host may
 * not be in the images config), and a missing image shows a label tile.
 */
export default function MediaImage({
  path,
  alt,
  label,
  className,
  sizes,
  priority = false,
}: {
  path?: string | null;
  alt: string;
  label?: string | null;
  className: string;
  sizes: string;
  priority?: boolean;
}) {
  const url = getMediaImageUrl(path);
  return (
    <div
      className={`relative overflow-hidden border border-[var(--line)] bg-[var(--sand)] ${className}`}
    >
      {url && !isHttpUrl(path) ? (
        <Image src={url} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : url ? (
        // Legacy database URLs may use a host not present in next/image config.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-hand text-6xl font-bold text-[rgba(130,27,22,0.38)] md:text-7xl">
          {label || "INSAT Press"}
        </span>
      )}
    </div>
  );
}
