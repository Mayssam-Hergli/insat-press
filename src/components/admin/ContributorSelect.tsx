"use client";

import type { Profile } from "@/generated/prisma/client";

type ContributorSelectProps = {
  profiles: Profile[];
  value: string[];
  onChange: (ids: string[]) => void;
  label: string;
};

/** Order-preserving multi-select of profiles, used for article/media credits. */
export default function ContributorSelect({
  profiles,
  value,
  onChange,
  label,
}: ContributorSelectProps) {
  const profileMap = new Map(profiles.map((p) => [p.id, p]));

  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...value];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <label className="admin-label">{label}</label>

      {value.length > 0 && (
        <ul className="mb-3 space-y-1">
          {value.map((id, index) => {
            const profile = profileMap.get(id);
            return (
              <li
                key={id}
                className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[rgba(255,248,243,0.5)] px-3 py-1.5 text-sm"
              >
                <span className="font-bold text-[var(--ink)]">
                  {profile?.fullName || profile?.email || "Unknown"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="text-[var(--muted)] hover:text-[var(--press-red)] disabled:opacity-30"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === value.length - 1}
                    className="text-[var(--muted)] hover:text-[var(--press-red)] disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => toggle(id)}
                    className="text-[var(--muted)] hover:text-[var(--press-red)]"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <select
        value=""
        onChange={(e) => {
          if (e.target.value) toggle(e.target.value);
        }}
        className="admin-input"
      >
        <option value="">+ Add a contributor…</option>
        {profiles
          .filter((p) => !value.includes(p.id))
          .map((p) => (
            <option key={p.id} value={p.id}>
              {p.fullName || p.email}
            </option>
          ))}
      </select>
    </div>
  );
}
