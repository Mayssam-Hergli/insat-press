"use client";

import CoverImagePicker from "./CoverImagePicker";
import {
  ARTICLE_IMAGE_ACCEPT,
  getArticleImageUrl,
  validateArticleImageFile,
} from "@/lib/storage/article-images";

/** Article-bucket wrapper around the shared {@link CoverImagePicker}. */
export default function ArticleCoverPicker(props: {
  currentPath?: string | null;
  file: File | null;
  removeCurrent?: boolean;
  onFileChange: (file: File | null) => void;
  onRemoveCurrentChange?: (remove: boolean) => void;
}) {
  return (
    <CoverImagePicker
      {...props}
      resolveUrl={getArticleImageUrl}
      validate={validateArticleImageFile}
      accept={ARTICLE_IMAGE_ACCEPT}
      previewAlt="Article cover preview"
    />
  );
}
