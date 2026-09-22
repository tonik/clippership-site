# Task: Build the WHOLE page in ONE pass — as close to the design as you can get it

Build the ENTIRE page at once: every section, plus the composed route page. **Aim for the
most FAITHFUL whole-page build you can produce in a single pass — not a rough sketch.** A
per-section judge loop runs after you and refines each section to the fidelity threshold, but
that loop is expensive: every discrepancy you get right now is an iteration (and dollars) it
does not have to spend. So do not "leave it for the fixer" — reproduce what the reference,
geometry and annotations show, precisely, the first time. You have exact geometry, the rendered
reference, the token system and the designer's own build notes below; use all of them.

Correct STRUCTURE and layout still come first (a wrong structure is the most expensive thing to
undo), but on top of a right structure, match spacing, type, colour, borders, shadows and
content as exactly as the inputs allow. The result should be lint-clean, on-token, responsive,
and close enough that a section could pass on the loop's first iteration.

The framework conventions, the design system, and the brand context are in your system
prompt — **follow them exactly** (token-first, section folders, no inline svg/style, the
icon pipeline, a11y, the mobile-first breakpoints). They are enforced by the project lint.

## Inputs (read these first)

- Spec: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/spec.md` — the full design spec (sections, copy, dimensions, colors, type).
- Sections: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/sections.json` — the ordered section list + the `selector` and `nodeId`
  each section root must carry.
- Design system: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/DESIGN.md` — brand tokens. The project's design-token file already
  exists; USE the existing tokens, add one only for a genuinely new reusable role.
- Reference image: `(no cached reference image available — use the Figma MCP sparingly to view the node)` — the rendered design (look at it).
- **Figma geometry: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/page-geometry.md` (exact per-section numbers: auto-layout to flexbox,
  borders, shadows, fonts) pulled straight from the Figma node tree. READ IT.** These are exact
  where the reference image only approximates; the per-section fixer uses the same data, so using
  it now means your draft lands the layout and dimensions right the first time. How to read it:
  build each `LAYOUT` container as the stated flexbox (`flex row/column` = `flex-direction`, `gap N`,
  `padding t r b l`, `justify`/`align`, `sizing fill/hug/fixed` to `flex:1`/`fit-content`/explicit);
  only elements under `OVERLAYS` are absolutely positioned; copy every `STYLING` value (border,
  full box-shadow stack, exact font + metrics) that you cannot eyeball. No auto-layout listed
  for a region: infer sensible flex/grid flow from the reference, never absolute-position it.
  **The geometry is authoritative for STRUCTURE and proportion - but its spacing NUMBERS
  (gap/padding/row-gap/column-gap/radius) must be expressed as TOKENS, never as raw inline px.**
  A geometry `gap 48` / `padding 200` is the exact, faithful Figma value - keep that value, but route
  it through the token scale:
  - If it matches an existing `spacing:` token in `DESIGN.md` (within ~2px), use that token.
  - If it does NOT (e.g. the scale jumps 16 → 32 and 40 → 64 but the design genuinely uses 24 and 48,
    or a one-off like 100 / 200), **ADD it as a new step to the `spacing:` scale in `DESIGN.md` AND to
    the project's CSS token file**, snapped to the 8px grid, then reference that token. Do NOT snap a
    faithful value down to a distant token (200 → 128 loses 72px of the hero's top space) - extend the
    scale to the real value instead, so fidelity AND token-conformance both hold.
  Never emit `gap: 48px` / `padding-top: 200px` inline. Raw geometry px copied verbatim is the #1
  thing the per-section measurement flags as an arbitrary off-token value on iteration 1; tokenising
  it now (extending the scale where needed) is what lets a section pass first time instead of bouncing
  back for a spacing fix. Keep the scale tidy: 8px-grid steps, no sub-pixel noise.
- **Designer build notes (Figma Dev Mode annotations) + any human note and reference screenshots
  are in your system prompt.** The annotations are explicit instructions the designer pinned to
  elements ("typewriter effect on scroll", "on hover show the number", "show once every 6h") — a
  static reference cannot show them, so BUILD what they say (the interaction hooks, the conditional
  content, the states), don't ignore them because they aren't visible in the mock. If a reference
  screenshot was attached, treat it as an exact target for that section and match it.
- Assets: `/Users/arturgrzeda/Documents/Devlooper/clippership/src/app/(home)/assets` — exported logos/photos/icons ALREADY downloaded. Use them; do not
  hand-draw what already exists. **List the directory and reference each asset by its ACTUAL
  filename** — large photos may have been compressed to `.webp`, so the extension can differ from
  what the spec catalogue names (use `hero.webp` if that is what is on disk, not `hero.jpg`).
- Project root: `/Users/arturgrzeda/Documents/Devlooper/clippership`
- Route page to compose into: `src/app/(home)/page.tsx`

## Sections to build (in this order)

1. `hero` — selector `[data-section="hero"]`, data-figma-id="181:499"
2. `how-it-works` — selector `[data-section="how-it-works"]`, data-figma-id="181:508"
3. `the-fleet` — selector `[data-section="the-fleet"]`, data-figma-id="181:534"
4. `about` — selector `[data-section="about"]`, data-figma-id="182:2323"
5. `footer` — selector `[data-section="footer"]`, data-figma-id="182:2746"

## What to do

1. Ensure the design tokens from `DESIGN.md` exist in the project's token file (the
   conventions say where). Add only what is missing. **Complete the `spacing:` scale from the
   geometry:** if the geometry uses a faithful spacing value the scale is missing (the design
   uses 24 and 48 but the scale jumps 16 → 32 → 40 → 64; one-offs like 100 / 200), add that step
   to `DESIGN.md`'s `spacing:` scale (8px-grid) and the token file, so the per-section measurement
   recognises it as on-token rather than flagging it as arbitrary. See the geometry input above.
2. For EACH section above, build its section folder per the conventions (one folder per
   section, `index.ts` re-export + the section-root component). The section ROOT element
   MUST carry **`data-section="<name>"`** (the exact section name from the list above) AND
   **`data-figma-id="<nodeId>"`** — the fidelity loop scopes its screenshots and the geometry
   channel by these, so they are REQUIRED on every section root, even if the listed selector
   is a class. If the list gives a class selector too, apply that as well.
3. Compose ALL sections, in order, into `src/app/(home)/page.tsx`.
4. **Assets at FULL quality — do NOT downgrade icons to raster.** Every icon, glyph, logo, chart,
   dial, line/divider, quote-mark and decorative vector MUST stay an **SVG**: either an SVG file
   from the assets directory, or an icon-pipeline component (`src/icons/source` + generate). NEVER
   reach for a raster `.png`/`.jpg` `<Image>` for something that is a vector — a raster icon looks
   blurry/soft when scaled and is a quality regression. Use raster images ONLY for genuine
   photographs/screenshots. If an asset exists in BOTH .svg and a raster form, use the **.svg**.
   This is the one place a fast whole-page pass tends to cut corners — do not. Never inline `<svg>`
   or raw `style` (CSS-var-only), never an arbitrary color/type value (emit a token instead).
5. Do NOT run the dev server, take screenshots, or run lint — just write clean source.
   The loop does verification.

## Layout architecture: responsive flow, NEVER absolute coordinates (the #1 failure mode)

The draft owns STRUCTURE, and a bad structure is the most expensive thing for the loop to
undo. Get this right and the loop only has to refine:

- **Normal flow + Flexbox/Grid is the default and near-only layout mechanism.** Sections,
  columns, rows, cards, stats, nav all live in flow (`display:flex`/`grid` with `gap`,
  `justify-content`, `align-items`, `flex-wrap`, `grid-template-columns`). Build from the
  geometry's auto-layout blueprint, not from pixel coordinates.
- **`position:absolute` is ONLY for true overlays** (a badge on a card, a scrim over an image,
  a dropdown, an icon inside a button, a decorative blob): the elements the geometry lists
  under `OVERLAYS`. **Never** absolute-position a heading, paragraph, button, section, column
  or stat. If you're writing `top:`/`left:` to *place content*, stop and wrap it in a flex/grid
  parent instead. Pixel-matching the 1440px reference with absolute positioning scores well on
  desktop and collapses on tablet/mobile, so do not do it.
- **Decorative overlays anchor to the content, not the viewport:** put grid-lines, guide-rules
  and dividers inside the same content grid / a `position:relative` wrapper, with
  `pointer-events:none` and a below-content z-index; never a viewport-absolute magic offset.
- **Make it responsive in this pass - tablet AND mobile, not just desktop.** The geometry is the
  desktop frame, but the per-section judge scores all THREE breakpoints (desktop ~1440, tablet
  ~768, mobile ~390) on iteration 1. So as you build each section, give it sensible responsive
  behaviour now: multi-column grids collapse (`flex-wrap` / `repeat(auto-fit, minmax())` / a
  media query) to fewer columns on tablet and a single stacked column on mobile; use `clamp()`
  for hero/section headings and large section padding so they scale; add `overflow-wrap:break-word`
  and `min-width:0` on text flex children so nothing overflows the 390px viewport. A desktop-only
  draft that collapses on mobile fails the mobile breakpoint at iter 1 - build all three from the start.

## Rebuild UI illustrations in HTML - do NOT use a raster screenshot of one

A "background" asset that actually contains UI, text, a diagram or a chart is NOT a background -
it is a flat raster screenshot of a Figma frame, and using it as an `<Image>` ships soft,
unselectable, non-responsive, un-refinable pixels (and the judge flags it). If an asset in the
assets directory is a rastered UI frame (e.g. a `*-bg.jpg` that shows boxes/labels/arrows/a
"Seller -> Buyer" diagram / a faux dashboard / a bar chart), **rebuild that content as real
HTML/CSS** from the spec + geometry (the actual boxes, labels, connectors, exact colours and
copy), and use ONLY the genuine background behind it (the photo/gradient/texture) as an image, if
any. Use a raster `<Image>` ONLY for true photographs, headshots and textures - never for anything
that is structured UI. This is the one asset trap a fast pass falls into; rebuild, don't paste.

**When the real background photo is MISSING from the assets dir** (asset-fetch skipped or failed it):
do NOT improvise it by screenshotting the Figma node. `get_screenshot` returns the WHOLE frame with
its UI, text, buttons, icons and content baked in - shipping that as a section background is the
single most-reported defect in human review (backgrounds that show the design's own interface and
copy). Do NOT recreate a photograph or photo-illustration as SVG/`<canvas>` either. Instead use a
NEUTRAL placeholder background (a solid design-token colour, or a subtle token-based gradient) and
leave a short `{/* TODO: real photo for <section> */}` note. And **never save or reference a
WATERMARKED stock image** (a visible "Adobe Stock" / "iStock" / "Shutterstock" tile, a "Credit:"
line, or a stock ID number) - treat it as missing and placeholder it. A clean neutral placeholder is
far better than a garbled UI-screenshot, an SVG-faked photo, or a watermarked comp; the human drops
the real asset in afterwards.

## Build it right the first time: the gaps the judge always catches

Spend the small effort now; these are the exact discrepancies the per-section judge flags,
and getting them right in the draft means a section can pass at iteration 1:

- **Fonts:** load the real font from the spec (never fall back to `system-ui`/`Arial`), and
  apply its `letter-spacing`/tracking, `line-height` and `font-weight` exactly. A wrong font
  family or missing tracking is one of the most-flagged misses.
- **SVG intrinsic-size trap:** Figma exports SVGs with no `width`/`height`, so browsers assume a
  fake 300x150 and stretch them. Add explicit `width`/`height` matching the `viewBox` to every
  placed SVG; for icons in fixed tiles use `object-fit: contain`.
- **Restraint, match do not invent.** Reproduce ONLY what the reference/spec shows. Do NOT add
  a gradient, glow, blur, drop-shadow or background flourish the design does not have: a fast
  draft is the most prone to embellishing, and the judge scores every extra down.
- **The most-dropped, pixel-diff-invisible details:** faint hairline borders around panels/cards
  (low-alpha strokes), background grid / guide lines, multi-layer box-shadows (render all layers,
  not one flat shadow), the EXACT `mix-blend-mode` from the spec (don't soften `color-burn` to
  `multiply`), and gradient text via `background-clip:text` + `color:transparent`.
- **Images:** `object-fit: cover` inside fixed-size containers, `overflow:hidden` when a radius
  clips an image. **Interactive elements:** `cursor:pointer` + a `transition` on color/transform.

## Finish — write the summary

When done, write a JSON summary to `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/page-draft-summary.json` listing exactly which
sections you actually built (by their `name` from the list above), so the loop knows
which sections to evaluate on its first iteration instead of rebuilding from scratch:

```json
{ "ok": true, "sections": ["nav", "hero", "..."], "notes": "anything skipped or partial" }
```

Only include a section name in `sections` if you actually created its files AND composed
it into the page. Omit any section you could not build — the loop will build those from
scratch as usual.
