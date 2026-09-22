# Task: Polish pass — final design-detail refinement

This section **already passed** the fidelity gate (score 92). This is a
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

- desktop (1440x900): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/about/iter-04/current-desktop.png
- tablet (768x1024): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/about/iter-04/current-tablet.png
- mobile (390x844): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/about/iter-04/current-mobile.png

## Reviewer items (info first — these are your main targets)

**Only act on issues tagged `actionable: true`.** Issues with `actionable: false`
are confirmations or notes with no Figma reference (e.g. "stacks correctly",
"no tablet reference") — do NOT change anything for those.

### desktop — score 93
  - [WARNING] Team photo frame (182:2559) has the wrong hairline: about.tsx uses `border-on-dark` (--color-on-dark = #FFFFFF), so the 1px ring is invisible on the white page. Spec 4d and the explicit border table in spec section 8 both flatten this frame's two inside strokes to `1px solid #ECECEC` - the same value the three team cards correctly use via `border-border-flat`. Pixel-sampled proof: card 1 shows rgb(236,236,236) at x=48 and y=332, while the photo edges at x=618 / y=332 / y=851 go straight from white page to photo content with no grey line. Result is the 774x520 photo floating without the ring its neighbouring cards have. Fix in about.tsx: `border-on-dark` -> `border-border-flat` on the figure.
  - [INFO] LinkedIn glyph on the team cards is still `h-4 w-[17px]` (about.tsx line ~105); Figma draws 16 x 16 (182:2097 / 2099 / 2101). One pixel of horizontal stretch - imperceptible, but a one-character fix carried over unfixed from iteration 3.
  - [INFO] Team photo is now shipped and the crop is correct - this was the critical blocker for three iterations and it is resolved. Verified numerically, not by eye: the Figma plate (182:2560, natural 1114 x 740) sits at -170 / -31 inside the 774 x 520 window, and the build reproduces that with `w-[143.93%] left-[-21.96%] top-[-5.96%]`. Cropping the shipped about-team.png to the Figma rect and diffing it against the screenshot region x=618-1392 / y=332-852 gives a mean absolute pixel difference of 3.1 (resampling noise). The percentage-based offsets also hold the same crop at every width instead of only at 1440.
  - [INFO] Section geometry measured from the PNG still matches the Figma frame exactly: 1440 x 948, 48px gutter (content right edge at x=1390 of 1392), cards block x=48-479 (432px), photo block x=618-1391 (774px) so the empty column-5 trough is the full 138px, row 1 at y=48, row 2 at y=332, section ends 96px below the photo. Trades rows at y=116 / 144 / 172 / 200 with the last row spanning the full 659px measure.
  - [INFO] Type and colour tokens verified against the computed styles: h2 48px / 48px line-height, -1.92px tracking, weight 450, rgb(41,29,29) = ink #291D1D; eyebrow Overpass Mono Bold 12px / 12px, +0.12px, uppercase at 60%; card padding 24px with a 28px internal gap, credentials at 64% and roles/trades at 60% per spec 4c/4b. Card hover transitions border-hairline -> border-rule on --ease-fluid.
  - [INFO] Restraint holds: the `FPO // Image Placeholder` badge (182:2564) is correctly not shipped, the 'Our Team' chip carries no scrim gradient and sits at the spec's 24/64/32/24 padding with 8px caption-mono at 60%, and no background ruler lines were invented (spec section 7 states this page has none). The red pill bottom-left of every screenshot is the Next.js dev overlay, not build output.
  - [INFO] Exposure (heading) and Matter (body) are licensed faces absent from the project, so the stacks fall back to Newsreader and Inter. The section requests them correctly (`Exposure, Exposure-20, Newsreader...` and `Matter, Inter, ...`); this is the shared font config, not this section's file - noted, not scored against the section.

### tablet — score 92
  - [WARNING] Same missing photo hairline as desktop - the 702 x 470 figure renders with a white (invisible) 1px border where spec section 8 asks for `1px solid #ECECEC`, so the largest block on the screen has no frame while the three cards above it do.
  - [INFO] Heading uses the global `text-display-md` clamp (2rem -> 3rem on 3.3333vw), so it renders at 32px at 768px and ~34px at 1024px. The spec's responsive table asks for clamp(36px, 3.8vw, 48px) in the 1024-1279 band, which this undershoots by roughly 5px at 1024. Changing the global token is a shared-file edit; a section-local heading clamp would close it. No tablet mock exists to contradict either value and the build reads fine as drawn.
  - [INFO] No Figma tablet reference. The adaptation is sound and matches the spec's 768-1023 intent: single-column stack in intro / trades / cards / photo order, 32px gutter (content measured x=30-735 of 768), 48px top and bottom padding, 64px row gap, trades list holds its 2 columns, cards go full width, photo holds the 774/520 aspect (702 x 470). No overflow, clipping or overlap. The faint full-width band at the very last row of the capture is the following section's panel bleeding into the clip, not an about-section element.

### mobile — score 93
  - [WARNING] Same missing photo hairline as desktop - the 342 x 230 figure uses the white `border-on-dark` ring instead of the spec's `1px solid #ECECEC`, so it reads as a bare photo next to three correctly-framed cards.
  - [INFO] No Figma mobile reference. The adaptation is sound and matches the spec's <768 intent: 24px gutter (content measured to x=369 of 390, no horizontal overflow), 48px row gap, trades list drops to 1 column at 12px row gap with the Figma reading order preserved (Tesla, Jet Propulsion Laboratory, Canadian Special Forces, Mercedes-AMG Formula 1 Team, Microsoft, Damen Shipyards Group, Bay Ship and Yacht), cards stretch full width, heading wraps to 2 lines, photo keeps its aspect and its Figma crop. Nothing clipped or overlapping.

## Token / CSS audit

## CSS token audit

No violations found. ✅




## Craft

If an **`impeccable`** skill is available, use its craft modes (`typeset`,
`normalize`, `polish`, `distill`) pointed at `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/DESIGN.md` — this pass is
exactly what they are for. Do not use any mode that exceeds the source.

When done, write a short JSON summary to **this exact path**: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/about/iter-04/fix-summary.json`

```json
{
  "changesMade": ["short description of each polish edit"],
  "summary": "one sentence on what you refined"
}
```
