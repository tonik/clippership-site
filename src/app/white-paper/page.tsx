import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import wordmark from "@/app/(home)/assets/wordmark-clippership.svg";
import { Footer } from "@/app/sections/footer";
import { getWhitePaper } from "./content";
import { Prose } from "./prose";

export function generateMetadata(): Metadata {
  const { title, description, cover } = getWhitePaper();
  return {
    title,
    description,
    openGraph: {
      type: "article",
      siteName: "Clippership",
      url: "https://clippership.co/white-paper",
      title,
      description,
      images: cover ? [cover] : undefined,
    },
  };
}

export default function WhitePaperPage() {
  const paper = getWhitePaper();

  return (
    <main className="bg-surface flex w-full flex-col">
      <header className="flex items-center justify-between px-6 pt-6 md:px-8 lg:px-12">
        <Link href="/" aria-label="Clippership home">
          <Image src={wordmark} alt="Clippership" width={157} height={28} />
        </Link>
        {paper.pdf && (
          <a
            href={paper.pdf}
            download
            className="border-border-hairline bg-surface-muted text-label text-text-strong rounded-pill ease-fluid hover:border-border-rule inline-flex h-10 items-center border px-7 font-sans transition-colors duration-160"
          >
            Download PDF
          </a>
        )}
      </header>

      <section className="flex flex-col gap-6 px-6 pt-16 pb-12 md:px-8 lg:px-12 lg:pt-24">
        <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
          White paper · {paper.date}
        </p>
        <h1 className="text-display-lg font-display text-ink max-w-[14ch]">
          {paper.title}
        </h1>
        <div className="flex flex-col gap-1">
          <p className="text-lead text-text-strong font-sans">
            {paper.authors}
          </p>
          <p className="text-body text-text-tertiary font-sans">
            {paper.location}
          </p>
        </div>
      </section>

      {paper.cover && (
        <div className="px-3">
          {/* Decorative: the paper's cover plate, open water at dusk. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={paper.cover}
            alt=""
            className="aspect-[1536/725] max-h-[32rem] w-full rounded-lg object-cover"
          />
        </div>
      )}

      <div className="flex flex-col gap-12 px-6 py-16 md:px-8 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:px-12 lg:py-24">
        <nav
          aria-label="Contents"
          className="hidden lg:col-span-3 lg:col-start-1 lg:block"
        >
          <div className="sticky top-8 flex flex-col gap-4">
            <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
              Contents
            </p>
            <ol className="flex flex-col gap-2">
              {paper.sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-body text-text-tertiary hover:text-text-strong ease-fluid font-sans transition-colors duration-160"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="max-w-[42rem] lg:col-span-7 lg:col-start-5">
          <Prose source={paper.body} />
        </article>
      </div>

      <Footer />
    </main>
  );
}
