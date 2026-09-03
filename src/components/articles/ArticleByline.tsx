import type { Profile } from "@/generated/prisma/client";

type WriterProfile = Pick<Profile, "fullName" | "email" | "bio" | "avatarUrl">;

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function WriterAvatar({ name, avatarUrl }: { name: string; avatarUrl: string | null }) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-11 w-11 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[rgba(130,27,22,0.12)] font-hand text-lg font-bold text-[var(--press-red)]">
      {initials(name) || "?"}
    </span>
  );
}

export default function ArticleByline({ writers }: { writers: WriterProfile[] }) {
  if (writers.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4">
      {writers.map((writer, index) => {
        const name = writer.fullName ?? writer.email;
        return (
          <div key={index} className="flex items-start gap-3">
            <WriterAvatar name={name} avatarUrl={writer.avatarUrl} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-[var(--ink)]">{name}</p>
              {writer.bio && (
                <p className="mt-0.5 max-w-xs text-xs leading-5 text-[var(--muted)] line-clamp-2">
                  {writer.bio}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
