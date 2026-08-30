import Image from "next/image";
import {
  getArticleImageUrl,
  isLegacyArticleImageUrl,
} from "@/lib/storage/article-images";

export default function ArticleCoverImage({
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
  const url = getArticleImageUrl(path);
  return (
    <div className={`relative overflow-hidden border border-[var(--line)] bg-[var(--sand)] ${className}`}>
      {url && !isLegacyArticleImageUrl(path) ? (
        <Image src={url} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : url ? (
        // Legacy database URLs may use a host not present in next/image config.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-hand text-3xl font-bold text-[rgba(130,27,22,0.38)]">
          {label || "INSAT Press"}
        </span>
      )}
    </div>
  );
}
