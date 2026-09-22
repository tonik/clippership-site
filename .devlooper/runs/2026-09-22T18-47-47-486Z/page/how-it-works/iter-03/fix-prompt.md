## ⚠ Regression notice — READ FIRST
⚠ Regression detected in iter 3: score dropped from 76 to 58 (Δ18 pts, threshold 8). The code has been reverted to the pre-fixer state from iter 2. Do NOT repeat the changes that caused this regression. Focus on the listed issues without touching the parts that were already working.

# Task: Fix the build to match the Figma design

Your job: **close the measured gaps** between this build and its Figma design by
editing the project's source files. You do not score — a fresh reviewer re-judges
after you.

**This is a measurement-first loop. The primary signal is the numeric deltas
below (computed CSS vs design tokens) — not the screenshots.** An LLM cannot
reliably *see* that a value is 4px off or a weight is 500 instead of 600; the
measurement does. Trust the numbers first, the pictures second.

(Brand / project context is in the system prompt.)
## Before you touch any code — discipline that makes the fix land first try

1. **Grep for what already exists.** Search the project for design tokens
   (`:root`, `tokens.css`, `--color-*`, `--ease-*`, spacing/radius vars) and for
   existing components/hooks. Reuse them. Do NOT write a value from scratch when a
   token exists — that is the #1 source of drift.
2. **Never introduce arbitrary values.** `font-size: 15px`, `padding: 13px`,
   `leading-[22.126px]`, `h-[933px]` are smells. Snap every typographic, colour,
   spacing and radius value to the token scale. (Token-name traps are real too:
   a token literally named `space-6` may render as 40px, not 6px — trust the
   pre-fetched token *values*, not the name.)
3. **One focused change per pass, largest measured gap first.** Fix the biggest
   delta / most visible gap, with a clear mechanism in mind — do not shotgun the
   whole list. Multi-system edits in one pass have a large bug surface. The loop
   re-measures and re-judges after you; you get another pass.
4. **State the mechanism.** For each edit, know *why* the value was wrong (wrong
   token, missing font load, wrong cascade winner) — record it in the summary.
5. **Restraint — match, do not exceed.** Do not add sections, elements, copy or
   decorative flourishes that are not in the Figma design. Fidelity, not
   embellishment.
6. **Responsive flow, not absolute coordinates.** Build every layout with normal
   document flow + Flexbox/Grid so it reflows at any width. `position: absolute` is
   only for genuine overlays (badge/scrim/dropdown/icon-in-button), never to place
   content. Matching the 1440px reference by pixel-positioning is the #1 failure
   mode — see **Layout architecture** below. Non-negotiable.

## Output conventions — how the code must be structured

Build production-grade, maintainable code — not one giant HTML blob.

(Framework conventions are in the system prompt — follow them exactly.)

- **Design-token layer first (the style guide).** Before any component rules, define a
  `:root { … }` block of CSS custom properties straight from `DESIGN.md` — every colour,
  font family, font-size, line-height, letter-spacing, spacing step, radius and shadow as
  a **named variable** (`--color-ink`, `--font-serif`, `--text-display`, `--leading-tight`,
  `--space-lg`, `--radius-pill`, …). Then build every rule by **referencing** these tokens.
  A raw value that has a token is a bug (the audit flags it). One source of truth → change
  a token once, it updates everywhere.
- **`rem`, not `px`.** Use `rem` for all typography, spacing, sizing and radii (root is
  16px, so `1rem = 16px`; `gap: 1.5rem`, not `gap: 24px`). Reserve `px` only for 1px
  hairlines/borders and values that are genuinely device-pixel-fixed. Tokens themselves
  should be defined in `rem` so everything inherits it.
- **No orphan raw values — tokenise or name everything.** If a design value has no token
  yet (a one-off colour like a sage panel, a hover shade, a decorative offset), **add a
  token** — never inline the raw hex/px. `background: var(--color-sage)`, not `#b5b89a`;
  `:hover { background: var(--color-lime-hover) }`, not `#7be000`. This explicitly includes
  **`:hover` / `:focus` / `:active` colours** — a raw hex inside a state rule is the most
  common leak; give it a token too.
- **Layout constants are tokens too.** When you derive a value from the design that recurs
  or is non-obvious — column widths, grid-line positions, decorative-layer offsets — define
  it as a named custom property with a comment, don't sprinkle the magic number inline:
  `--hero-grid-x1: 45rem; /* 720px vertical rule */`, then reference it. A maintainer must
  be able to adjust the layout without reverse-engineering Figma pixel maths.
- **One z-index scale + one breakpoint set.** Define `--z-deco` / `--z-content` / `--z-nav`
  in `:root` and use them — never ad-hoc `z-index: 2` scattered per component. Use the same
  media-query breakpoints across every component; don't invent new px values per file.
- **Don't repeat a pattern — share it.** If the same wrapper recurs across components (an
  icon box: `display:inline-flex; width:1rem; height:1rem` + `svg{width:100%}`; a card
  shell; a carousel bleed), define one utility class in the global stylesheet and reuse it,
  instead of re-declaring it in every component.

## Iteration 3 of 8

## Measurement deltas — the primary gate (computed CSS vs design tokens)

## Measurement check (computed CSS vs design tokens)

All measured values match the token scale within tolerance. ✅


## Figma geometry — exact values from the node tree (a precision aid)

The block below is pulled **directly from the Figma node tree**, so the values are exact
where the screenshot can only approximate. Use it as a **precision aid alongside the
screenshot — the screenshot is still the visual source of truth; this fills in the exact
numbers.** How to use each part:

- **LAYOUT (auto-layout → flexbox):** when a container is listed with `flex …`, build it as
  that flexbox exactly — `flex row/column` = `flex-direction`; `gap N`; `padding t r b l`;
  `justify`/`align`; `sizing fill/hug/fixed` → `flex:1` / `fit-content` / explicit. This is
  the reliable way to get the layout right.
- **No auto-layout for a region?** Then there is no flex spec for it — **infer the flow from
  the screenshot** (group into sensible flex/grid). **Never absolute-position from
  coordinates** — the block deliberately omits raw x/y for exactly this reason.
- **OVERLAYS:** only elements listed under `OVERLAYS` are absolutely positioned in Figma —
  those are the *only* ones to `position:absolute`. Everything else is responsive flow. This
  is a responsive build: reach for absolute positioning only for a listed overlay.
- **STYLING is exact** — render every `border`/`radius` (including faint low-alpha frames
  around panels/cards/rows — the most-dropped elements), the full `box-shadow` stack, blur,
  and the exact font file + metrics. These are values you cannot eyeball; copy them.
- **Position deltas** (if listed, `build − Figma`) are relative corrections — nudge the named
  element by that much, but not if it would break responsive flow; use judgment.
- **Tag elements you build with `data-figma-id="<id>"`** (the id in brackets `[123:189]`),
  starting with the section root, so the loop can measure your build precisely next
  iteration. Data attribute only — no visual effect.

If the block is empty or sparse, just work from the screenshot and spec as usual.

Section frame: 1440×428

LAYOUT — build these containers as flexbox (exact, from Figma auto-layout):
- Images (FRAME) [181:764]: flex row, gap 24, align center, sizing hug/hug
- Frame 4 (FRAME) [181:751]: flex row, gap 4, padding 24 32 32 24, justify center, align center, sizing hug/hug
- Frame 4 (FRAME) [181:769]: flex row, gap 4, padding 24 32 32 24, justify center, align center, sizing hug/hug
- Frame 4 (FRAME) [235:618]: flex row, gap 4, padding 24 32 32 24, justify center, align center, sizing hug/hug
- Frame 4 (FRAME) [235:624]: flex row, gap 4, padding 24 32 32 24, justify center, align center, sizing hug/hug
- Frame 4 (FRAME) [247:659]: flex row, gap 4, padding 24 32 32 24, justify center, align center, sizing hug/hug

STYLING — exact values (match these; placement follows from layout + the screenshot):
- Image (FRAME) [181:726]: border 1px rgba(255,255,255,1.00) radius 8
- IMG_8487 1 (RECTANGLE) [247:662]: background: image fill, object-fit cover
- Frame 4 (FRAME) [181:751]: background: radial-gradient(at 0% 0%, rgba(43,38,38,0.80) 0%, rgba(43,38,38,0.00) 100%)
- "fig.01" [181:749]: OverpassMono-Bold 8/700 lh 8 ls 0.08 UPPERCASE color #ffffff
- Image (FRAME) [181:765]: border 1px rgba(255,255,255,1.00) radius 8
- IMG_0491 1 (RECTANGLE) [235:614]: background: image fill, object-fit cover
- Frame 4 (FRAME) [181:769]: background: radial-gradient(at 0% 0%, rgba(43,38,38,0.80) 0%, rgba(43,38,38,0.00) 100%)
- "fig.02" [181:770]: OverpassMono-Bold 8/700 lh 8 ls 0.08 UPPERCASE color #ffffff
- Image (FRAME) [235:616]: border 1px rgba(255,255,255,1.00) radius 8
- IMG_3134 (1) 1 (RECTANGLE) [235:629]: background: image fill, object-fit cover
- Frame 4 (FRAME) [235:618]: background: radial-gradient(at 0% 0%, rgba(43,38,38,0.80) 0%, rgba(43,38,38,0.00) 100%)
- "fig.03" [235:619]: OverpassMono-Bold 8/700 lh 8 ls 0.08 UPPERCASE color #ffffff
- Image (FRAME) [235:622]: border 1px rgba(255,255,255,1.00) radius 8
- IMG_0349 1 (RECTANGLE) [235:627]: background: image fill, object-fit cover
- Frame 4 (FRAME) [235:624]: background: radial-gradient(at 0% 0%, rgba(43,38,38,0.80) 0%, rgba(43,38,38,0.00) 100%)
- "fig.02" [235:625]: OverpassMono-Bold 8/700 lh 8 ls 0.08 UPPERCASE color #ffffff
- Image (FRAME) [247:657]: border 1px rgba(255,255,255,1.00) radius 8
- IMG_2875 (1) 1 (RECTANGLE) [247:658]: background: image fill, object-fit cover
- Frame 4 (FRAME) [247:659]: background: radial-gradient(at 0% 0%, rgba(43,38,38,0.80) 0%, rgba(43,38,38,0.00) 100%)
- "fig.05" [247:660]: OverpassMono-Bold 8/700 lh 8 ls 0.08 UPPERCASE color #ffffff

(6 of 21 elements use auto-layout. This is a RESPONSIVE build: use flexbox/flow; absolute-position ONLY the overlays above. Where a region has no auto-layout, infer the flow from the screenshot — never pin by coordinates.)

Deterministic position deltas vs Figma (build − Figma, 1/21 elements matched, scale 1). Largest first — close these:
- Images (FRAME): 177px left, 2280px wider.

## Figma reference — the source of truth
- Figma node: https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=181-498&t=0jpbKeeTIgsBOp2v-4
- Design system: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/DESIGN.md` — DESIGN.md format; colour, typography and
  spacing tokens. Build with these tokens.
- Extracted spec: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/spec.md` — read it.
- **Cached Figma reference image: `(no cached reference image available — use the Figma MCP sparingly to view the node)` — read this PNG to see the
  target.** It was exported once and is stable across iterations. Do **not** pull
  a fresh Figma MCP screenshot every iteration — the MCP is stateless, so
  re-pulling drifts the interpretation and burns Figma rate limits. Only call the
  Figma MCP when you need an asset (logo/icon/SVG) by node ID, or if the cached
  reference is missing.

### Which breakpoints have a design, and which you must design yourself

- **desktop** (1440px): **NO Figma mock.** Do NOT score it against another breakpoint's mock: a correct responsive layout is SUPPOSED to differ. Judge only what is judgeable without a design — overflow, unreadable or clipped text, broken or overlapping layout, tap targets, lost content, wrong tokens/fonts/colours, and whether the content hierarchy from the mock survives.
- **tablet** (768px): **NO Figma mock.** Do NOT score it against another breakpoint's mock: a correct responsive layout is SUPPOSED to differ. Judge only what is judgeable without a design — overflow, unreadable or clipped text, broken or overlapping layout, tap targets, lost content, wrong tokens/fonts/colours, and whether the content hierarchy from the mock survives.
- **mobile** (390px): **NO Figma mock.** Do NOT score it against another breakpoint's mock: a correct responsive layout is SUPPOSED to differ. Judge only what is judgeable without a design — overflow, unreadable or clipped text, broken or overlapping layout, tap targets, lost content, wrong tokens/fonts/colours, and whether the content hierarchy from the mock survives.

Where a breakpoint has a mock, match it. Where it does not, **you are the designer**:
adapt the mock you do have into a layout that genuinely works at that width — reflow,
don't shrink. Keep the same components, tokens and content hierarchy; change what has
to change (stacking, column counts, image crops, nav pattern). Do not squeeze the
desktop layout into a phone, and do not treat "differs from the desktop mock" as a bug
at a breakpoint that has no mock of its own: that difference is the point.

## The current build

Screenshots of the freshly built page, one per breakpoint:

- desktop (1440x900): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/how-it-works/iter-03/current-desktop.png
- tablet (768x1024): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/how-it-works/iter-03/current-tablet.png
- mobile (390x844): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/how-it-works/iter-03/current-mobile.png

**Read each PNG file.**

The Figma node and these screenshots may scope a whole page **or a single
section** — fix exactly that scope.

## Reviewer's verdict — overall score 58/100

Issues to fix (critical first, then warnings — `info` items are excluded, do not chase them):

### desktop — score 58
  - [CRITICAL] All five photographs are missing: every tile renders the flat grey `photo-placeholder-mid` gradient instead of how-it-works-01..05.jpg. The section IS the photography (no heading, no copy), so the built strip carries none of the design's visual content. Blocked upstream, not a code defect: asset-fetch-summary.json records all five JPEGs as `REST API rate limit after 5 successful downloads`, and public/ contains no raster assets. The spec'd per-tile object-position crops (-13px 0 / -44px -70px / 4px 0 / -79px -101px / -291px -363px) are consequently unimplemented too. Nothing the fixer can change until the assets land.

### tablet — score 60
  - [CRITICAL] Same as desktop: all five tile photographs are missing and render as flat grey placeholders (assets blocked by Figma API rate limits, see asset-fetch-summary.json). Dominates the score at this breakpoint too.

### mobile — score 60
  - [CRITICAL] Same as desktop/tablet: all five tile photographs are missing and render as flat grey placeholders (assets blocked by Figma API rate limits). Nothing else in the section carries content, so fidelity here is capped by this.



## CSS token audit (deterministic scan)

## CSS token audit

No violations found. ✅




## What earlier iterations changed

# Iteration history — page "page"

## Iteration 1
- Built the missing spec §6.3 infinite marquee (duplicated run, exact -50% seamless loop, pause-on-hover, reduced-motion scroller fallback), removed the invented hover zoom, and fixed the lost 12px mobile inset with scroll-padding.
- Changes:
    - Implemented the infinite marquee from spec §6.3: the five-tile run is now duplicated into a single track that translates -50% on a constant linear loop (new section-local `how-it-works.module.css` holds the @keyframes, since globals.css is owned by another agent this pass). Mechanism: the animation was absent in kind, not mistimed.
    - Moved the 24px inter-tile spacing off the track's `gap` and onto each tile as `mr-6`. Mechanism: with `gap` on the track, one run is 2232px but 50% of the track is 2340px, so the -50% translate would overshoot by 84px and the loop would visibly jump. With the gap carried by the tiles, one run is exactly 50% of the track and the seam is frame-perfect.
    - Pause on hover/focus-within via `animation-play-state: paused`, and a `prefers-reduced-motion: reduce` fallback that kills the animation and restores a native horizontal scroller (`overflow-x: auto`) - both were missing.
    - Removed the invented `group-hover:scale-105` zoom on the tile image. Mechanism: the design documents no hover transform for this strip; the only hover affordance is pausing the marquee, which now exists.
    - Added `scroll-p-3` to the mobile scroller. Mechanism: with `snap-x snap-mandatory` and no scroll-padding, the snapport starts at the padding-box edge, so the initial `snap-start` consumed the section's 12px padding-left and tile 1 sat flush at x=0. scroll-padding-inline: 12px restores the spec's 12px inset.
    - Kept the animation gated to >=768px so mobile stays the native snap scroller the spec describes, and hid the duplicate run below md so the mobile scroller does not gain five phantom tiles; marked the duplicate run aria-hidden so screen readers read each figure once.
    - Tagged the track with data-figma-id="181:764" for next-iteration measurement.

## Iteration 1
- Closed the 4px off-token bullet glyph (measurement gate) by inlining it as an SVG, constrained the trades list to its 659px Figma measure, and scoped the desktop-only row-alignment paddings to lg: so the stacked breakpoints lose the ~150px void; the team photo stays a token placeholder because both Figma MCP and the REST image endpoint returned rate-limit errors this pass.
- Changes:
    - Bullet marker glyph: replaced the 4px text arrow (text-micro, 7 instances - the only off-token font-size in the measurement gate; DESIGN.md's type scale bottoms out at caption-mono 8px) with an inline 4x4 SVG arrow inside the same 8px hairline box. Mechanism: the mark was carried by a font-size step that has no token, so moving it to SVG geometry keeps the identical visual (a dot at this size, per spec 4b) and removes the off-scale type value entirely.
    - Trades block: added the 659px Figma inner measure as lg:max-w-[41.1875rem] (named TRADES_MEASURE with a comment - it is a hand-set width, not a column multiple). Mechanism: the block was stretching the full 774px of columns 6-12, pushing the second bullet column to x=1017 instead of ~959.
    - Intro bottom padding pb-16 -> lg:pb-16 and trades top padding pt-6 -> lg:pt-6. Mechanism: both paddings exist only to align the two grid rows at 1440; once the layout collapses to one column they compounded with the row gap into ~152px (tablet) / ~136px (mobile) of dead space under the heading. Stacked rhythm is now just the 48/64px row gap.

## Iteration 1
- Fixed the desktop grid by explicitly placing the segment control at `lg:col-start-1` (it was spilling into implicit columns 4-6 and collapsing the layout), snapped the 56px column gap to the 48px token, and made the segment track hug its pills and the orbit ring scale with the viewer box for tablet/mobile.
- Changes:
    - ROOT CAUSE of the 3 desktop criticals: the segment-control wrapper had `lg:col-span-3 lg:row-start-3` with no explicit column. Row 3 column 3 was already occupied by the row-span-3 text column, so grid auto-placement could not fit a 3-column span anywhere in the explicit grid and spilled the control into IMPLICIT columns 4-6. Those extra auto tracks ate the container width, collapsing the `minmax(0,1fr)` middle track to 0 and dragging column 3 (the lead + Specifications CTA) back to panel centre (~663px) while the control sat right-flush at ~1050-1370. Added `lg:col-start-1` so the span is explicitly placed over columns 1-3: the lead column now resolves to the third track (x 1008-1392) and the control centres on x 720.
    - Measurement gate: `gap-14` (56px) on the lead + CTA column was off the DESIGN.md spacing scale (which steps 48 -> 64). Snapped to `gap-12` = 48px = `spacing.2xl`.
    - Tablet: the segment track stretched the full panel width while its pills only filled the first ~340px. Added `w-fit` (kept `max-w-full`) so the frosted track hugs its items at every breakpoint.
    - Mobile: `This decade` was clipped at the 354px content edge. Segment pill padding is now `px-3 md:px-4`, which brings the track to ~312px inside the 318px mobile content box so all three labels fit without relying on the invisible horizontal scroller.
    - Mobile: the orbit ring was hard-sized `w-[480px] max-w-none` against a 342px panel, so both arcs were sliced off by the panel overflow. Changed to `w-[120%] h-auto` so the ring scales with the `size-[min(400px,62vw)]` viewer box (480/400 = 120% at desktop, unchanged there).
    - Tagged the panel, header, eyebrow, headline, text column, lead, Specifications CTA, drag CTA, segment track and the three segment buttons with their Figma node ids via `data-figma-id` so the next iteration can measure precisely.

## Iteration 2
- Restored the design system's white-ring + hairline double stroke on the media tiles (it had been collapsed into the flattened #ECECEC border, which loses the white ring over photography) and repaired the reduced-motion fallback, which was clipping the strip and duplicating the run at >=768px.
- Changes:
    - Restored the two-layer tile stroke from DESIGN.md "Hairline + white ring" / spec §6.3 Borders: each tile now draws `box-shadow: inset 0 0 0 1px var(--color-on-dark), inset 0 0 0 1px var(--color-border-hairline)` (new `.tile` rule in how-it-works.module.css) instead of a single flat `border-border-flat` hairline. Mechanism: #ECECEC is only the two strokes composited against white, so the build was correct over the white section background but silently dropped the white under-ring - the layer Figma actually draws on every Image frame (`border 1px rgba(255,255,255,1.00)`) and the one that separates a tile from the dark photography these tiles carry. Two aligned 1px strokes cannot be expressed as one `border`, hence inset shadows. Both values are existing tokens; no new raw values.
    - Fixed the `prefers-reduced-motion: reduce` fallback, which was broken in two ways at >=768px. (a) The `overflow-x: auto` fallback was a bare `.marquee` selector competing with Tailwind's equal-specificity `md:overflow-hidden`, so it won or lost on bundle order; with `md:overflow-hidden` winning, a reduced-motion user got a clipped strip and no way to reach tiles 3-5. Now `section.marquee` (0,1,1), which reliably beats the utility. (b) The duplicated run is only hidden below `md`, so with the animation off the fallback scroller exposed the five tiles twice - ten tiles. Added a `.ghostRun` class hidden via `.track .ghostRun { display: none }` inside the reduced-motion query (descendant selector, again to out-specify `md:flex`). Also reset `will-change` when the animation is off.

## Iteration 2
- Moved the bullet arrow into the generated icon module to clear the section's lint error and snapped the trades labels to Figma's fill sizing plus the eyebrow to hug, closing 8 of 11 measured position deltas; the team photo remains blocked by a Figma MCP/REST rate limit that affects every section in the run.
- Changes:
    - BLOCKED - team photo (182:2560) still cannot be fetched: Figma MCP download_assets returns the Starter-plan tool-call paywall and the REST fallback (GET /v1/images?ids=182:2560) returns {"status":429,"err":"Rate limit exceeded"}. The project has no raster asset anywhere (hero, fleet, how-it-works and footer all still carry the same photo-placeholder TODO), so this is a run-wide Figma quota block, not a section bug. The frame, radius, hairline, aspect-ratio 774/520 and the 'Our Team' chip are already pixel-exact; only the image fill is missing. Left the token placeholder and the TODO with the exact export values in place rather than writing a binary (binaries are auto-reverted after the turn, which would have left a broken src).
    - Lint fix: moved the 4px bullet arrow out of about.tsx as an inline <svg> into the icon pipeline - added src/assets/icons/icon-bullet-arrow.svg and regenerated src/components/icons/index.tsx via npm run icons:generate, then imported IconBulletArrow. Mechanism: project/no-inline-svg requires every glyph to come from the generated icon module; the generator is a pure function of src/assets/icons/, so regenerating is safe alongside concurrent agents (it only adds the new export).
    - Closed 7 of the 11 measured position deltas (the trades list): the label span is now flex-1 instead of hug-width. Mechanism: in Figma each Bullet [247:718 …] is sizing FILL inside a Line row of gap 24, so the label occupies the rest of its half-column - (659-24)/2 - 16 = 301.5px - while our span hugged its glyphs. Verified against every reported delta: Tesla 36+265=301, Jet Propulsion Laboratory 178+123=301, Canadian Special Forces 171+130=301, Mercedes-AMG Formula 1 Team 224+77=301, Microsoft 65+236=301, Damen Shipyards Group 169+132=301, and the full-width last row Bay Ship and Yacht 134+509=643=659-16. No visual change (text is left-aligned), purely the measured box.
    - Closed the 'Clippership' delta (349px wider): the section eyebrow is now w-fit. Mechanism: Figma's text node hugs its glyphs (83px measured) while our block-level <p> stretched to the full 432px four-column width; 432-349=83 confirms it.
    - Left the three 'Ex-…' credential deltas alone: all three report an identical 174px, which implies a constant Figma width of 210px rather than a hug (the three strings render 218/193/151px natural), so the delta does not come from hug-vs-fill. Card geometry already matches spec 4c (432 x 146, 24px padding), and the reviewer measured the cards as correct - changing them on an ambiguous signal would regress confirmed-good geometry.

## Iteration 1
- Landed the two missing hero image layers (fetched via the Figma image-fill endpoint after the render endpoint stayed rate-limited) and made the wordmark's optical tuck proportional to the headline size so it no longer overlaps the display type at tablet and mobile.
- Changes:
    - Fetched the two missing hero raster layers. The earlier asset pass died on Figma's /v1/images render endpoint (429); instead I read the nodes' imageRef hashes and resolved them through /v1/files/<key>/images, which was not rate-limited. Saved as src/app/(home)/assets/hero-sky.png (181:671) and hero-vessel.png (247:655), both 2752x1940.
    - Replaced the two `photo-placeholder` divs in hero-stage.client.tsx with real next/image `fill` layers: sky = object-cover object-center, vessel = object-cover object-bottom inside the existing `hero-vessel-rise` parallax wrapper so the scroll timeline still drives it. This removes the invented grey vertical gradient the reviewer flagged - all visible tone now comes from the two image layers, as the spec states.
    - Fixed the wordmark/headline collision on tablet and mobile. Mechanism: the -12px optical tuck was a fixed px margin-bottom tuned for the 108px display size, but `--text-display-xl` is clamp(2.75rem, 7.5vw, 6.75rem), so at 44-56px the same -12px ate into the letterforms. Moved the tuck onto the h1 as a named custom property `--hero-wordmark-tuck: -0.111em`, which resolves against the headline's own font-size: still exactly -12px at 108px, and scales down to ~-4.9px at 44px.
    - Tagged the hero elements with data-figma-id (181:500 stage, 181:671 sky, 247:655 vessel, 181:505 title, 235:422 wordmark, 181:507 h1, 181:502 lead, 181:503 paragraph, 181:708 CTA) so the next iteration can measure positions precisely.

## The project

- Working directory: `/Users/arturgrzeda/Documents/Devlooper/clippership`
- Source file for this page: `src/app/(home)/page.tsx`
- Assets directory: `/Users/arturgrzeda/Documents/Devlooper/clippership/src/app/(home)/assets` ← save all downloaded images and icons here

Edit this project's source files to fix the issues. **Follow the project's own
structure, file formats and conventions** — match how it is already built.
Whatever the stack (a JSON-based site builder, plain HTML/CSS, a framework),
keep using the same patterns and file types the project already uses; do not
introduce a different approach. If the project ships a `CLAUDE.md` or
`AGENTS.md`, read and follow it — it describes the stack and its rules.

Reusable parts (navigation, footer, shared layout and styles) appear on many
pages — when you change one, keep it consistent for the whole site. Build things
properly: real structure, no placeholders, no half-finished work. Ignore any
`.devlooper/` or `.meno-loop/` directory — that is the automation tooling, not
the website.

## Assets — mandatory fetching

**Read the `## Assets catalogue` section in the spec (`/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/spec.md`) before writing any code.**

The spec lists every logo, icon, and decorative SVG with its Figma node ID. You MUST fetch these — do not draw approximations.

### Rules by asset type

**Logos & icons (node ID in spec) → fetch from Figma MCP**
1. Use `get_design_context` or `get_screenshot` with the node ID to get the SVG.
2. Inline the SVG directly in HTML (no external request, CSS vars cascade into it).
3. If MCP fails, fall back to REST: `GET https://api.figma.com/v1/images/<fileKey>?ids=<nodeId>&format=svg` with the header `$FIGMA_AUTH_HEADER` (already resolved in the environment - pass it verbatim as one curl -H argument).
4. **Never hand-draw a logo or icon that has a node ID** — always fetch the real asset.
5. **If a fetched asset looks wrong** (wrong shape/size, a different glyph than the spec
   describes — e.g. a caduceus where the spec says a shield) it came from the wrong node or
   render: **re-fetch the correct node ID** from Figma MCP/REST. Do NOT "fix" it by
   hand-drawing a substitute. Hand-drawing is allowed ONLY for a trivial generic glyph (a
   plain arrow/chevron) the design genuinely has no asset for.

**Decorative background SVGs (large shapes, section dividers, full-bleed art)**
- Fetch via Figma MCP using the node ID from the spec.
- Inline the SVG in HTML with `width="100%"` and the correct `viewBox` from the spec.
- Set `preserveAspectRatio` as documented in the spec (usually `none` for full-bleed).
- **Use the fetched SVG — never re-create a design element as a CSS approximation.** A
  blob/glow/blur/shape that Figma ships as an asset (`blob-1.svg`, …) must be that inlined
  SVG, not a hand-rolled `filter: blur()` glow or `radial-gradient` that "looks close" — the
  approximation reads differently and the designer spots it.

**Reproduce only what Figma shows — do NOT invent decoration.** Never add a gradient, glow,
blur, drop-shadow, overlay or background flourish that the design does not have. Embellishment
beyond the design (a "nice" hero gradient, a soft glow behind a heading) is a fidelity bug —
the figma judge scores it down and the designer flags it. If you can't point to it in the
reference/spec, don't add it.

**UI illustrations (faux dashboards, card mockups, data tables shown inside feature cards)**
- These are complex Figma frames — they cannot be exported as a single SVG.
- Rebuild them as HTML/CSS using the spec's exact colours, text content, and dimensions.
- Do NOT use a grey placeholder box — replicate the actual illustrated content.

**Raster images (photos, headshots)**
- Save to `assets/<name>.png` / `assets/<name>.jpg` and reference locally.
- If a photo fill has a Figma image hash, use MCP to get the URL or save the Figma MCP asset URL — the loop will download it automatically.
- **When a photo CANNOT be fetched** (no image hash, the export fails, or the node is only a design comp): do NOT `get_screenshot` the Figma node and use that as the image. `get_screenshot` returns the whole frame WITH its UI, text, buttons and content baked in — shipping that as a section background is the single most-reported defect in human review. Do NOT fake a photograph with SVG/`<canvas>`. Use a NEUTRAL placeholder (a solid design-token colour or a subtle token gradient) with a short `{/* TODO: real photo */}` note. And **never save or reference a WATERMARKED stock image** (a visible "Adobe Stock" / "iStock" / "Shutterstock" tile, a "Credit:" line, or a stock ID number) — treat it as missing and placeholder it. A clean placeholder beats a garbled UI-screenshot, an SVG-faked photo, or a watermarked comp.

**General rules**
- Reuse any asset already present in `assets/`. Never leave a broken `src`. Reference each asset by
  its ACTUAL filename on disk — large photos may be `.webp` (compressed), so the extension can differ
  from the spec catalogue's name. If an `<img>`/import points at a missing `.png`/`.jpg`, check the
  dir for a same-name `.webp` and use that.
- Prefer local files over remote URLs at all times.
- The loop automatically downloads any leftover `https://www.figma.com/api/mcp/asset/…` URLs, but local files are faster and more reliable.
- **Never use emoji as icon substitutes.** If the design shows an icon (arrow, checkmark, star, chevron, bolt, etc.) and you don't have the SVG yet, fetch it from Figma MCP using the node ID from the spec. Emoji look wrong at every size and break visual fidelity. A temporarily missing icon (invisible) is better than a wrong emoji.


## Common pitfalls — check these before finishing

These are the most frequent fidelity gaps. Verify each one against the spec and screenshots:

### Fonts
- **Load the right font.** If the spec lists a custom font (Inter, Geist, Plus Jakarta Sans, etc.),
  it must be loaded via `<link>` (Google Fonts) or `@font-face` — never fall back to `system-ui`
  or `sans-serif`. A wrong font family is a `critical` issue.
- **letter-spacing**: Check the spec for tracking values (e.g. `-0.02em`, `0.05em`). Apply them.
  Missing tracking makes headings look wrong even when every other value is correct.
- **line-height**: Use the exact value from the spec (e.g. `1.2`, `1.5`, `48px`). Do not leave
  the browser default — it is almost always wrong for display headings.
- **font-weight**: Confirm the weight matches exactly (400 / 500 / 600 / 700). A difference of
  one step (e.g. 400 vs 500) is visible and counts as a `warning`.

### Text effects
- **Gradient text**: If the spec documents gradient text, implement it correctly:
  ```css
  background: linear-gradient(...);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  ```
  A flat colour in place of a gradient is a `critical` issue.
- **Glassmorphism**: If a panel has a frosted/blurred background, use:
  ```css
  backdrop-filter: blur(Xpx);
  background: rgba(..., 0.N);
  ```

### Shadows
- **Multi-layer box-shadow**: Figma stacks multiple shadow layers. Implement all of them in one
  `box-shadow` declaration separated by commas. A single-layer shadow where Figma has three looks flat.

### Blend modes
- If the spec documents `mix-blend-mode: color-burn`, `screen`, `overlay`, `darken`, `multiply`, etc. — **use the EXACT mode from the spec**. Do NOT substitute one blend mode for another even if you think it looks safer or more predictable.
- Common trap: replacing `color-burn` with `multiply` because `color-burn` looks too dark on white. Resist this — the design was tested at the actual asset opacity and the result is correct. If it looks wrong, check the asset (PNG content, opacity) before changing the blend mode.
- Decorative blobs and CTA panel backgrounds especially rely on the exact blend mode to produce their characteristic colour cast.

### Interactive states
- **cursor: pointer** on every clickable element (button, link, card, accordion header, tab).
- **Hover transitions**: add `transition: <property> 200ms ease` on elements that change
  colour, background, or transform on hover. No transition = jarring snap = `warning`.
- **Focus states**: keep the browser default outline or replace it with a visible custom one.
  Do not set `outline: none` without an alternative.

### Images
- **object-fit: cover** on every `<img>` inside a fixed-size container. Without it, images
  stretch or squash.
- **aspect-ratio**: set explicitly when the spec defines a fixed image area (e.g. `aspect-ratio: 4/3`).
- **overflow: hidden** on the image container when using `border-radius` — without it, the
  image corners are not clipped.

### SVG assets — intrinsic dimension fix (critical for Figma exports)

Figma exports every SVG with `preserveAspectRatio="none"` and **no** `width`/`height` attributes.
Browsers fall back to a fake intrinsic size of **300×150** for all such SVGs — completely wrong.
This makes `width: auto`, `height: auto`, and `max-width`/`max-height` compute against a 2:1
ratio that has nothing to do with the actual artwork, causing visible stretching in every direction.

**Rule: always add explicit `width` and `height` matching the SVG's `viewBox`.**

```python
# After placing any Figma SVG asset — run or inline this fix:
import re
t = open('assets/my-icon.svg').read()
vb = re.search(r'viewBox="0 0 ([0-9.]+) ([0-9.]+)"', t)
if vb and 'width=' not in t[:t.index('>')]:
    w, h = vb.group(1), vb.group(2)
    open('assets/my-icon.svg','w').write(t.replace('<svg ', f'<svg width="{w}" height="{h}" ', 1))
```

- **Never** constrain both `max-width` AND `max-height` simultaneously with `width: auto` on an
  `<img>` — the two constraints apply independently without ratio bridging when intrinsic dims are
  wrong. Constrain **one axis only** and let the other be `auto`.
- For images in fixed-size tiles (icon grids, integration strips): use `object-fit: contain` so
  the browser letterboxes rather than stretches when the img's natural ratio differs from the tile.

### Layout architecture — responsive-first (non-negotiable)

Build the layout so it reflows at **every** width. Pixel-matching the 1440px
reference with absolute positioning is the #1 failure mode here: it scores well on
desktop and collapses on tablet/mobile. Do not do it.

- **Normal flow + Flexbox/Grid is the default and near-only layout mechanism.**
  Sections, columns, rows, stats, cards, nav — all live in flow. Reach for
  `display:flex` / `display:grid` with `gap`, `justify-content`, `align-items`,
  `flex-wrap`, and `grid-template-columns` (incl. `repeat(auto-fit, minmax(...))`).
- **`position: absolute` is ONLY for true overlays** that sit on top of a sibling:
  a badge on a card, a scrim/gradient over an image, a dropdown, an icon inside a
  button, a decorative blob. **Never** for a heading, paragraph, button, nav,
  section, column or stat. Red flag: if you're writing `top:`/`left:` to *place
  content*, stop and wrap it in a flex/grid parent with `gap`/alignment instead.
  The spec may carry leftover `left:/top:` numbers from Figma geometry — translate
  them into `gap`/alignment, never copy them as positioning.
- **Decorative overlays anchor to the content, not the viewport.** Grid-lines, guide-rules,
  hero-line SVGs, accent-dot fields and dividers must be positioned relative to the **same
  container/grid as the content they sit behind** — place them inside the content grid, or
  in a `position:relative` wrapper that also holds the content — NOT with a viewport-absolute
  `top:`/`left:` magic offset. A hardcoded `top: 5rem` that has to jump to `top: 26rem` at
  the next breakpoint is the symptom: it drifts the moment the headline height changes and
  collides with the copy. Anchor it once and let it move with the layout. Always give the
  overlay `pointer-events:none` and `z-index: var(--z-deco)` (below content) so it can never
  intercept clicks or sit on top of text.
- **Avoid fixed values unless intrinsic.** Prefer `gap`, `%`, `fr`, `minmax()`,
  `max-width` + `margin-inline:auto`, and `rem`. Fixed `px` is fine only for things
  that are genuinely fixed (icon/logo intrinsic size, 1px hairlines, radius). Don't
  pin container `width`/`height` in px — let content + flex/grid size them; prefer
  `min-height` over `height` so content can grow.
- **Fluid type & space:** use `clamp(min, preferred-vw, max)` for hero/section
  headings and large section padding so they scale smoothly between breakpoints
  rather than jumping only at media queries.
- **Each breakpoint must look intentional:** desktop multi-column → tablet fewer
  columns → mobile stacked, via `flex-wrap`/`auto-fit` or a media query — not a
  scaled-down absolute layout. Match Figma where it defines a breakpoint; design
  sensible flow behaviour where it doesn't (usually tablet/mobile).

### Mobile / responsive details
- **overflow-wrap: break-word** on long text blocks. Without it, long words overflow the
  container on mobile.
- **min-width: 0** on flex children that contain text — prevents flex overflow.
- Verify that no element has a fixed pixel width wider than the mobile viewport (390px).

## Locked regions — DO NOT TOUCH

If the source contains blocks wrapped in these markers:

```html
<!-- devlooper:locked -->
  ...any HTML here...
<!-- /devlooper:locked -->
```

**Never modify, move, or delete anything between `<!-- devlooper:locked -->` and
`<!-- /devlooper:locked -->`.** These regions were hand-tuned by a human and must
stay byte-for-byte identical. Work around them — fix everything else, but leave
locked blocks exactly as they are. The loop verifies this after your run and will
revert any change you make to a locked block (wasting the iteration), so don't.

## Craft

If an **`impeccable`** skill (or suite) is available in this environment, use it
— it produces production-grade frontend craft. Use its **craft** capabilities:
refining typography, spacing, consistency and structure toward what the design
shows (e.g. `typeset`, `normalize`, `polish`, `distill`). Do **not** use any
enhancement mode that makes a design bolder or more delightful than the source
(e.g. `overdrive`, `delight`) — the goal is to match Figma, not to exceed it.

Lean on craft especially for **responsive behaviour at breakpoints the Figma
design does not define** (often tablet and mobile): there you are designing, not
copying, and that is exactly what it is built for. Point it at `DESIGN.md`
(`/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/DESIGN.md`) as its design-system context — that is exactly the input
the impeccable suite expects.

Where the Figma design *does* define a breakpoint, replicate that design exactly
— never let craft or opinion override fidelity to Figma.

## Your job

Close the **measurement deltas** (arbitrary values + off-token warnings) and the
reviewer's `critical` / `warning` issues — **largest gap first, one focused change
this pass.** Snap off-token values to the token scale. Do **not** chase
`info`-level items, and do **not** add anything not in the Figma design. One
well-executed fix beats three rushed micro-corrections. You do not need to build
or screenshot; the loop re-measures and re-judges next.

When done, write a short summary as JSON to **this exact path**:
`/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/how-it-works/iter-03/fix-summary.json`

```json
{
  "changesMade": ["short description of each edit you made"],
  "summary": "one sentence on what you changed"
}
```
