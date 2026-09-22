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

## Iteration 1 of 8

## Measurement deltas — the primary gate (computed CSS vs design tokens)

## Measurement check — computed CSS vs design tokens (deterministic, the primary gate)

> These are HARD numeric deltas measured from the live DOM. Fix the largest first.
> Snap off-token values to the nearest design token; never introduce arbitrary values
> (e.g. `font-size: 15px` / `leading-[22.126px]`) — use the token scale.

### 🔴 Arbitrary values (snap to token scale)
- gap 56px — nearest token 48px (Δ8px) — arbitrary value, snap to the token scale
- row-gap 56px — nearest token 48px (Δ8px) — arbitrary value, snap to the token scale
- column-gap 56px — nearest token 48px (Δ8px) — arbitrary value, snap to the token scale

### ℹ️ Minor (info)
- padding-right 20px — nearest token 16px (Δ4px)
- padding-left 20px — nearest token 16px (Δ4px)

Fix arbitrary values and ⚠️ off-token values first — they are the measurement gate. Info items are optional.

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

Section frame: 1440×800

LAYOUT — build these containers as flexbox (exact, from Figma auto-layout):
- CTA (FRAME) [181:546]: flex row, gap -8, padding 12 20 12 20, justify center, align center, sizing fixed/fixed
- Segment Control (FRAME) [181:549]: flex row, gap 4, padding 12 4 12 4, align center, sizing hug/fixed
- Btn (FRAME) [181:550]: flex row, gap 10, padding 8 16 8 16, justify center, align center, sizing hug/hug
- Btn (FRAME) [181:552]: flex row, gap 10, padding 8 16 8 16, justify center, align center, sizing hug/hug
- Btn (FRAME) [181:554]: flex row, gap 10, padding 8 16 8 16, justify center, align center, sizing hug/hug
- Header (FRAME) [181:556]: flex column, gap 16, sizing fixed/hug
- Text (FRAME) [181:559]: flex column, gap 56, sizing fixed/hug
- CTA (FRAME) [181:561]: flex row, gap 24, padding 12 20 12 20, align center, sizing hug/fixed

STYLING — exact values (match these; placement follows from layout + the screenshot):
- The fleet (FRAME) [181:535]: border radius 12
- mask (RECTANGLE) [181:537]: background: image fill, object-fit cover
- bg (RECTANGLE) [181:538]: background: image fill, object-fit cover; opacity 0.64
- Rectangle 6 (RECTANGLE) [181:539]: background: radial-gradient(at 0% 0%, rgba(246,246,247,0.64) 0%, rgba(246,246,247,0.00) 100%)
- Vessel Silhouette Render 1 1 (RECTANGLE) [181:540]: background: image fill, object-fit cover
- CTA (FRAME) [181:546]: border radius 20
- Segment Control (FRAME) [181:549]: border radius 40; backdrop-blur 8
- Btn (FRAME) [181:550]: border radius 32
- "October 2026" [181:551]: Matter-Medium 14/500 lh 16 ls -0.28 align center color #ffffff
- Btn (FRAME) [181:552]: border radius 32
- "Mid-2027" [181:553]: Matter-SemiBold 14/600 lh 16 ls -0.28 align center color #191919; opacity 0.64
- Btn (FRAME) [181:554]: border radius 32
- "This decade" [181:555]: Matter-SemiBold 14/600 lh 16 ls -0.28 align center color #191919; opacity 0.64
- "the roadmap" [181:557]: OverpassMono-Bold 12/700 lh 12 ls 0.12 UPPERCASE color #191919; opacity 0.6
- "One architecture, three scales" [181:558]: Exposure-20 80/450 lh 80 ls -3.2 color #291d1d
- "Our roadmap starts with maritime edge co" [181:560]: ArticulatCF-Regular 24/400 lh 28 ls -0.96 color #191919
- CTA (FRAME) [181:561]: border 1px rgba(25,25,25,0.08) radius 20
- "Specifications" [181:562]: Matter-SemiBold 14/600 lh 16 ls -0.28 color #191919

(8 of 26 elements use auto-layout. This is a RESPONSIVE build: use flexbox/flow; absolute-position ONLY the overlays above. Where a region has no auto-layout, infer the flow from the screenshot — never pin by coordinates.)

Deterministic position deltas vs Figma (build − Figma, 6/26 elements matched, scale 1). Largest first — close these:
- "Mid-2027": 503px right, 8px up, 4px wider, 16px taller.
- "October 2026": 501px right, 8px up, 34px wider, 16px taller.
- "This decade": 475px right, 8px up, 20px wider, 16px taller.
- "Specifications": 366px left, 12px up, 46px wider, 24px taller.
- "the roadmap": 46px narrower.
- "One architecture, three scales": 46px narrower.

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

- desktop (1440x900): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/the-fleet/iter-01/current-desktop.png
- tablet (768x1024): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/the-fleet/iter-01/current-tablet.png
- mobile (390x844): /Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/the-fleet/iter-01/current-mobile.png

**Read each PNG file.**

The Figma node and these screenshots may scope a whole page **or a single
section** — fix exactly that scope.

## Reviewer's verdict — overall score 52/100

Issues to fix (critical first, then warnings — `info` items are excluded, do not chase them):

### desktop — score 52
  - [CRITICAL] Lead + CTA column is in the wrong place: spec §3 puts .fleet__text at `right: 36px; width: 384px` (x 1008-1392, vertically centred). Measured build: the lead paragraph ink runs x 663-1014, i.e. the whole column sits ~345px too far left, roughly on the panel centre instead of flush right. The `lg:grid-cols-[minmax(0,660px)_minmax(0,1fr)_minmax(0,384px)]` / `lg:col-start-3` placement is not resolving to the third track.
  - [CRITICAL] Segment control is right-aligned instead of centred: spec §3 is `bottom: 36px; left: 50%; translateX(-50%)` (track centre x = 720). Measured build: track ink x 1050-1370, right edge flush to the 36px content edge, centre ≈1210 - about 490px right of the design position. Vertical position (track box ~712-752) is correct.
  - [CRITICAL] Lead paragraph collides with the 3D navigator: because the text column sits at panel centre, line 3 (`of 3MW vessels for AI inference`, y≈370-392) runs straight through the 40px white drag-CTA circle (centre 720/399) and across the right arc of the orbit ring. In the design the navigator sits in clear space between the 660px header column and the 384px text column.
  - [CRITICAL] Full-bleed painted backdrop missing: spec §3 stacks `fleet-sky.png` (1697x1358, object-fit cover) under `fleet-backdrop.png` (1572x1054 @ opacity 0.64) inside .panel__bg. The build renders a flat `photo-placeholder` div instead, so the panel is an almost-uniform light grey. Asset fetch failed on the Figma REST rate limit (see figma/page/asset-fetch-summary.json) - the component already carries the TODO, so this is an asset blocker, not a code defect.
  - [CRITICAL] Vessel render missing: `vessel-silhouette.png` (181:540, 400x400 grey 3D model, centre 720/399) is the focal element of the section and is absent - the panel centre is empty apart from the orbit ring and drag CTA. Same rate-limited asset fetch; TODO is present in the code.

### tablet — score 76
  - [WARNING] Segment control track stretches the full panel width (x 49-719) while its three pills only occupy the first ~340px, leaving half the frosted track empty on the right. The track should hug its items (w-fit) rather than stretch - as drawn it reads as an unfinished component.
  - [WARNING] ~440px of empty panel between the headline (ends y≈113) and the lead (starts y≈602), because the missing vessel render leaves the centred viewer stack with nothing but the orbit ring and the 40px drag CTA. Resolves once vessel-silhouette.png is available; no code change to make in the meantime.

### mobile — score 64
  - [WARNING] Third segment label is clipped mid-word: `This decade` renders as `This decad`, cut at x 352 against the 354px content edge. The track is an overflow-x-auto scroller so the content is reachable by swiping, but there is no scroll affordance and a truncated word reads as a bug. Let the track wrap, shrink the horizontal padding, or add a visible edge fade at this width.
  - [WARNING] Orbit ring is hard-sized `w-[480px] max-w-none` while the panel content is only 342px wide, so both arcs are sliced off by the panel's overflow and render as two disconnected line stubs touching the left and right edges (y≈258-340). Scale the ring with the viewer box (it already uses `size-[min(400px,62vw)]`) so the arcs stay inside the panel.
  - [WARNING] ~336px of dead space between the headline (ends y≈126) and the lead (starts y≈462) - the centred viewer column is empty without the vessel render. Asset blocker, same as desktop/tablet.



## CSS token audit (deterministic scan)

## CSS token audit

No violations found. ✅




## What earlier iterations changed

_First iteration — nothing changed yet._

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
`/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/page/the-fleet/iter-01/fix-summary.json`

```json
{
  "changesMade": ["short description of each edit you made"],
  "summary": "one sentence on what you changed"
}
```
