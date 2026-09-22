# Task: Polish pass — final design-detail refinement

This section **already passed** the fidelity gate (score 86). This is a
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

- desktop (1440x900): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/the-fleet/iter-04/current-desktop.png
- tablet (768x1024): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/the-fleet/iter-04/current-tablet.png
- mobile (390x844): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/the-fleet/iter-04/current-mobile.png

## Reviewer items (info first — these are your main targets)

**Only act on issues tagged `actionable: true`.** Issues with `actionable: false`
are confirmations or notes with no Figma reference (e.g. "stacks correctly",
"no tablet reference") — do NOT change anything for those.

### desktop — score 87
  - [WARNING] Panel is too dark / too saturated across the lower-left two thirds - the sea reads as strong blue where Figma reads as a hazy wash. Measured against the Figma node (no x/y shift: best-fit offset is 0,0, so this is tone, not crop): the build needs an extra white veil of alpha 0.20-0.29 over x 240-900 / y 480-720, 0.10-0.20 over x 240-900 / y 300-480, tapering to ~0 above y 240 and right of x 960. Sample points, ref vs build: (300,600) rgb(161,174,190) vs rgb(124,143,165); (300,480) rgb(171,192,215) vs rgb(144,176,207); (1000,520) rgb(210,218,219) vs rgb(204,215,214). Cause is the radial wash 181:539: the build renders `radial-gradient(120% 100% at 0% 0%, ...)`, but Figma's handles ([0,0] -> [1.01,1.019] -> [-1.019,3.361]) describe an ellipse whose second axis runs ~3.4x the panel height down-and-left, so the real wash still carries ~25-38% white at the bottom-left of the painted area where the build is down to ~5-13%. Extend the gradient's vertical/diagonal reach (roughly 2-3x panel height). NOTE: `fleet-wash` currently lives in src/app/globals.css, which is a shared file owned by another agent this pass - override it from src/app/sections/the-fleet/the-fleet.module.css (the wash div already carries a section-local class) rather than editing globals.css.
  - [WARNING] Both bespoke faces still render as fallbacks and this remains the single largest visual gap. h2 computes `Exposure, Exposure-20, Newsreader, ...` and paints Newsreader: measured line 1 `One architecture,` is x 52-587 (535px) against Figma's x 51-650 (599px), i.e. 11% narrower, and visibly lighter in stroke weight - the whole top-left block reads thin next to the design's heavy slab serif. Sans computes `Matter, Inter, ...` and paints Inter, which re-breaks the lead (`...with maritime / edge compute and scales to fleets / of 3MW vessels for AI inference` vs Figma's `...with maritime edge / compute and scales to fleets of 3MW / vessels for AI inference`). Confirmed unfixable in this pass: src/app/fonts.ts documents Exposure and Matter as licensed faces and no WOFF2 exists anywhere in the repo (`find -iname '*exposure*' / '*matter*'` returns nothing), so the fallback is the intended interim state. Do NOT change the stack from this section's file.
  - [INFO] Headline block sits 6px higher than the reference (ink top y=78 vs y=84) while the eyebrow is pixel-identical (x 49-128/129, y 49-56). This is Newsreader's ascent metric inside the 80px line box, not a spacing error - it will resolve with the real face.
  - [INFO] Font-metric drift on the two pills, both from the Inter fallback: `Specifications` measures 133px wide vs Figma's 127px, and the selected `October 2026` pill 122px vs 119px. Track, centre and heights are correct; no change worth making until Matter lands.
  - [INFO] Grain/texture overlay (181:537, Figma TEXTURE effect) is present but ~40% weaker than the reference. High-frequency deviation in flat washes measures 1.08-1.25 in the build against 1.84-2.02 in Figma. Nudging the noise opacity up would close it; imperceptible at normal viewing distance.
  - [INFO] Everything fixed last round has landed and now matches. Drag-CTA chevrons read as a proper open `< >` pair at the right scale; the orbit ring and its two ~93px end windows are pixel-aligned with Figma; the segment track reaches its drawn 384x40 centred at x=720; the vessel render, the 40px white CTA at panel centre, the eyebrow, the panel fill/radius-12/inset-12/no-stroke, and the backdrop blot-mask geometry all align with zero offset. No extra elements, no hidden Figma layers rendered; the Specifications overlay stays correctly gated behind the CTA.
  - [INFO] A red rounded badge is clipped at the frame's bottom-left (y>=793, below the panel's 788px bottom edge) in the desktop and mobile captures. It sits outside the panel and is the Next.js dev-tools indicator overlaying the capture rect, not section content.

### tablet — score 86
  - [WARNING] The lead's 24%-opacity run lands on the rippled water band and is close to unreadable. At 768 the text column sits at y 598-668 while the horizon crosses at y~590, so lines 2-3 (`and scales to fleets of 3MW` / `vessels for AI inference`) sit over the dark blue ripples: measured glyph ink rgb(101,123,141) against a background of rgb(158,175,188), about 1.9:1 - and the busy ripple texture underneath makes it read worse than that number suggests. On desktop the same run sits on smooth cream sky and is legible. Move the text block up so it clears the horizon (or give the ghost run a higher floor at this width); the copy itself and the two-tone treatment are correct per Figma.
  - [INFO] Panel darkness in the lower half is the same `fleet-wash` shortfall recorded under desktop - the utility applies at every width, so the desktop fix covers this too. Not a separate change.
  - [INFO] Last round's two tablet defects are fixed: the text column is now constrained to ~384px and centred under the viewer instead of running full-bleed, and the segment control is bottom-centred (track x 192-576, centre 384 = viewport centre) instead of sitting in the 36px gutter.
  - [INFO] No Figma tablet mock. Judged on sanity: nothing overflows 768px, the headline fits on one line at the clamp's 42.7px, the viewer/vessel/orbit ring scale cleanly, all three segments and every copy block from the desktop frame survive in the same order, the 40px track and 40px CTA are adequate tap targets, and there is no clipping or overlap.

### mobile — score 88
  - [INFO] Same ghosted-run-over-water legibility squeeze as tablet but milder: line 3 (`of 3MW vessels for AI inference`, y 508-528) straddles the horizon, glyph ink rgb(105,135,155) against rgb(154,182,196). Readable but soft. Whatever clears the text block off the water at tablet should be carried here.
  - [INFO] Same Exposure -> Newsreader and Matter -> Inter fallbacks as desktop, and the same `fleet-wash` shortfall. Both recorded under desktop; neither is a separate mobile change.
  - [INFO] No Figma mobile mock. Judged on sanity: nothing overflows 390px - the segment control sits within x 36-354 with all three items intact, the headline breaks cleanly to two lines, the vessel and orbit ring scale without clipping, and the stack order eyebrow -> headline -> viewer -> lead -> CTA -> segments preserves the desktop frame's hierarchy. The red badge at the very bottom edge is the dev-tools overlay again, not section content.

## Token / CSS audit

## CSS token audit

No violations found. ✅




## Craft

If an **`impeccable`** skill is available, use its craft modes (`typeset`,
`normalize`, `polish`, `distill`) pointed at `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/DESIGN.md` — this pass is
exactly what they are for. Do not use any mode that exceeds the source.

When done, write a short JSON summary to **this exact path**: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/the-fleet/iter-04/fix-summary.json`

```json
{
  "changesMade": ["short description of each polish edit"],
  "summary": "one sentence on what you refined"
}
```
