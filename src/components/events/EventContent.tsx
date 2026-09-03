import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

function toMarkdownString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(toMarkdownString).join("\n\n");
  return String(value);
}

export default function EventContent({ content }: { content: unknown }) {
  return (
    <div className="prose prose-lg max-w-none text-[var(--ink)]">
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
        {toMarkdownString(content)}
      </ReactMarkdown>
    </div>
  );
}
