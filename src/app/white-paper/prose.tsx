import type { ElementContent } from "hast";
import Markdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { slugify } from "./content";

/** Conventions the white paper Markdown relies on (see the file itself):
 *  - a paragraph holding only images renders as a figure row, side by side;
 *  - a paragraph starting "Figure 3." or "Table 2." renders as a caption;
 *  - `[^name]` footnotes collect at the end, as in the PDF;
 *  - inline HTML (<sub>, <i>, `<p class="equation">`) passes through. */

const CAPTION = /^(Figure|Table) \d+\./;

function text(nodes: ElementContent[]): string {
  return nodes
    .map((n) =>
      n.type === "text" ? n.value : "children" in n ? text(n.children) : "",
    )
    .join("");
}

const components: Components = {
  h2: ({ node, children, id }) => {
    // remark-gfm's own "Footnotes" heading - keep it, as a quiet kicker.
    if (id === "footnote-label") {
      return (
        <h2
          id={id}
          className="text-eyebrow text-text-strong mb-4 font-mono uppercase opacity-60"
        >
          Notes
        </h2>
      );
    }
    return (
      <h2
        id={slugify(text(node?.children ?? []))}
        className="text-display-md font-display text-ink mt-16 mb-6 scroll-mt-8 first:mt-0"
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }) => (
    <h3 className="text-lead text-text-strong mt-10 mb-3 font-sans">
      {children}
    </h3>
  ),
  p: ({ node, children, className }) => {
    const kids = node?.children ?? [];
    const images = kids.filter(
      (n) => n.type === "element" && n.tagName === "img",
    );
    const onlyImages =
      images.length > 0 &&
      kids.every(
        (n) =>
          (n.type === "element" && n.tagName === "img") ||
          (n.type === "text" && !n.value.trim()),
      );

    if (onlyImages) {
      return (
        <div
          className={`mt-8 mb-3 grid grid-cols-1 gap-3 ${images.length > 1 ? "sm:grid-cols-2" : ""}`}
        >
          {children}
        </div>
      );
    }
    if (CAPTION.test(text(kids))) {
      return (
        <p className="text-label-active text-text-tertiary mb-8 font-sans">
          {children}
        </p>
      );
    }
    if (className === "equation") {
      return (
        <p className="text-lead text-text-strong font-display my-6 text-center">
          {children}
        </p>
      );
    }
    return <p className="mb-5">{children}</p>;
  },
  img: ({ src, alt }) => (
    // Markdown carries no intrinsic size, so next/image has nothing to reserve
    // space with; the figures are small JPEGs served straight from public/.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : undefined}
      alt={alt ?? ""}
      loading="lazy"
      className="border-border-flat bg-surface-muted block h-full w-full rounded-sm border object-contain"
    />
  ),
  a: ({ href = "", children, ...rest }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        // Footnote back-references and refs keep their gfm data attributes.
        {...Object.fromEntries(
          Object.entries(rest).filter(([k]) => k.startsWith("data-")),
        )}
        id={rest.id}
        className="decoration-border-rule hover:decoration-text-strong underline underline-offset-2 transition-colors duration-160"
      >
        {children}
      </a>
    );
  },
  strong: ({ children }) => (
    <strong className="text-text-strong font-semibold">{children}</strong>
  ),
  ol: ({ children, className }) => (
    <ol
      className={
        className?.includes("footnotes")
          ? "text-label-active flex flex-col gap-3 pl-5"
          : "mb-5 flex list-decimal flex-col gap-4 pl-5"
      }
    >
      {children}
    </ol>
  ),
  ul: ({ children }) => (
    <ul className="mb-5 flex list-disc flex-col gap-2 pl-5">{children}</ul>
  ),
  li: ({ children, id }) => (
    <li id={id} className="marker:text-text-tertiary scroll-mt-8 pl-1">
      {children}
    </li>
  ),
  sup: ({ children }) => (
    <sup className="text-eyebrow ml-0.5 font-mono">{children}</sup>
  ),
  section: ({ children, className }) => (
    <section
      className={
        className?.includes("footnotes")
          ? "border-border-rule text-text-secondary mt-16 border-t pt-8"
          : undefined
      }
    >
      {children}
    </section>
  ),
  table: ({ children }) => (
    <div className="mb-10 overflow-x-auto">
      <table className="text-label-active w-full min-w-[32rem] border-collapse text-left">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-border-rule text-eyebrow text-text-strong border-b py-3 pr-4 align-bottom font-mono uppercase">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border-border-hairline text-text-secondary border-b py-3 pr-4 align-top tabular-nums">
      {children}
    </td>
  ),
};

export function Prose({ source }: { source: string }) {
  return (
    <div className="text-prose text-text-secondary font-sans">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {source}
      </Markdown>
    </div>
  );
}
