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

## Iteration 2 of 8

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

Section frame: 1440×252

LAYOUT — build these containers as flexbox (exact, from Figma auto-layout):
- Content (FRAME) [246:652]: flex row, gap 415, padding 48 0 48 0, justify space-between, align center, sizing fixed/hug
- Text (FRAME) [183:79]: flex column, gap 8, padding 0 36 0 36, justify center, sizing hug/hug
- Social (FRAME) [183:73]: flex row, gap 24, padding 0 36 0 36, align center, sizing hug/hug
- Backers (FRAME) [246:631]: flex row, gap 24, padding 48 36 0 36, align center, sizing fixed/hug

STYLING — exact values (match these; placement follows from layout + the screenshot):
- Wrapper (FRAME) [182:2961]: border radius 12
- waves (RECTANGLE) [183:93]: background: image fill, object-fit cover; opacity 0.64
- "(c)2026 Clippership inc." [183:78]: OverpassMono-Bold 12/700 lh 12 ls 0.12 UPPERCASE color #191919; opacity 0.8
- "hello@clippership.co" [183:80]: OverpassMono-Bold 12/700 lh 12 ls 0.12 color #191919; opacity 0.8
- Social (FRAME) [183:73]: opacity 0.8
- Logo (RECTANGLE) [235:515]: background: image fill, object-fit cover
- Brand (FRAME) [246:633]: border radius 4
- Rectangle 12 (RECTANGLE) [246:634]: background: image fill, object-fit contain; mix-blend-mode: darken; opacity 0.6
- Brand (FRAME) [246:635]: border radius 4
- Rectangle 12 (RECTANGLE) [246:636]: background: image fill, object-fit contain; mix-blend-mode: darken; opacity 0.6
- Brand (FRAME) [246:637]: border radius 4
- Rectangle 13 (RECTANGLE) [246:638]: background: image fill, object-fit cover; mix-blend-mode: darken; opacity 0.6
- Brand (FRAME) [246:639]: border radius 4
- Rectangle 14 (RECTANGLE) [246:640]: background: image fill, object-fit contain; mix-blend-mode: darken; opacity 0.6
- Brand (FRAME) [246:641]: border radius 4
- Image (FRAME) [246:642]: background: image fill, object-fit contain; mix-blend-mode: darken; opacity 0.6
- Brand (FRAME) [246:643]: border radius 4
- Image (FRAME) [246:644]: background: image fill, object-fit contain; mix-blend-mode: darken; opacity 0.6
- Brand (FRAME) [246:645]: border radius 4
- Image (FRAME) [246:646]: background: image fill, object-fit contain; mix-blend-mode: darken; opacity 0.6
- Brand (FRAME) [246:647]: border radius 4
- Image (FRAME) [246:648]: background: image fill, object-fit contain; mix-blend-mode: darken; opacity 0.6
- Brand (FRAME) [246:649]: border radius 4
- Image (FRAME) [246:650]: background: image fill, object-fit 100% 100%; mix-blend-mode: darken; opacity 0.6
  ↳ Blend modes above are EXACT from Figma — apply them verbatim, do not invent or omit them. A blend only takes effect when the layer composites against what is BEHIND it: never place a blended layer inside a wrapper that forms its own stacking context (z-index, opacity < 1, transform, filter, or isolation), or the blend resolves against an empty/transparent group instead of the real background (e.g. `screen` then fails to erase black and a fade-to-black flare renders as an opaque dark blob). Keep the blended element compositing directly over the actual section background.

OVERLAYS — only these are absolutely positioned in Figma (everything else is responsive flow):
- Logo (FRAME) [235:514]: a true overlay — position absolutely within its parent.

(4 of 29 elements use auto-layout; 1 are true overlays. This is a RESPONSIVE build: use flexbox/flow; absolute-position ONLY the overlays above. Where a region has no auto-layout, infer the flow from the screenshot — never pin by coordinates.)

## Figma reference — the source of truth
- Figma node: https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=181-498&t=0jpbKeeTIgsBOp2v-4
- Design system: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/DESIGN.md` — DESIGN.md format; colour, typography and
  spacing tokens. Build with these tokens.
- Extracted spec: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/spec.md` — read it.
- **Cached Figma reference image: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/reference-section-footer.png` — read this PNG to see the
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

- desktop (1440x900): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/footer/iter-02/current-desktop.png
- tablet (768x1024): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/footer/iter-02/current-tablet.png
- mobile (390x844): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/footer/iter-02/current-mobile.png

**Read each PNG file.**

The Figma node and these screenshots may scope a whole page **or a single
section** — fix exactly that scope.

## Reviewer's verdict — overall score 80/100

Issues to fix (critical first, then warnings — `info` items are excluded, do not chase them):

### desktop — score 80
  - [WARNING] Backer logo row is far too faint: measured darkest logo pixel is 154 in the build vs 97-120 in the Figma reference, consistently across all 9 slots. Effective alpha computes to ~0.38 instead of the spec's 0.6 - the classic symptom of opacity:0.6 being applied to BOTH the slot <a> and the <img> (0.6 x 0.6 = 0.36). Apply the 0.6 + mix-blend-mode: darken once, on the img only (spec.md 'Backer row 246:631').
  - [WARNING] Wave backdrop (footer-waves) renders ~36% too transparent. Sampling the panel centre column: at y=228 Figma is rgb(133,176,218) but the build is rgb(174,201,228); across every row the build's wave contrast against the panel wash is a constant 0.64x the reference, i.e. effective opacity ~0.41 instead of the spec's 0.64. Crest alignment is exact (best vertical cross-correlation at shift 0, r=0.99), so this is purely opacity, not the -59px anchor. Check for a doubled opacity (0.64 on a wrapper AND on the img) or an extra wash layer over the image.

### tablet — score 84
  - [WARNING] Same doubled-opacity token bug as desktop carries over: backer logos render at roughly 0.36 effective alpha instead of the documented 0.6 + mix-blend-mode: darken, so the whole logo row reads ghosted. This is a token violation, judgeable without a tablet mock.

### mobile — score 80
  - [WARNING] The NVIDIA Inception logo (slot 9, bottom-right of the 3x3 grid) is effectively invisible - its darkest pixel is 158 against a mid-blue wave, giving almost no contrast, and the eye-mark is clipped at the top. This is the doubled-opacity bug compounded by the darker wave behind it at this breakpoint; restoring the single 0.6 opacity brings it back. A backer logo that cannot be read is lost content, not a styling nuance.
  - [WARNING] Same doubled-opacity token bug as desktop across the whole backer grid (effective ~0.36 vs the spec's 0.6 + mix-blend-mode: darken).

## Pixel-diff (deterministic measurement)
- desktop: 6.03% of pixels differ from the Figma export (diff heatmap: /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/footer/iter-02/diff-desktop.png — coloured marks show where)


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

## Iteration 3
- Fetched the five how-it-works photographs from Figma's render endpoint (no longer rate-limited) and wired them into the tiles with percentage-based crops that reproduce the spec's offsets at every breakpoint.
- Changes:
    - Unblocked and fetched the five missing tile photographs (the one CRITICAL at every breakpoint). Mechanism: the original asset pass died on Figma's /v1/images render endpoint (429 after 5 downloads) and never retried; the endpoint is no longer rate-limited this pass. Read the imageRef hashes off the five RECTANGLE nodes (247:662, 235:614, 235:629, 235:627, 247:658) to confirm the fills exist, then rendered each rect at scale=2 as JPEG - which returns exactly the Figma rect crop (1458x846, 816x1088, 1076x808, 984x1312, 1674x2232 = 2x the layer boxes) rather than the 5-9MB originals. Saved to src/app/(home)/assets/how-it-works-01..05.jpg.
    - Replaced the five photo-placeholder-mid divs with real next/image layers and removed the TODOs. Each tile now renders its photo through a crop plate inside the already-clipped figure.
    - Implemented the spec's per-tile crops responsively instead of as the spec's raw px object-position values. Mechanism: each photo is a Figma rect LARGER than its tile at a negative offset (729x423 at -13,0 in a 546x404 tile; 408x544 at -44,-70; 538x404 at 4,0; 492x656 at -79,-101; 837x1116 at -291,-363 - each verified against the absolute bounding boxes, which reproduce the 24px inter-tile gaps exactly). A px object-position only holds at 404px tall, so every crop is stored as rect-size/tile-size and offset/tile-size percentages (e.g. 133.516% / 104.703% / -2.381% / 0%) fed to a new .crop rule in the section CSS module via four custom properties, so the framing survives the tile shrinking to 62vw on mobile.
    - Moved data-figma-id="181:764" (the Images frame) off the two-run marquee track onto the first run, and tagged each tile's Image frame, rect fill and chip frame with their Figma ids. Mechanism: the reported '2280px wider' delta was the measurement matching the duplicated track (2 x 2256px) against Figma's single 2232px run; the duplicate is required for the seamless loop, so the id now points at the run it actually describes.

## Iteration 3
- Landed the missing team photo - fetched via the Figma image-fill endpoint after the render endpoint stayed rate-limited - with Figma's crop expressed as percentages of the frame so it holds at every breakpoint, and restored the frame's white 1px stroke now that there is a photograph under it.
- Changes:
    - Fetched the real team photo (182:2560), which was blocked by a Figma quota in iterations 1-2. The /v1/images render endpoint is still rate-limited, so I read the node's image fill imageRef (585085de...) and resolved it through /v1/files/<key>/images, which is not - saved as src/app/(home)/assets/about-team.png (1024x680).
    - Replaced the flat `photo-placeholder` div in the about figure with a next/image plate. Mechanism: the section was rendering a 774x520 grey gradient - about a third of its area - because the asset had never landed; the element was correct in kind, only the fill was missing.
    - Reproduced Figma's crop as percentages of the frame instead of the 1440-only px offsets in the TODO: the plate is 1114x740 behind a 774x520 window at -170/-31, so it is w-[143.93%] at top-[-5.96%] left-[-21.96%]. Mechanism: the figure keeps aspect-774/520 at every breakpoint, so a proportional crop is identical at 1440, 768 and 390, whereas `object-position: -170px -31px` would have slid the framing off at the smaller widths (and object-fit: cover alone cannot reach this zoom - the crop is 69.5% of the image width, cover only 76.5%).
    - Switched the figure's stroke from `border-border-flat` (#ECECEC) to `border-on-dark` (#FFFFFF) to match Figma's `Image [182:2559]: border 1px rgba(255,255,255,1.00)`. Mechanism: #ECECEC is only that white stroke composited against the white page, which read correctly while the interior was a grey placeholder but draws a grey line over the photograph now that there is one.
    - Moved the 4px bullet arrow out of about.tsx as an inline <svg> and onto the generated IconBulletArrow (src/assets/icons/icon-bullet-arrow.svg already existed, but src/components/icons/index.tsx had lost the export to a concurrent regeneration, so the section was failing project/no-inline-svg). Re-ran `npm run icons:generate`, which is a pure function of the asset dir and re-emitted all six icons - nothing else changed.
    - Tagged the figure and the image with data-figma-id 182:2559 / 182:2560 for next-iteration measurement.

## Iteration 2
- Fetched and rendered the three missing fleet rasters - the vessel silhouette in the viewer and the painted sea masked by the watercolour blot as the panel backdrop - which closes the critical empty-centre and blank-backdrop findings at every breakpoint.
- Changes:
    - Fetched the three fleet rasters that the batch asset step had dropped to a Figma REST rate limit (181:537, 181:538, 181:540) and put their Figma MCP asset URLs in one section manifest, src/app/sections/the-fleet/assets.ts, so the loop's downloader can mirror them into (home)/assets by rewriting a single file. Mechanism: the assets were never missing from the design, only from disk - the build had been carrying TODO placeholders in their place.
    - Replaced the flat `photo-placeholder` gradient in the-fleet.tsx with the real painted backdrop (Figma 181:536 'BG'): the painted sea (181:538) at opacity 0.64 with the existing `fleet-wash` radial gradient (181:539) above it, both clipped by the watercolour blot (181:537). IMPORTANT correction to the spec: 181:537 is NOT a visible 'fleet-sky' layer - inspecting the asset shows a purple watercolour blot used as the group's ALPHA MASK. Rendering it as an image would have shipped a purple stain; masking with it is what produces the panel's torn painted edge seen in the Figma render.
    - Added the-fleet.module.css (section-local, since globals.css is owned by another agent this pass) carrying the mask geometry as named custom properties: --fleet-blot-size/-x/-y translate Figma's 1713x1374 blot at -82/-393 inside the 1416x776 panel into 121% / 28% / 66%, applied only from lg. Below lg the panel is far taller than it is wide, so the blot falls back to mask-size:cover at 50%/40% - a width-driven blot would stop short of the panel bottom.
    - Rendered the vessel silhouette (181:540) in the viewer box in the-fleet-roadmap.client.tsx, stacked over the orbit ring and under the drag handle exactly as Figma orders them. This fills the empty centre that was the CRITICAL on all three breakpoints (~450px of blank panel at tablet, ~280px at mobile).
    - Wired the same render into the Specifications overlay (247:1082) - 400x400, 24px from the left and vertically centred at lg, a centred min(400px,62vw) plate below - removing the last TODO for this asset.
    - Fixed a build-breaking type error left in the section: the segment buttons read `state.figmaId` but RoadmapState had no such field. Added `figmaId` to the type and the three states (181:550 / 181:552 / 181:554) rather than reverting to a parallel id array. `npx tsc --noEmit` and `npm run build` both pass.

## Iteration 4
- Trimmed the mobile scroller's trailing whitespace to the spec's 12px by dropping the last tile's right margin below 768px, leaving the desktop/tablet marquee untouched.
- Changes:
    - Removed the trailing 24px right-margin from the last tile below the md breakpoint (mr-6 last:mr-0 md:mr-6) so the mobile scroller ends with the spec's 12px of white instead of 36px, while keeping the 24px seam margin on the desktop/tablet marquee

## Iteration 4
- Closed the two actionable reviewer gaps: gave the team photo the same #ECECEC hairline as the cards, and fixed the LinkedIn icon's 1px horizontal stretch.
- Changes:
    - Team photo frame: swapped border-on-dark (white, invisible) for border-border-flat (#ECECEC hairline) to match the three team cards, per spec 4d/section 8
    - LinkedIn glyph on team cards: changed w-[17px] to w-4 so the 16x16 icon renders square instead of stretched, matching Figma 182:2097/2099/2101

## Iteration 2
- Restored the two hero image plates (they had been reverted out of the source) and rebuilt their framing off the stage height plus each asset's natural aspect-ratio so the vessel and sky render at the Figma overscale instead of a too-small object-fit crop; also made the headline's non-breaking space a \u00A0 escape so Figma's line split finally holds, and moved the lead into the open-water band at tablet/mobile so the 48% quiet run stops crossing the white sails.
- Changes:
    - RE-LANDED THE TWO IMAGE PLATES, which had vanished from the source. hero-stage.client.tsx on disk had been reverted to the pre-iteration-1 version: two `photo-placeholder` grey-gradient divs plus TODOs, even though the iter-02 screenshot (built from the iteration-1 bundle, which still contains hero-sky/hero-vessel) shows photographs. Left unfixed, this pass would have shipped a hero with no imagery at all. Both next/image layers are back, now with the correct geometry.
    - Fixed the CRITICAL under-scale/mis-anchor of both plates. Mechanism: Figma does not object-fit these rasters - it draws each at its NATURAL pixel size inside the 1416x1280 stage (sky 2279x1607, vessel 2252x1588), which is the ~1.6x overscale the spec demands ('do not downscale to the frame'). Plain `object-fit: cover` only reaches 1815x1280 for the vessel, hence the ship reading ~20% small and ~230px high with a band of empty water along the bottom. New section-local hero.module.css `.plate` rule drives the framing off the STAGE HEIGHT plus the asset's own aspect-ratio rather than raw 1440 offsets: sky = top -5.6%, height 125.5%, ratio 2279/1607, centred; vessel = top 0, height 124.1%, ratio 2252/1588, translate -43.8% of its own width. At 1440 that resolves to exactly 2278x1606 at x-431 and 2253x1588 at x-279, i.e. the reviewer's target values, and it holds at any stage width because every number is a percentage.
    - Scoped the natural-size plate geometry to lg (>=992px) only. Mechanism: at 390px the plate would be ~1100px wide against a 366px stage - three times the frame - so below the desktop mock the plates fall back to the spec's `object-fit: cover` (sky center, vessel center bottom), which is the framing the smaller breakpoints were designed around.
    - Fixed the WARNING that the headline breaks in the wrong place, and found the mechanism: the U+00A0 between 'the' and 'maritime' was a bare literal character in the source and had been silently normalised to an ordinary space, so it never reached the DOM (verified in the prerendered HTML: the About section's NBSP survived, both of the hero's did not). NBSP is now written as the escape `"\u00A0"`, which no formatter or copy/paste can flatten - confirmed present in .next/server/app/index.html for both the h1 and the lead. On top of that, an explicit `<br className="hidden lg:inline" />` after 'at' pins Figma's two-line split ('AI compute at' / 'the maritime edge.') at the desktop frame regardless of which face ends up loading, while the narrower frames stay free to rewrap.
    - Fixed the tablet + mobile WARNING that the 48% quiet run sits over the white sails at ~2.4:1. The lead block is now `mt-auto mb-9` below lg, which parks it in the open-water band at the foot of the stage (the vessel's waterline sits at ~60% of the plate, the lead now starts at ~65-70%) instead of crossing the masts, and `lg:mt-24 lg:mb-0` restores the drawn 96px offset at the desktop frame. The stage min-height went 620px -> 42.5rem (680px) so the water band is deep enough to hold the lead plus CTA at 390px without the text riding back up into the rigging. The text token itself is untouched, as the reviewer asked.
    - Closed the -11.988px arbitrary margin-top. Mechanism: the wordmark tuck was `-0.111em` against the 108px headline, which lands 0.012px short of the drawn -12px. It is now `calc(var(--space-xs) * -1)` = exactly -12px from lg up (where the 1440 measurement is taken) and stays proportional (-0.111em) below lg, where --text-display-xl is a clamp and a flat -12px would eat into the letterforms.
    - Re-applied the data-figma-id tags lost in the revert: 181:500 stage, 181:671 sky, 247:655 vessel, 181:505 title, 235:422 wordmark, 181:507 h1, 181:502 lead, 181:503 paragraph, 181:708 CTA.
    - NOT FIXED - the Exposure/Matter font CRITICAL. The faces are licensed and no WOFF2 exists anywhere in the repo, and the font wiring lives in src/app/fonts.ts, src/app/layout.tsx and globals.css - all shared files owned by other agents this pass, which I was instructed not to touch. The fallback stacks (Exposure -> Newsreader, Matter -> Inter) are already named correctly there; landing the real faces is a shared-file change and needs to be applied on its own. The `<br>` above means the headline now holds Figma's line split even while the fallback is standing in.
    - NOT CHANGED - the 148px and 96px margin-tops the measurement gate flags as arbitrary. Both are literal spec values (spec Section 9 spacing table: 'Hero - title top 148px', 'Hero - title block -> lead block 96px') and both are on DESIGN.md's 4px base unit with named tokens in globals.css (--space-6xl, --space-4xl). The audit's token list tops out at 64px, so snapping them would be a 84px/32px fidelity regression. Kept per 'fidelity beats purity'.
    - npx tsc --noEmit, npx eslint src/app/sections/hero --max-warnings=0 and npm run build all pass.

## Iteration 1
- Fetched and wired in the footer's ten missing rasters - the painted wave backdrop and the nine backer logos at opacity 0.6 + mix-blend-mode: darken - which closes both criticals at all three breakpoints and removes the text-placeholder truncation.
- Changes:
    - Fetched the 10 missing footer rasters from the Figma REST render endpoint (no longer rate-limited) into src/app/(home)/assets: footer-waves.png (183:93, rendered 2x = 2832x956) and the nine backer slot frames 246:633/635/637/639/641/643/645/647/649 (each 256x72 = 2x the 128x36 slot). Mechanism: both criticals were pure asset loss - the elements existed in the markup as photo-placeholder / text TODOs because the original asset pass never landed these files.
    - Replaced the empty .photo-placeholder div with a real next/image wave band. At lg it keeps Figma's exact anchoring (top: -59px, height: 478px, object-fit: cover, opacity 0.64) inside the 240px panel; below lg the panel is far taller than 240px so the band covers the panel (inset-0, h-full) instead. Mechanism for the responsive split: the spec's 'height: 199%' proportional anchor is derived from the 240px panel and would blow the image up to ~1000px on the tall mobile panel, sliding the crests out of frame; covering keeps the sky-behind-backers / waves-behind-meta reading at every width.
    - Replaced the nine uppercase Overpass Mono text placeholders with the nine real logo images, each rendered opacity-60 + mix-blend-darken per Figma (246:634 ... 246:650) so the white logo plates are erased by the panel wash. Used the exported SLOT frames (which already clip and centre each oversized mark, e.g. the 80x63 Dykstra in a 128x36 slot) with object-contain, so the clipped-plate look is preserved and the slot scales without distortion at tablet/mobile.
    - Deliberately did NOT add isolation/z-index to the panel or the ul: mix-blend-darken must composite against the real backdrop (surface + panel-wash + waves). An isolated wrapper would resolve the blend against a transparent group and leave nine visible white rectangles.
    - Text truncation warning at tablet/mobile is resolved as a side effect - there is no text in the slots any more, so 'DYKSTRA NAVAL ARCHITEC...' and 'NVIDIA INCEPTION PROGR...' are gone.
    - Tagged the panel (182:2961), the waves (183:93) and each backer slot with data-figma-id for next-iteration measurement.

## Iteration 3
- Re-cropped the painted backdrop to Figma's actual 1572x1054 rect offset (raising the horizon ~100px), fixed the drag-CTA chevrons by adopting the real off-centre fi:arrow-up path so the pair opens to 18x10 with an 8px gap, floored the segment items at their drawn 120/124/124 so the track reaches 384px, and gave tablet the spec's centred min(384px,80%) text column and centred segment control.
- Changes:
    - Backdrop crop (largest measured delta: bg 181:538 was 78px right / 243px down / 156px narrower / 278px shorter). Mechanism: the painted sea was rendered as a plain inset-0 `fill` cover of the panel, but Figma draws it as a 1572 x 1054 rect inside the 1416 x 776 panel at -78 / -243 - horizontally centred, yet 104px ABOVE centre. That missing lift is exactly why the water band started at y~550 instead of y~460. Wrapped the image in a crop plate (`.sea` in the-fleet.module.css) whose geometry is stored as percentages of the panel (111.017% / 135.825% at -5.508% / -31.314%), applied from lg only - below the drawn frame the panel is far taller than it is wide, so the Figma rect would overshoot and a plain cover crop reads correctly.
    - Drag-CTA chevron geometry (reviewer: pair measures 12x8 with a 4px gap, reads as a closed diamond, vs Figma's 18x10 with an 8px gap). Mechanism found by pulling Figma 181:546: the real glyph `fi:arrow-up` is `M3.33333 8L8 3.33333L12.6667 8` - its ink sits at y 3.33-8, i.e. 2.33px ABOVE the centre of its 16px box, whereas our icon-chevron.svg carried a vertically centred path. Rotating an off-centre glyph throws its ink to the outer edge of each box, which is what opens the 8px gap; a centred glyph collapses the pair. Corrected src/assets/icons/icon-chevron.svg to the Figma path, regenerated src/components/icons/index.tsx (IconChevron is used only by this section), and swapped the two rotations so the left glyph points left and the right glyph points right, matching Figma's `rotate-90 -scale-y-100` / `-rotate-90 -scale-y-100` pair. Computed result: 17.33px wide, 9.33px tall, 8px gap.
    - Segment control track now reaches its drawn 384 x 40 (measured 340px; Segment Control 38px narrower, Btn 28px / 12px narrower). Mechanism: the items were purely hug-sized, so under the current font fallback the two unselected labels rendered ~109px against the drawn 124px. Added the drawn item widths to the roadmap data as `segmentWidth` (7.5rem / 7.75rem / 7.75rem = 120 / 124 / 124) and applied them as a `md:min-w-[var(--segment-w)]` floor, giving 4 + 120 + 4 + 124 + 4 + 124 + 4 = 384. A floor rather than a fixed width, so it is still correct once Matter loads. Left as hug below md, where 384px does not fit the 342px mobile content box.
    - Tablet (768-991) text column now follows spec Section 3 / Responsive: constrained to `min(384px, 80%)` and centred under the viewer via a `.textColumn` rule scoped to that band, instead of running ~624px full-bleed with the 24%-opacity tail of the lead trailing off over the torn white edge. Scoped with a max-width query because at lg the 384px grid track already sets the measure and an 80% cap there would shrink it.
    - Tablet segment control centred (`md:max-lg:self-center`) - the spec keeps it bottom-centred at 768-1023 and only goes full-width/scrollable below 768; it had been sitting at the panel's 36px gutter.

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
`/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/footer/iter-02/fix-summary.json`

```json
{
  "changesMade": ["short description of each edit you made"],
  "summary": "one sentence on what you changed"
}
```
