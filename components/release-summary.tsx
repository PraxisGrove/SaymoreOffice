import Markdown from "react-markdown";

// Release notes come from GitHub as Markdown. Rendered with react-markdown: raw HTML is never
// rendered (no rehype-raw, skipHtml), no dangerouslySetInnerHTML, and only http(s) links survive.
const safeUrl = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : "";
  } catch {
    return "";
  }
};

export function ReleaseSummary({ markdown }: { markdown: string }) {
  return (
    <div className="release-summary">
      <Markdown
        skipHtml
        urlTransform={safeUrl}
        allowedElements={["p", "strong", "em", "code", "a", "del"]}
        unwrapDisallowed
        components={{
          a: ({ href, children }) =>
            href ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ) : (
              <span>{children}</span>
            ),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
