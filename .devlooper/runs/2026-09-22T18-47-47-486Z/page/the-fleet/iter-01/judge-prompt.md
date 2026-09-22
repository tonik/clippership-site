> **Focus: the "the-fleet" section only** (selector `[data-section="the-fleet"]` on this page). The screenshots and measurements below are scoped to it. Build/fix ONLY this section; do not change other sections. In the Figma reference, focus on the matching section.

> **Other sections are being built at the same time, in this same checkout.** Stay inside this section's own file. Do NOT edit the page that composes the sections, the global stylesheet, shared primitives, or any other section - another agent is in those files and one of you would lose the change without either of you seeing an error. If this section genuinely cannot be fixed without a shared-file change, say so in your summary and leave the shared file alone; it will be applied on its own afterwards.

# Task: Independent visual review — build vs design

You are an **independent reviewer**. You did NOT build this page and you will NOT
edit it. Your only job: judge — honestly and strictly — how closely the built
page matches the design named below as the source of truth.

## Iteration 1 of 8

## Figma reference — the source of truth
- Figma node: https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=181-498&t=0jpbKeeTIgsBOp2v-4
- Extracted spec: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/spec.md` — read it.
- **Cached Figma reference image: `(no cached reference image available — use the Figma MCP sparingly to view the node)` — read this PNG and compare
  against it.** It is the stable reference for every iteration. Do **not** pull a
  fresh Figma MCP screenshot each time — re-pulling a stateless MCP drifts your
  judgement run-to-run and burns rate limits. Only call the Figma MCP if the
  cached reference is missing.

## Which breakpoints actually HAVE a design — read this before scoring

A hand-off usually carries a desktop mock and sometimes a mobile one. Where there is
no mock, **there is no ground truth**, and the build was necessarily invented by the
developer. Scoring an invented layout against another breakpoint's mock is a category
error: a correct responsive layout is *supposed* to differ from the desktop design.

- **desktop** (1440px): **NO Figma mock.** Do NOT score it against another breakpoint's mock: a correct responsive layout is SUPPOSED to differ. Judge only what is judgeable without a design — overflow, unreadable or clipped text, broken or overlapping layout, tap targets, lost content, wrong tokens/fonts/colours, and whether the content hierarchy from the mock survives.
- **tablet** (768px): **NO Figma mock.** Do NOT score it against another breakpoint's mock: a correct responsive layout is SUPPOSED to differ. Judge only what is judgeable without a design — overflow, unreadable or clipped text, broken or overlapping layout, tap targets, lost content, wrong tokens/fonts/colours, and whether the content hierarchy from the mock survives.
- **mobile** (390px): **NO Figma mock.** Do NOT score it against another breakpoint's mock: a correct responsive layout is SUPPOSED to differ. Judge only what is judgeable without a design — overflow, unreadable or clipped text, broken or overlapping layout, tap targets, lost content, wrong tokens/fonts/colours, and whether the content hierarchy from the mock survives.

So: **only score fidelity where a mock for THAT breakpoint exists.** For a breakpoint
without one, do not deduct points for differing from the desktop (or mobile) mock. Judge
what can be judged without a design: overflow, clipped or unreadable text, broken or
overlapping layout, tap targets, content that vanished, wrong tokens/fonts/colours, and
whether the content hierarchy from the mock survived the adaptation. A clean, sensible
adaptation with no mock deserves a HIGH score, not a penalty for "not matching Figma".

## Designer's animation / interaction notes — do NOT penalise a live element for its state

(No animation/interaction notes on this design — judge the reference literally.)

If the notes above describe an ANIMATION or interaction (typewriter, scroll reveal, hover
state, carousel, count-up, marquee), the Figma reference is a single FROZEN frame of it —
e.g. a typewriter caught mid-word with a `|` caret, a number frozen mid-count, a carousel on
one slide. The BUILD is live, so its screenshot will show a DIFFERENT frame of the same
animation (full text, no caret; a different count; another slide). **That difference is
correct, not a defect.** Do NOT flag "caret missing", "text differs from Figma", "wrong
number", or "wrong slide" for an element the notes say is animated — the animation existing
and behaving as described is what matters, and a static screenshot cannot capture it. Only
flag an animated element if the animation is clearly ABSENT or wrong in kind (the note says
typewriter but the text just appears; the note says hover-reveal but nothing is interactive).

## The current build

Screenshots of the freshly built site, one per breakpoint:

- desktop (1440x900): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/the-fleet/iter-01/current-desktop.png
- tablet (768x1024): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/the-fleet/iter-01/current-tablet.png
- mobile (390x844): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/the-fleet/iter-01/current-mobile.png

**Read each PNG file and inspect it closely.**

## Computed styles snapshot (actual DOM values — desktop breakpoint)

> Deterministic extraction via Playwright. Compare these values against design system tokens in DESIGN.md.
> Wrong hex/rgb colour, wrong font-family, or missing CSS variables are hard evidence of token violations.

### CSS Custom Properties (:root)
--color-border-flat: #ececec
--color-border-hairline: rgb(25 25 25 / .08)
--color-border-rule: rgb(25 25 25 / .16)
--color-ink: rgb(41 29 29)
--color-on-dark: #fff
--color-panel: #e5e4e6
--color-panel-wash: rgb(229 228 230 / .32)
--color-scrim-chip: rgb(43 38 38 / .8)
--color-specs-chip: #4d80e6
--color-specs-chip-wash: #4d80e61f
--color-specs-label: rgb(255 255 255 / .48)
--color-specs-panel: #191919
--color-specs-rule: rgb(255 255 255 / .08)
--color-surface: #fff
--color-surface-muted: #f6f6f7
--color-text-secondary: rgb(25 25 25 / .64)
--color-text-strong: rgb(25 25 25)
--color-text-tertiary: rgb(25 25 25 / .6)
--font-display-face: "Newsreader", "Newsreader Fallback"
--font-mono: "Overpass Mono", "Overpass Mono", "Overpass Mono Fallback", ui-monospace, "SF Mono", Menlo,
    monospace
--font-mono-face: "Overpass Mono", "Overpass Mono Fallback"
--font-sans: "Matter", "Inter", "Inter Fallback", -apple-system, "Helvetica Neue", Arial,
    sans-serif
--font-sans-face: "Inter", "Inter Fallback"
--font-server-mono: "Server Mono", "Overpass Mono", "Overpass Mono Fallback", ui-monospace, "SF Mono", Menlo,
    monospace
--radius-lg: 12px
--radius-md: 8px
--radius-pill: 999px
--radius-sm: 4px
--space-2xl: 48px
--space-2xs: 8px
--space-3xs: 4px
--space-4xl: 96px
--space-5xl: 100px
--space-6xl: 148px
--space-lg: 28px
--space-smd: 20px
--space-xl: 36px
--space-xs: 12px
--space-xxl: 56px
--spacing: 4px
--text-body: 1rem
--text-body--font-weight: 400
--text-body--letter-spacing: -.04em
--text-caption-mono--font-weight: 700
--text-caption-mono--letter-spacing: .01em
--text-caption-mono--line-height: 1
--text-display-lg: clamp(2.25rem, 5.5556vw, 5rem)
--text-display-lg--font-weight: 450
--text-display-lg--letter-spacing: -.04em
--text-display-md: clamp(2rem, 3.3333vw, 3rem)
--text-display-md--font-weight: 450
--text-display-md--letter-spacing: -.04em
--text-display-xl: clamp(2.75rem, 7.5vw, 6.75rem)
--text-display-xl--font-weight: 450
--text-display-xl--letter-spacing: -.04em
--text-display-xl--line-height: 1
--text-eyebrow: .75rem
--text-eyebrow--font-weight: 700
--text-eyebrow--letter-spacing: .01em
--text-eyebrow--line-height: 1
--text-label: .875rem
--text-label--font-weight: 600
--text-label--letter-spacing: -.02em
--text-label--line-height: 1.14286
--text-label-active: .875rem
--text-label-active--font-weight: 500
--text-label-active--line-height: 1.14286
--text-lead: clamp(1.25rem, 1.6667vw, 1.5rem)
--text-lead--font-weight: 500
--text-lead--letter-spacing: -.04em
--text-micro: .25rem
--text-micro--letter-spacing: .01em
--text-micro--line-height: 1
--text-stat: 1rem
--text-stat--font-weight: 400
--text-stat--line-height: 1.24
--text-stat-label: .75rem
--text-stat-label--font-weight: 400
--text-stat-label--letter-spacing: -.02em
--text-stat-label--line-height: 1

### Key element styles
h2: color: rgb(41, 29, 29); background-color: rgba(0, 0, 0, 0); font-family: Exposure, Exposure-20, Newsreader, "Newsreader Fallback", Georgia, "Times New Roman", serif; font-size: 80px; font-weight: 450; line-height: 80px; letter-spacing: -3.2px
p: color: rgb(25, 25, 25); background-color: rgba(0, 0, 0, 0); font-family: "Overpass Mono", "Overpass Mono", "Overpass Mono Fallback", ui-monospace, "SF Mono", Menlo, monospace; font-size: 12px; font-weight: 700; line-height: 12px; letter-spacing: 0.12px
button: color: rgb(25, 25, 25); background-color: rgb(255, 255, 255); font-family: Matter, Inter, "Inter Fallback", -apple-system, "Helvetica Neue", Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px; border-radius: 999px
header: color: rgb(25, 25, 25); background-color: rgba(0, 0, 0, 0); font-family: Matter, Inter, "Inter Fallback", -apple-system, "Helvetica Neue", Arial, sans-serif; font-size: 16px; font-weight: 400; line-height: 24px


> Use the computed styles above as **hard evidence**: wrong hex/rgb colour, wrong
> font-family, or missing CSS variables are concrete bugs — cite them in `issues`.

The reference and these screenshots may scope a whole page **or a single
section** — judge exactly the scope they show, nothing outside it.

## Your job

**Where a mock exists, Figma is the only reference.** Score how faithfully the build
reproduces that Figma node — not whether the design is "good". Ignore generic design
guidelines, design-improvement skills and personal taste: for a breakpoint WITH a mock,
a page that looks great but differs from Figma scores low, and a plain page that matches
Figma scores high.

For each breakpoint, compare the build against **that breakpoint's mock** (see the list
above). Where there is none, apply the no-mock rules above instead — never fall back to
another breakpoint's mock. Be **strict and adversarial** — assume there ARE flaws and
hunt for them. Check: layout, section order, spacing, element sizes, colours, typography,
exact text content, missing or extra elements, alignment, responsive behaviour.

**Common silent failures — check each explicitly:**

- **Font family**: Does the computed style show the correct font (e.g. "Inter") or a fallback
  (`system-ui`, `sans-serif`, `Arial`)? A wrong font family = `critical`.
- **letter-spacing / tracking**: Headings with tracking in Figma (e.g. `-0.02em`) look visibly
  different without it. Check the computed styles block. Missing tracking = `warning`.
- **line-height**: Compare computed line-height against the spec. Browser default (≈1.5) on a
  display heading with Figma line-height 1.1 is a `warning`.
- **Gradient text**: If the spec documents gradient text, verify the build uses
  `background-clip: text` + `color: transparent`. Flat colour instead = `critical`.
- **Multi-layer shadows**: Figma shadows often have 2–4 layers. A single flat shadow where
  Figma has depth = `warning`.
- **Blend modes**: Check `mix-blend-mode` in computed styles against the spec. If the spec
  documents `color-burn` and the build uses `multiply` (or vice versa), the visual character
  of the element is wrong — flag as `critical` for hero/CTA backgrounds, `warning` elsewhere.
  Common silent failure: fixer "softens" `color-burn` to `multiply` because color-burn looks
  intense on white.
- **object-fit on images**: If an image is stretched or squashed vs Figma, flag it as `warning`.
- **cursor / hover transitions**: Buttons and links without `cursor: pointer` or with no
  CSS transition on hover are `info` — but missing transitions on cards/CTAs = `warning`.
- **Mobile overflow**: Text or elements wider than the viewport on mobile = `critical`.

**SVG clipping — common silent failure**: For every SVG visible in the Figma
design (backgrounds, section dividers, full-bleed footer shapes, decorative
illustrations), verify that the rendered version matches the full Figma extent:
- Does the SVG fill its container width? (should be `width: 100%`, not a fixed px)
- Is the SVG height correct? A footer SVG that renders at 200px but Figma shows
  350px is a `critical` issue even if the rest looks right.
- Is any part of the SVG visually clipped (cut off at the bottom or sides)?
- Mark a clipped or undersized SVG as `critical` — it changes the visual weight
  of entire sections.

**Background grid / guide lines — judge VISUALLY, the pixel-diff misses them.** If the
Figma design has faint full-bleed lines behind the content (column rulers, section
dividers, baseline grid), verify the build reproduces them — presence, spacing, colour,
opacity, and that horizontals are full-bleed / verticals sit on the column edges. They are
low-contrast (1px, ~5–10%) so a pixel metric barely registers them; you must check by eye.
Missing background grid = `warning`; if it's a defining visual motif of the page = `critical`.

**Panel / frame borders — also pixel-diff-invisible, check by eye.** If a section panel,
card, chip or badge in Figma has a thin stroke around it (often a low-alpha hairline like
`rgba(...,0.08)`), verify the build renders that `border` and not just the fill + radius.
The 1px frame around panels is one of the most-dropped elements and a pixel metric won't
catch it. Missing panel/frame border = `warning`.

**Restraint — penalise additions (the build must MATCH Figma, not exceed it):**
- If the build has a section, element, copy block, icon or decorative effect that
  is NOT in the Figma reference, flag it as `warning` ("extra element not in
  design: …"). The fixer is an LLM and tends to *add* — call this out explicitly.
- **Hidden Figma layers must NOT appear in the build.** If an icon, image or element is
  marked `visible:false` (or `opacity:0`) in Figma but is rendered in the build, flag it as
  `warning` ("hidden Figma layer rendered: …"). Do not confuse this with faint-but-visible
  elements (background grid, low-opacity ghost text) which SHOULD be present.

**Motion & interaction scaffolding** — you cannot see motion in a still frame, but
you CAN verify from the computed styles above that the CSS is ready for it:
- Interactive elements (buttons, links, cards) should have `cursor: pointer` and a
  `transition` on a compositor-only property (transform/opacity). Missing on a
  primary CTA/card = `warning`; elsewhere `info`.
- Easing baked as a one-off `cubic-bezier()` instead of a design token = `info`.
- Design implies motion but no `prefers-reduced-motion` handling = `info`.

**Recalibrate harshly toward perception.** Anything imperceptible at normal
viewing — sub-pixel, ≤4px spacing, 1-shade colour, <10% font-size delta — is
`info`, never `warning`. Reserve `warning`/`critical` for differences a designer
would actually call out across the room. The deterministic measurement pass
already catches exact numeric drift; do not double-count pixel nitpicks here.

- Score each breakpoint **0–100** (100 = indistinguishable from Figma).
- Set `overallScore` to the **lowest** breakpoint score.
- For each breakpoint, list every concrete discrepancy in `issues` — specific
  and actionable ("hero heading ~8px too small", not "typography off").

Write your verdict as JSON to **this exact path**: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/the-fleet/iter-01/verdict.json`

```json
{
  "breakpoints": {
    "<breakpoint name>": {
      "score": 0,
      "issues": [
        { "severity": "critical", "actionable": true,  "text": "Hero section missing entirely" },
        { "severity": "warning",  "actionable": true,  "text": "h2 font-size 32px, Figma shows 36px" },
        { "severity": "info",     "actionable": true,  "text": "--color-accent 1 shade off from Figma" },
        { "severity": "info",     "actionable": false, "text": "Two-column stacks correctly per responsive intent" }
      ]
    }
  },
  "overallScore": 0,
  "summary": "one sentence on the current state"
}
```

**Severity rules — be precise:**
- `critical` — missing section, completely wrong layout, broken responsive, major colour block wrong
- `warning` — wrong font-size/weight by >10%, spacing clearly off, wrong component variant
- `info` — sub-pixel diff, 1-shade colour variance, minor spacing ≤4px, copy micro-error

**Do not invent `info` issues just to have a list.** Fewer real issues > many nitpicks.
The fixer ignores `info` — only `critical` and `warning` trigger code changes.

**`actionable` — tag EVERY issue (true/false):**
- `actionable: true` — a real, fixable discrepancy vs the Figma reference (something
  a developer could change to get closer to the design). Most critical/warning, and
  the info-level nuances worth a polish (e.g. "mono list should sit slightly above
  the button, not on its baseline").
- `actionable: false` — NOT a defect to fix: a confirmation/observation ("stacks
  correctly", "reads fine, no overflow"), or a note where there's **no Figma
  reference to act on** ("no Figma tablet reference to contradict"). These document
  state; they must never drive a code change or a polish round.
When in doubt, mark `false` — only flag `true` when there's a concrete, design-backed change.

Include one entry under `breakpoints` for every breakpoint listed above.

**Do not edit any project files.** Only inspect and write the verdict. The
verdict is the only output of this step.
