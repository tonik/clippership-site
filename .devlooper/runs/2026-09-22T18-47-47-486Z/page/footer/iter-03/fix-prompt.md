# Task: Polish pass — final design-detail refinement

This section **already passed** the fidelity gate (score 88). This is a
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
- Reference image (taken once, stable across iterations): `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/reference-section-footer.png`
- Assets already fetched: `/Users/arturgrzeda/Documents/Devlooper/clippership/src/app/(home)/assets`
- Project dir: `/Users/arturgrzeda/Documents/Devlooper/clippership` · page file: `src/app/(home)/page.tsx`

## Current build

- desktop (1440x900): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/footer/iter-03/current-desktop.png
- tablet (768x1024): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/footer/iter-03/current-tablet.png
- mobile (390x844): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/footer/iter-03/current-mobile.png

## Reviewer items (info first — these are your main targets)

**Only act on issues tagged `actionable: true`.** Issues with `actionable: false`
are confirmations or notes with no Figma reference (e.g. "stacks correctly",
"no tablet reference") — do NOT change anything for those.

### desktop — score 96
  - [INFO] Measured against the Figma mock the footer is effectively pixel-identical: panel inset (12px sides/bottom, radius 12) and wave backdrop match within 1px; copyright text spans x50-224 in both; email x49-196 in both; wordmark x642-798 vs x642-797; social row x1288-1391 vs x1286-1390; vertical bands for all three meta parts are identical (152-161, 180-190, 158-185, 164-179). Residual diff excluding the dev-overlay badge is 0.53% and is text antialiasing only.
  - [INFO] A red 'N Issues' dev-server overlay badge is baked into the screenshot at the panel's lower-left; it is Next.js dev tooling, not markup from this section, and accounts for most of the reported 2.33% pixel mismatch.
  - [INFO] Typography tokens confirmed correct: Overpass Mono 700 / 12px / line-height 12px / letter-spacing 0.12px on both p and a, matching spec type ramp row 11-12; no system-font fallback, no missing tracking.
  - [INFO] Meta rule between copyright and email is present at y171, ~181px wide from the block's left edge, matching node 183:88 (border-rule, rgba(25,25,25,0.16)). Build renders it a touch more opaque than the reference at the same y, imperceptible at normal viewing.
  - [INFO] Backer row: nine slots, correct order (Y50, JC, Long Journey, Founders Factory, KM Yachtbuilders, ABS, RINA, Dykstra, NVIDIA Inception), darken blend + 0.6 opacity reproduced - ink density per logo matches the reference. Panel correctly carries no stroke, per spec.

### tablet — score 93
  - [INFO] No Figma tablet mock; judged on its own merits. Backer row wraps to 5 + 4 slots, meta row goes static below it, wordmark stays on the panel centre line (x~384 of 768) - exactly the 768-1023 behaviour the spec describes.
  - [INFO] No overflow, no clipping, no lost content: all nine logos, copyright, rule, email, wordmark and all three social icons survive the adaptation.
  - [INFO] Second backer row (ABS, RINA, Dykstra, NVIDIA) left-aligns under the first four slots, leaving an empty fifth column on the right; this follows the spec's fixed flex-basis, but centring the wrapped remainder would read more deliberately. Cosmetic only.
  - [INFO] Social icons render at their Figma sizes (16-23px tall); tap targets are below the 44px guideline, but that is the design's own sizing, not a build deviation.

### mobile — score 88
  - [WARNING] Backer rows 2 and 3 fall onto the dark wave band, and at 0.6 opacity + mix-blend-mode darken the third-row logos lose almost all contrast - the NVIDIA Inception mark is effectively invisible (its 'nVIDIA' wordmark and 'Inception Program' lockup read as noise against the blue crest). On desktop all nine logos sit over the pale sky. Push the wave image further down on mobile (raise the negative top offset) or add more panel height above the meta row so the wrapped logo rows stay over the light band.
  - [INFO] No Figma mobile mock; judged on its own merits. Layout follows the spec's <768 rules: 3 logos per row, then a centred meta column - wordmark, then copyright with a centred rule, then email, then the social row. Hierarchy from the desktop mock survives.
  - [INFO] No horizontal overflow at 390px: the widest string, '(C)2026 CLIPPERSHIP INC.', measures ~178px and sits centred with ample margin.
  - [INFO] Wrapped rows give logos with wide aspect ratios (NVIDIA Inception, Dykstra) a much smaller optical size than the square marks (RINA, ABS); a per-slot min-height or a larger slot height on mobile would even out the row.

## Token / CSS audit

## CSS token audit

No violations found. ✅




## Craft

If an **`impeccable`** skill is available, use its craft modes (`typeset`,
`normalize`, `polish`, `distill`) pointed at `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/DESIGN.md` — this pass is
exactly what they are for. Do not use any mode that exceeds the source.

When done, write a short JSON summary to **this exact path**: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/footer/iter-03/fix-summary.json`

```json
{
  "changesMade": ["short description of each polish edit"],
  "summary": "one sentence on what you refined"
}
```
