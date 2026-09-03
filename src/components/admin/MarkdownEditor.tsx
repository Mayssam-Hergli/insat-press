"use client";

import { useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  minHeight?: number;
};

/**
 * Coerce whatever we get into a markdown string. Guards against legacy content
 * shapes that predate the JSON→markdown migration: paragraph arrays
 * (`string[]`), `{ content: "…" }` blobs, or a stale Prisma client handing us a
 * parsed object instead of a string.
 */
export function toMarkdownString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(toMarkdownString).join("\n\n");
  if (typeof value === "object") {
    const inner = (value as { content?: unknown }).content;
    if (inner != null && inner !== value) return toMarkdownString(inner);
    return "";
  }
  return String(value);
}

type ToolbarAction = {
  label: string;
  title: string;
  /** Text inserted before the selection. */
  prefix: string;
  /** Text inserted after the selection. */
  suffix?: string;
  /** Placeholder used when there is no selection. */
  sample: string;
  /** Insert at the start of the line rather than wrapping the selection. */
  block?: boolean;
};

const TOOLBAR: ToolbarAction[] = [
  { label: "B", title: "Bold", prefix: "**", suffix: "**", sample: "bold text" },
  { label: "i", title: "Italic", prefix: "_", suffix: "_", sample: "italic text" },
  { label: "H2", title: "Heading", prefix: "## ", sample: "Heading", block: true },
  { label: "Link", title: "Link", prefix: "[", suffix: "](https://)", sample: "link text" },
  { label: "List", title: "Bullet list", prefix: "- ", sample: "List item", block: true },
  { label: "Quote", title: "Quote", prefix: "> ", sample: "Quote", block: true },
];

export default function MarkdownEditor({
  value,
  onChange,
  id,
  placeholder = "Write the article in Markdown…",
  minHeight = 360,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Never trust the incoming value to be a string (legacy/stale-client data).
  const text = toMarkdownString(value);

  function applyAction(action: ToolbarAction) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = text.slice(start, end);
    const inner = selected || action.sample;

    let insert: string;
    let cursorStart: number;
    let cursorEnd: number;

    if (action.block) {
      // Anchor block actions (heading/list/quote) to the start of the line.
      const lineStart = text.lastIndexOf("\n", start - 1) + 1;
      const prefixNeedsGap =
        lineStart > 0 && text[lineStart - 1] !== "\n" ? "\n" : "";
      const before = text.slice(0, lineStart);
      const after = text.slice(lineStart);
      insert = prefixNeedsGap + action.prefix;
      onChange(before + insert + after);
      cursorStart = cursorEnd = lineStart + insert.length + (start - lineStart);
    } else {
      const suffix = action.suffix ?? "";
      insert = action.prefix + inner + suffix;
      onChange(text.slice(0, start) + insert + text.slice(end));
      // Select the inner text so the writer can type over the sample.
      cursorStart = start + action.prefix.length;
      cursorEnd = cursorStart + inner.length;
    }

    // Restore focus/selection after React re-renders the value.
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  }

  return (
    <div className="overflow-hidden rounded-[0.6rem] border border-[var(--line)]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-[var(--line)] bg-[rgba(216,201,192,0.35)] px-2 py-1.5">
        {TOOLBAR.map((action) => (
          <button
            key={action.title}
            type="button"
            title={action.title}
            onClick={() => applyAction(action)}
            className="rounded px-2 py-1 text-sm font-bold text-[var(--ink)] hover:bg-[rgba(130,27,22,0.1)]"
          >
            {action.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-[var(--muted)]">Markdown</span>
      </div>

      {/* Split editor / preview */}
      <div className="grid grid-cols-1 divide-y divide-[var(--line)] md:grid-cols-2 md:divide-x md:divide-y-0">
        <textarea
          ref={textareaRef}
          id={id}
          value={text}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck
          style={{ minHeight }}
          className="w-full resize-y bg-[rgba(255,248,243,0.7)] px-3 py-3 font-mono text-sm leading-6 text-[var(--ink)] focus:outline-none"
        />
        <div
          style={{ minHeight }}
          className="markdown-preview overflow-auto bg-[rgba(239,226,217,0.5)] px-4 py-3 text-sm"
        >
          {text.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{text}</ReactMarkdown>
          ) : (
            <p className="markdown-preview-empty">Preview appears here…</p>
          )}
        </div>
      </div>
    </div>
  );
}
