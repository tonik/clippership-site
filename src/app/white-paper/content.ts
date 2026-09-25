import { readFileSync } from "node:fs";
import path from "node:path";

/** The white paper is one Markdown file so it can be revised without touching
 *  code: edit `src/content/white-paper.md`, open a pull request, merge. The
 *  front matter at the top carries the title block; everything below it is the
 *  body. Read at build time - the page is still statically generated. */
const SOURCE = path.join(process.cwd(), "src/content/white-paper.md");

export type WhitePaper = {
  title: string;
  description: string;
  authors: string;
  date: string;
  location: string;
  cover?: string;
  pdf?: string;
  body: string;
  sections: { id: string; title: string }[];
};

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Flat `key: value` front matter only - nothing in the title block needs more,
 *  and it keeps a YAML parser out of the bundle. */
function parseFrontMatter(source: string) {
  const match = /^---\n([\s\S]*?)\n---\n/.exec(source);
  if (!match) throw new Error("white-paper.md is missing its --- front matter");

  const data: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) data[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { data, body: source.slice(match[0].length) };
}

export function getWhitePaper(): WhitePaper {
  const { data, body } = parseFrontMatter(readFileSync(SOURCE, "utf8"));

  for (const key of ["title", "description", "authors", "date", "location"]) {
    if (!data[key])
      throw new Error(`white-paper.md front matter needs "${key}"`);
  }

  // Every `## ` heading becomes an entry in the contents rail.
  const sections = [...body.matchAll(/^## (.+)$/gm)].map(([, title]) => ({
    id: slugify(title),
    title: title.trim(),
  }));

  return {
    title: data.title,
    description: data.description,
    authors: data.authors,
    date: data.date,
    location: data.location,
    cover: data.cover || undefined,
    pdf: data.pdf || undefined,
    body,
    sections,
  };
}
