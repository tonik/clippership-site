# Task: Polish pass — final design-detail refinement

This section **already passed** the fidelity gate (score 95). This is a
single, dedicated **polish pass**: close the small design details the main loop
intentionally skips — the craft layer that separates "looks like the design" from
"is the design."

You get exactly **one** pass. A fresh reviewer re-judges after you, and **if your
change lowers the score, it is reverted** — so refine, never restructure.

## Mindset

The build is good. Your job is the last 2%: the decorative marks, the exact
spacing, the opacity, the hairlines — the things a measurement gate under-weights
but a designer notices immediately. In premium/editorial design these details
*are* the design, not optional.

## What to refine (in priority order)

1. **`info`-level reviewer items** (listed below) — these are exactly the small,
   real gaps the normal fixer skips. Address them.
2. **Decorative & atmospheric elements** — watermarks, background motifs, dots,
   gradient washes, subtle textures. If the spec lists one and it's missing or
   wrong (too faint, wrong position, wrong opacity), fix it. (But match the spec's
   intended subtlety — do NOT make a faint watermark loud; faint-by-design is correct.)
3. **Spacing precision** — gaps, padding, and rhythm that are a few px off the
   spec. Snap them to the exact spec/token value.
4. **Type detail** — letter-spacing, line-height, exact weight, optical alignment.
5. **Borders, radii, opacity** — hairline widths, corner radii, the exact alpha of
   tinted panels and muted text.

## Hard rules — do NOT

- **Do NOT restructure the layout.** No converting flow↔absolute, no changing the
  flex/grid architecture, no moving sections. The structure passed — leave it.
- **Do NOT add anything not in the design**, and do NOT remove working content.
- **Do NOT chase pixel-diff** against a size-mismatched reference; trust the spec
  values and the reference image.
- Keep every change **small and surgical** — one clear reason per edit. If a detail
  is already correct or is faint *by design*, leave it.
- Respect locked regions (`<!-- devlooper:locked -->` … `<!-- /devlooper:locked -->`)
  byte-for-byte.

## Inputs

- Figma node: https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=181-498&t=0jpbKeeTIgsBOp2v-4
- Spec (source of truth for values): `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/spec.md`
- Design system: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/DESIGN.md`
- Reference image (taken once, stable across iterations): `(no cached reference image available — use the Figma MCP sparingly to view the node)`
- Assets already fetched: `/Users/arturgrzeda/Documents/Devlooper/clippership/src/app/(home)/assets`
- Project dir: `/Users/arturgrzeda/Documents/Devlooper/clippership` · page file: `src/app/(home)/page.tsx`

## Current build

- desktop (1440x900): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/how-it-works/iter-04/current-desktop.png
- tablet (768x1024): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/how-it-works/iter-04/current-tablet.png
- mobile (390x844): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/how-it-works/iter-04/current-mobile.png

## Reviewer items (info first — these are your main targets)

**Only act on issues tagged `actionable: true`.** Issues with `actionable: false`
are confirmations or notes with no Figma reference (e.g. "stacks correctly",
"no tablet reference") — do NOT change anything for those.

### desktop — score 96
  - [INFO] No cached Figma reference image was supplied; desktop was judged against the extracted 1440 ground truth (spec.md §2 + geometry.json for node 181:508), which is a literal transcription of the frame.
  - [INFO] Geometry verified pixel-exact from the PNG: section height 428px, 12px padding top/bottom, tiles 404px tall (y 12→415). Measured tile widths 320px (x 504→823) and 404px (x 847→1251) with a 24px gap — matches the 546/320/404/320/546 + 24px strip.
  - [INFO] Strip overflows and is clipped at the frame edge with no right-hand gutter (image content runs to x=1439), matching Figma's clip behaviour rather than clipping at the 12px padding box.
  - [INFO] Tile 1 is clipped on the left and its fig.01 chip is off-frame in this screenshot. This is the marquee (spec §6.3 'Media strip - infinite marquee') caught mid-cycle, not a missing chip or a misaligned strip — the track animates from translate3d(0,0,0), so the resting state is flush left. Not a defect.
  - [INFO] Tile hairline confirmed present by pixel sampling, not just by eye: #ECECEC at y=12, y=415 and x=847 (rgb 236,236,236). Border 1px solid var(--color-border-flat) #ececec, radius 8px (rounded-md → --radius-md) — exactly the single-layer recipe spec.md sanctions.
  - [INFO] Figure-chip scrim verified numerically: inside the chip box rgb(125,130,136) vs rgb(185,195,206) on the same sky just below it — an effective alpha of ~0.42 against the ~0.46 the radial-gradient(farthest-side at 0% 0%, rgba(43,38,38,0.8)→0) at 64% opacity predicts at that offset, and it fades to unscrimmed by the chip's far corner. Correct gradient, correct compositing.
  - [INFO] Chip metrics match: padding 24/32/32/24 → 64px frame height, label 8px/1 Overpass Mono 700 at +0.01em, uppercase, white at 64%, pointer-events: none. Overpass Mono is the real face (next/font/google), not a monospace fallback.
  - [INFO] Image crops are mathematically exact. Each tile's plate is the Figma rect expressed as a percentage of the tile box (e.g. tile 4: 492/320 = 153.75%, 656/404 = 162.376%, -79/320 = -24.688%, -101/404 = -25%), so the crop survives the tile shrinking on mobile instead of hard-coding px offsets. All five tiles check out against the spec's object-position table.
  - [INFO] Restraint holds: no heading, eyebrow or body copy added, chips are the only text, and the verbatim fig.01 / fig.02 / fig.03 / fig.02 / fig.05 sequence is reproduced with fig.04 skipped as drawn. The only extra is an sr-only subject description per chip, which is invisible.
  - [INFO] Motion scaffolding is in place: 40s linear infinite translate3d to -50% over a duplicated run (one run is exactly 50% of the track because the 24px gap is a per-tile right margin), pause on :hover and :focus-within, and prefers-reduced-motion: reduce drops the animation and falls back to a native horizontal scroller — all as spec §6.3 asks.
  - [INFO] spec-match.json's three off-token flags are false positives: #ECECEC is the spec's prescribed tile hairline and a defined token (--color-border-flat), and the 32px chip padding-right/bottom is the spec's literal 24px 32px 32px 24px.

### tablet — score 96
  - [INFO] No Figma tablet frame exists, so this is judged on adaptation quality only. 768px sits exactly on the spec's '≥ 768: strip as drawn' rule and the build honours it: measured tile 2 at x 380→697 = 318px (≈320) and tiles still 404px tall (y 12→415), section height 429px.
  - [INFO] Marquee and duplicated second run are both active at this width, clipped at the frame edge with no right gutter. Nothing wraps into a grid, nothing overlaps, no clipped or unreadable text.
  - [INFO] As on desktop, the leftmost tile is mid-marquee and its chip is off-frame — an animation frame, not a defect.

### mobile — score 95
  - [INFO] Every tile carries mr-6, including the last, so the mobile scroller ends with 24px of trailing margin plus the 12px section padding (36px of white past the final tile) instead of the 12px the spec keeps. Invisible until the user scrolls to the end; drop the margin on the last tile of the run (or keep it only for the desktop seam).
  - [INFO] No Figma mobile frame exists. The build follows the spec's '< 768' rule precisely: measured tile 12→252 = 241px tall, which is min(404px, 62vw) at 390px = 241.8px, and 325px wide, holding the 546/404 ratio. Section padding stays 12px.
  - [INFO] Real scroller as specified, not a shrunk marquee: overflow-x: auto, snap-x snap-mandatory with scroll-p-3 and scroll-snap-align: start on each tile, translation disabled below 768px, and the decorative second run hidden so the scroller has a genuine end.
  - [INFO] fig.01 chip renders correctly at the tile's top-left (label ~23px from the left edge, ~24px from the top) at 8px Overpass Mono over its radial scrim, and the crop still frames the vessel under the bridge after the tile shrinks. No horizontal page overflow — the strip is contained inside the section's own scroll box.

## Token / CSS audit

## CSS token audit

No violations found. ✅




## Craft

If an **`impeccable`** skill is available, use its craft modes (`typeset`,
`normalize`, `polish`, `distill`) pointed at `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/DESIGN.md` — this pass is
exactly what they are for. Do not use any mode that exceeds the source.

When done, write a short JSON summary to **this exact path**: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/how-it-works/iter-04/fix-summary.json`

```json
{
  "changesMade": ["short description of each polish edit"],
  "summary": "one sentence on what you refined"
}
```
