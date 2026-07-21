import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function toMarkdownString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (Array.isArray(value)) return value.map(toMarkdownString).join("\n\n");
  return String(value);
}

export default function ArticleContent({ content }: { content: unknown }) {
  return (
    <div className="markdown-preview article-body max-w-none text-[var(--ink)]">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{toMarkdownString(content)}</ReactMarkdown>
    </div>
  );
}
