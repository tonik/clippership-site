import type { Metadata } from "next";

import { IconBulletArrow, IconChevron, IconLinkedin } from "@/components/icons";

export const metadata: Metadata = {
  title: "Style Guide",
  description: "The Clippership design system, rendered from its own tokens.",
};

/**
 * Values shown as captions are read straight from DESIGN.md / globals.css - they
 * document the token's own value and are not used to style anything below.
 */
const COLORS: {
  name: string;
  swatch: string;
  value: string;
  onDark?: boolean;
  border?: boolean;
}[] = [
  { name: "ink", swatch: "bg-ink", value: "#291D1D", onDark: true },
  { name: "text", swatch: "bg-text", value: "#191919", onDark: true },
  {
    name: "surface",
    swatch: "bg-surface",
    value: "#FFFFFF",
    border: true,
  },
  {
    name: "surface-muted",
    swatch: "bg-surface-muted",
    value: "#F6F6F7",
    border: true,
  },
  { name: "panel", swatch: "bg-panel", value: "#E5E4E6" },
  { name: "scrim", swatch: "bg-scrim", value: "#2B2626", onDark: true },
  {
    name: "text-strong",
    swatch: "bg-text-strong",
    value: "#191919 / 100%",
    onDark: true,
  },
  {
    name: "text-secondary",
    swatch: "bg-text-secondary",
    value: "#191919 / 64%",
    onDark: true,
  },
  {
    name: "text-tertiary",
    swatch: "bg-text-tertiary",
    value: "#191919 / 60%",
    onDark: true,
  },
  {
    name: "text-quiet",
    swatch: "bg-text-quiet",
    value: "#191919 / 48%",
    border: true,
  },
  {
    name: "text-ghost",
    swatch: "bg-text-ghost",
    value: "#191919 / 24%",
    border: true,
  },
  {
    name: "border-rule",
    swatch: "bg-border-rule",
    value: "#191919 / 16%",
    border: true,
  },
  {
    name: "border-hairline",
    swatch: "bg-border-hairline",
    value: "#191919 / 8%",
    border: true,
  },
  {
    name: "panel-wash",
    swatch: "bg-panel-wash",
    value: "#E5E4E6 / 32%",
    border: true,
  },
  {
    name: "glass-light",
    swatch: "bg-glass-light",
    value: "#F6F6F7 / 16%",
    border: true,
  },
  {
    name: "glass-mid",
    swatch: "bg-glass-mid",
    value: "#F6F6F7 / 64%",
    border: true,
  },
  {
    name: "scrim-chip",
    swatch: "bg-scrim-chip",
    value: "#2B2626 / 80%",
    onDark: true,
  },
];

const TYPE_SCALE: { name: string; className: string; meta: string }[] = [
  {
    name: "display-xl",
    className: "text-display-xl font-display text-ink",
    meta: "Exposure · 108px · weight 450 · -0.04em",
  },
  {
    name: "display-lg",
    className: "text-display-lg font-display text-ink",
    meta: "Exposure · 80px · weight 450 · -0.04em",
  },
  {
    name: "display-md",
    className: "text-display-md font-display text-ink",
    meta: "Exposure · 48px · weight 450 · -0.04em",
  },
  {
    name: "lead",
    className: "text-lead font-sans text-text-strong",
    meta: "Matter · 24px · weight 500 · -0.04em",
  },
  {
    name: "body",
    className: "text-body font-sans text-text-strong",
    meta: "Matter · 16px · weight 400 · -0.04em",
  },
  {
    name: "label",
    className: "text-label font-sans text-text-strong",
    meta: "Matter · 14px · weight 600 · -0.02em",
  },
  {
    name: "label-active",
    className: "text-label-active font-sans text-text-strong",
    meta: "Matter · 14px · weight 500 · -0.02em",
  },
  {
    name: "eyebrow",
    className: "text-eyebrow font-mono text-text-strong uppercase",
    meta: "Overpass Mono · 12px · weight 700 · caps",
  },
  {
    name: "caption-mono",
    className: "text-caption-mono font-mono text-text-strong uppercase",
    meta: "Overpass Mono · 8px · weight 700 · caps",
  },
];

const RADII: { name: string; className: string; value: string }[] = [
  { name: "xs", className: "rounded-xs", value: "2px" },
  { name: "sm", className: "rounded-sm", value: "4px" },
  { name: "md", className: "rounded-md", value: "8px" },
  { name: "lg", className: "rounded-lg", value: "12px" },
  { name: "pill", className: "rounded-pill", value: "999px" },
];

const SPACING: { name: string; var: string; value: string }[] = [
  { name: "3xs", var: "--space-3xs", value: "4px" },
  { name: "2xs", var: "--space-2xs", value: "8px" },
  { name: "xs", var: "--space-xs", value: "12px" },
  { name: "sm", var: "--space-sm", value: "16px" },
  { name: "smd", var: "--space-smd", value: "20px" },
  { name: "md", var: "--space-md", value: "24px" },
  { name: "lg", var: "--space-lg", value: "28px" },
  { name: "xlg", var: "--space-xlg", value: "32px" },
  { name: "xl", var: "--space-xl", value: "36px" },
  { name: "2xl", var: "--space-2xl", value: "48px" },
];

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
        {eyebrow}
      </p>
      <h2 className="text-display-md font-display text-ink">{title}</h2>
    </div>
  );
}

function Swatch({
  name,
  swatch,
  value,
  onDark,
  border,
}: (typeof COLORS)[number]) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`${swatch} ${border ? "border-border-hairline border" : ""} flex h-20 items-end rounded-md p-3`}
      >
        <span
          className={`text-caption-mono font-mono uppercase ${onDark ? "text-on-dark" : "text-text-strong"} opacity-64`}
        >
          Aa
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-label text-text-strong font-sans">{name}</span>
        <span className="text-caption-mono text-text-tertiary font-mono uppercase">
          {value}
        </span>
      </div>
    </div>
  );
}

export default function StyleGuidePage() {
  return (
    <main className="bg-surface text-text-strong flex w-full flex-col gap-24 px-6 py-16 font-sans md:px-8 md:py-20 lg:px-12 lg:py-24">
      <header className="flex flex-col gap-4">
        <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
          Clippership · Alpha
        </p>
        <h1 className="text-display-lg font-display text-ink">Style guide</h1>
        <p className="text-lead text-text-secondary max-w-2xl font-sans">
          A living reference for every colour, type step, and component token
          this site is built from. Nothing here is invented - it is read
          straight out of DESIGN.md and globals.css.
        </p>
      </header>

      {/* 1. Colours */}
      <section className="flex flex-col gap-8">
        <SectionHeader eyebrow="Tokens" title="Colours" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {COLORS.map((color) => (
            <Swatch key={color.name} {...color} />
          ))}
        </div>
      </section>

      {/* 2. Typography */}
      <section className="flex flex-col gap-8">
        <SectionHeader eyebrow="Tokens" title="Typography" />
        <div className="flex flex-col gap-8">
          {TYPE_SCALE.map((step) => (
            <div
              key={step.name}
              className="border-border-hairline flex flex-col gap-2 border-b pb-8 last:border-b-0 last:pb-0"
            >
              <p className={step.className}>The quiet edge of the fleet</p>
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-label text-text-strong font-sans">
                  {step.name}
                </span>
                <span className="text-caption-mono text-text-tertiary font-mono uppercase">
                  {step.meta}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
              Caps
            </p>
            <p className="text-eyebrow text-text-strong font-mono uppercase">
              Read the white paper
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
              Link
            </p>
            <a
              href="mailto:hello@clippership.co"
              className="text-eyebrow text-text-strong ease-fluid font-mono opacity-80 transition-opacity duration-160 hover:opacity-100"
            >
              hello@clippership.co
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
              Italic
            </p>
            <p className="text-body text-text-quiet font-sans">
              Not part of this system - Matter and Exposure ship roman only.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Buttons */}
      <section className="flex flex-col gap-8">
        <SectionHeader eyebrow="Components" title="Buttons" />
        <p className="text-body text-text-secondary max-w-2xl font-sans">
          Every button is a 40px-tall pill with a hairline border - there is no
          separate Button component in this codebase, so these are the
          project&apos;s real inline button classes, in the three variants
          DESIGN.md defines.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              className="bg-surface-muted border-border-hairline hover:border-border-rule rounded-pill text-label text-text-strong ease-fluid inline-flex h-10 w-fit items-center border px-5 py-3 font-sans transition-colors duration-160"
            >
              Solid
            </button>
            <span className="text-caption-mono text-text-tertiary font-mono uppercase">
              surface-muted fill
            </span>
          </div>

          <div className="bg-panel flex flex-col gap-3 rounded-md p-6">
            <button
              type="button"
              className="bg-glass-light border-border-hairline text-text-secondary rounded-pill text-label ease-fluid inline-flex h-10 w-fit items-center border px-5 py-3 font-sans backdrop-blur-[4px] transition-colors duration-160"
            >
              Glass
            </button>
            <span className="text-caption-mono text-text-tertiary font-mono uppercase">
              glass-light · 4px blur
            </span>
          </div>

          <div className="bg-panel flex flex-col gap-3 rounded-md p-6">
            <button
              type="button"
              className="bg-glass-mid border-border-hairline text-text-strong rounded-pill text-label ease-fluid inline-flex h-10 w-fit items-center border px-5 py-3 font-sans backdrop-blur-[4px] transition-colors duration-160"
            >
              Translucent
            </button>
            <span className="text-caption-mono text-text-tertiary font-mono uppercase">
              glass-mid · 4px blur
            </span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              aria-label="Drag to rotate"
              className="bg-surface border-border-hairline rounded-pill text-text-strong flex size-10 items-center justify-center border"
            >
              <IconChevron
                width={16}
                height={16}
                className="size-4 -rotate-90"
              />
            </button>
            <span className="text-caption-mono text-text-tertiary font-mono uppercase">
              round icon
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-glass-white rounded-pill inline-flex h-10 items-center gap-1 p-1 backdrop-blur-[8px]">
              <button
                type="button"
                aria-pressed="true"
                className="bg-text rounded-pill text-label-active text-on-dark ease-fluid relative h-8 px-4 font-sans transition-opacity duration-160"
              >
                Active
              </button>
              <button
                type="button"
                aria-pressed="false"
                className="rounded-pill text-label text-text-strong ease-fluid relative h-8 px-4 font-sans opacity-64 transition-opacity duration-160 hover:opacity-100"
              >
                Idle
              </button>
            </div>
            <span className="text-caption-mono text-text-tertiary font-mono uppercase">
              segment control
            </span>
          </div>
        </div>
      </section>

      {/* 4. Form elements */}
      <section className="flex flex-col gap-8">
        <SectionHeader eyebrow="Components" title="Form elements" />
        <p className="text-body text-text-secondary max-w-2xl font-sans">
          The site ships no forms today, so these fields extend the same tokens
          the rest of the system already uses: hairline borders, `rounded-sm`,
          and the `label`/`body` type steps.
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="text-label text-text-strong font-sans">
              Text input
            </span>
            <input
              type="text"
              placeholder="Jane Seafarer"
              className="border-border-hairline focus:border-border-rule bg-surface text-body text-text-strong ease-fluid placeholder:text-text-quiet h-10 w-full rounded-sm border px-3 font-sans transition-colors duration-160 outline-none"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-label text-text-strong font-sans">
              Select
            </span>
            <select className="border-border-hairline focus:border-border-rule bg-surface text-body text-text-strong ease-fluid h-10 w-full rounded-sm border px-3 font-sans transition-colors duration-160 outline-none">
              <option>Deck</option>
              <option>Engineering</option>
              <option>Operations</option>
            </select>
          </label>

          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-label text-text-strong font-sans">
              Textarea
            </span>
            <textarea
              placeholder="Tell us about the fleet"
              className="border-border-hairline focus:border-border-rule bg-surface text-body text-text-strong ease-fluid placeholder:text-text-quiet min-h-28 w-full rounded-sm border px-3 py-3 font-sans transition-colors duration-160 outline-none"
            />
          </label>

          <fieldset className="flex flex-col gap-3">
            <span className="text-label text-text-strong font-sans">
              Checkbox
            </span>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                className="border-border-hairline text-ink accent-ink size-4 rounded-xs border"
              />
              <span className="text-body text-text-secondary font-sans">
                Subscribe to the white paper
              </span>
            </label>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <span className="text-label text-text-strong font-sans">Radio</span>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  defaultChecked
                  className="border-border-hairline text-ink accent-ink size-4 rounded-full border"
                />
                <span className="text-body text-text-secondary font-sans">
                  Crew
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  className="border-border-hairline text-ink accent-ink size-4 rounded-full border"
                />
                <span className="text-body text-text-secondary font-sans">
                  Shore
                </span>
              </label>
            </div>
          </fieldset>
        </div>
      </section>

      {/* 5. Cards, tags, links, blockquote */}
      <section className="flex flex-col gap-8">
        <SectionHeader eyebrow="Components" title="Cards & marks" />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <article className="border-border-flat hover:border-border-rule bg-surface ease-fluid relative flex w-full flex-col gap-7 rounded-sm border p-6 transition-colors duration-160">
            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
                CTO
              </p>
              <p className="text-lead text-text-strong font-sans break-words">
                Kai Matsuka
              </p>
            </div>
            <p className="text-body text-text-secondary font-sans break-words">
              Ex-Tesla, JPL, Caltech
            </p>
            <IconLinkedin
              width={16}
              height={16}
              className="text-text-strong absolute top-6 right-6 h-4 w-4 opacity-60"
            />
          </article>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
                Tag / badge
              </p>
              <span className="bg-surface-muted border-border-hairline text-eyebrow text-text-strong rounded-pill inline-flex w-fit border px-3 py-1 font-mono uppercase">
                Autonomous
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
                Bullet item
              </p>
              <li className="flex h-5 list-none items-center gap-2">
                <span className="border-border-hairline text-text-tertiary flex size-2 shrink-0 items-center justify-center overflow-hidden rounded-xs border">
                  <IconBulletArrow width={4} height={4} />
                </span>
                <span className="text-body text-text-tertiary font-sans">
                  Jet Propulsion Laboratory
                </span>
              </li>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
                Link
              </p>
              <a
                href="mailto:hello@clippership.co"
                className="text-eyebrow text-text-strong ease-fluid font-mono opacity-80 transition-opacity duration-160 hover:opacity-100"
              >
                hello@clippership.co
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
              Blockquote
            </p>
            <blockquote className="border-border-rule flex flex-col gap-2 border-l pl-6">
              <p className="text-lead text-text-strong font-sans">
                Clean energy and cooling, plentiful on the open ocean
              </p>
              <cite className="text-caption-mono text-text-tertiary font-mono uppercase not-italic">
                Clippership white paper
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* 6. Spacing, radius & shadows */}
      <section className="flex flex-col gap-8">
        <SectionHeader eyebrow="Tokens" title="Spacing, radius & shadow" />

        <div className="flex flex-col gap-3">
          <p className="text-label text-text-strong font-sans">Spacing</p>
          <div className="flex flex-col gap-2">
            {SPACING.map((step) => (
              <div key={step.name} className="flex items-center gap-4">
                <span className="text-caption-mono text-text-tertiary w-10 font-mono uppercase">
                  {step.name}
                </span>
                <div
                  className="bg-text-strong h-2 w-[var(--w)] rounded-xs"
                  style={{ "--w": `var(${step.var})` } as React.CSSProperties}
                />
                <span className="text-caption-mono text-text-tertiary font-mono uppercase">
                  {step.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-label text-text-strong font-sans">Radius</p>
          <div className="flex flex-wrap items-end gap-6">
            {RADII.map((radius) => (
              <div key={radius.name} className="flex flex-col gap-2">
                <div
                  className={`bg-surface-muted border-border-hairline size-16 border ${radius.className}`}
                />
                <span className="text-caption-mono text-text-tertiary font-mono uppercase">
                  {radius.name} · {radius.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-label text-text-strong font-sans">Shadow</p>
          <p className="text-body text-text-secondary max-w-2xl font-sans">
            DESIGN.md rules out drop shadows entirely - elevation reads through
            a hairline border plus an inset ring, never a blur.
          </p>
          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-2">
              <div className="bg-surface border-border-hairline size-16 rounded-sm border" />
              <span className="text-caption-mono text-text-tertiary font-mono uppercase">
                border-hairline
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="bg-surface border-border-rule size-16 rounded-sm border" />
              <span className="text-caption-mono text-text-tertiary font-mono uppercase">
                border-rule
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
