"use client";

import type { ContentStatus } from "@/generated/prisma/client";

/**
 * Status picker for article/media forms. Writers and media staff can only save
 * a draft or submit for review; admins get the full publish/archive controls.
 */
export default function StatusSelect({
  id = "status",
  value,
  onChange,
  canPublish,
}: {
  id?: string;
  value: string;
  onChange: (value: ContentStatus) => void;
  canPublish: boolean;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as ContentStatus)}
      className="admin-input"
    >
      <option value="DRAFT">Draft</option>
      {canPublish ? (
        <>
          <option value="PENDING">Pending review</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </>
      ) : (
        <option value="PENDING">Submit for review</option>
      )}
    </select>
  );
}
