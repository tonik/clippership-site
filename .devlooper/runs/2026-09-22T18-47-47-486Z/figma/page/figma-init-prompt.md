# Task: Extract a complete implementation spec from a Figma design

You have the **Figma MCP** connected. Your job: extract a precise, exhaustive
specification of one Figma node so another agent can rebuild it pixel-accurately
in code.

## Target

Figma node: https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=181-498&t=0jpbKeeTIgsBOp2v-4

## Design system — already extracted

The shared design system (colours, typography scale, spacing, components) is
already captured in `DESIGN.md` at `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/DESIGN.md` — read it. Reference its
tokens by name instead of re-deriving the whole palette and type scale. Your
spec covers **this page specifically**: layout, structure, exact content,
responsive behaviour, assets, and which design-system tokens each part uses.

## Human note for this page — address FIRST
hero section interaction:
- https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=181-690&t=0jpbKeeTIgsBOp2v-4
- https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=181-699&t=0jpbKeeTIgsBOp2v-4

specifications - fpo
- https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=182-782&t=0jpbKeeTIgsBOp2v-4
- https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=247-843&t=0jpbKeeTIgsBOp2v-4
- https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=247-877&t=0jpbKeeTIgsBOp2v-4
- https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=247-945&t=0jpbKeeTIgsBOp2v-4
- https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=247-975&t=0jpbKeeTIgsBOp2v-4

## Steps

1. Use the Figma MCP tools to inspect the node. Pull everything available:
   - the design context / structure (layout tree, frames, sections, nesting)
   - a screenshot of the node so you see it visually
   - variable definitions / design tokens
   - **auto-layout properties of every frame** — `layoutMode`
     (NONE / HORIZONTAL / VERTICAL), `itemSpacing`, padding, `primaryAxisAlignItems`,
     `counterAxisAlignItems`, `layoutWrap`, and each child's sizing
     (`layoutGrow` / `layoutAlign` → FILL vs HUG vs FIXED). These are the layout's
     source of truth and map almost 1:1 to CSS flex/grid — always capture them.
   - dimensions and constraints
   - **If the node is large and the context response truncates, do NOT work from a
     partial tree** (a partial read is a top reason a section's structure gets
     guessed — and guessed structure becomes absolute positioning). Instead: call
     `get_metadata` for the high-level node map, identify each section's child node
     IDs, then fetch those children **individually** with `get_design_context`.
     Assemble the full picture before writing the spec.
   - **Fallback — Figma REST API (use when the MCP blocks deep reads).** Some
     Figma MCP servers (notably the hosted/OAuth one) return permission errors or
     refuse the full layout tree, which silently produces an empty spec and — worse —
     **no `sections.json`, so the loop falls back to building the whole page at once
     instead of section-by-section.** If the MCP cannot give you the structure AND
     `FIGMA_TOKEN` is set in the environment, traverse the frame directly over REST
     — it returns the complete node document (children, `layoutMode`, `itemSpacing`,
     `absoluteBoundingBox`, fills, text, etc.), everything you need for both the spec
     and the section index:
     ```bash
     # The target URL is https://www.figma.com/design/A9PHMFuLwB4yZHYR2W020Q/p_clippership--Copy-?node-id=181-498&t=0jpbKeeTIgsBOp2v-4
     #   https://www.figma.com/design/<FILE_KEY>/<name>?node-id=<NODE-ID>&...
     # FILE_KEY = the segment after /design/ (or /file/).
     # NODE_ID  = the node-id query param, converting '-' to ':'  (123-36 → 123:36).
     curl -s -H "$FIGMA_AUTH_HEADER" \
       "https://api.figma.com/v1/files/<FILE_KEY>/nodes?ids=<NODE_ID>&geometry=paths" \
       > /tmp/figma-node.json
     ```
     Parse `/tmp/figma-node.json` (`.nodes["<NODE_ID>"].document` is the frame; its
     `.children` array — in order — are the top-level sections). Derive section names,
     selectors, nodeIds and the `expected` values from this tree. **Never skip
     `sections.json` just because the MCP was limited — REST is the reliable path.**
   - **Skip HIDDEN layers — never put them in the spec.** Ignore every node whose
     `visible` is `false` (and its entire subtree) — for BOTH structure AND the asset
     catalogue. Hidden layers are off-design scaffolding (old variants, disabled states,
     helper layers); rendering them is a fidelity bug (confirmed: hidden icons/images were
     leaking into builds). In REST JSON check each node's `visible` field — absent/`true`
     = visible, `false` = skip. **Caveat — `visible:false` ≠ low contrast:** a faint but
     *visible* element (low opacity, ~5% stroke, full-bleed background line) is NOT hidden;
     keep those (see "Background grid / guide lines" below). Only the explicit `visible:false`
     flag (or `opacity:0`) means skip.
2. Produce a thorough spec covering, top to bottom:
   - **Layout** — every section in order, described as RESPONSIVE FLOW, never as
     coordinates. Figma reports an absolute `x/y` for every node, but the spec MUST
     **translate that geometry into flex/grid relationships** the rebuild can make
     responsive: layout direction (row/column), alignment (justify/align), the
     `gap` between siblings (derive it from the distance between their edges),
     padding, `max-width` of content columns, column counts, and wrap behaviour.
     - **Never write `left:`/`top:` or "absolute-positioned" as the layout method
       for content** (headings, paragraphs, buttons, nav, stats, cards, columns).
       Raw offsets produce a page that is pixel-perfect at one width and broken
       everywhere else. Describe *"centered 1200px content column"*, *"3-column
       grid, 48px gap"*, *"flex row, space-between, wraps to 1 column under 768px"*
       — relationships, not pixel positions.
     - Reserve absolute/overlay language **only** for things that genuinely stack on
       top of another element: a badge pinned to a card corner, a scrim over a hero
       photo, a dropdown, an icon inside a button. Call these out explicitly as
       *overlays* so the rebuild knows they are the rare exception.
     - **Use Figma auto-layout as the blueprint.** A frame whose `layoutMode` is
       HORIZONTAL or VERTICAL *is* a flexbox — translate it directly instead of
       reading coordinates:
       `layoutMode` → `flex-direction` (HORIZONTAL=row, VERTICAL=column) ·
       `itemSpacing` → `gap` · padding → `padding` ·
       `primaryAxisAlignItems` → `justify-content` ·
       `counterAxisAlignItems` → `align-items` · `layoutWrap` → `flex-wrap` ·
       child FILL → `flex:1` / `width:100%`, HUG → `width:fit-content` / auto,
       FIXED → an explicit size only when the element is genuinely fixed.
       A frame whose children are a uniform grid → CSS Grid (`grid-template-columns`,
       `repeat(auto-fit, minmax(...))`). Only where a frame has **no** auto-layout
       (children absolutely placed in Figma) do you infer structure from the visual —
       and even then express it as flex/grid, never as `left:`/`top:`.
   - **Responsive** — describe how each section reflows across desktop / tablet /
     mobile. If the design has multiple frames, replicate each. If only one frame
     exists, infer sensible **flow-based** behaviour (multi-column → fewer columns →
     stacked) using `flex-wrap` or grid `auto-fit`/`minmax` — never by shrinking an
     absolute layout.
   - **Typography** — every distinct text style: font family (exact name as
     it appears in Figma, e.g. "Inter", "Geist", "Plus Jakarta Sans"), size,
     weight, line-height (exact value or ratio, e.g. `1.2` or `48px`),
     letter-spacing (exact value in px or em — even `-0.02em` matters),
     colour, and where each is used. Also note the Google Fonts / CDN URL if
     the font is a web font, so the fixer can load it. Missing letter-spacing
     and wrong line-height are among the most common fidelity gaps.
   - **Colours** — every colour as a hex value, with its role (background, text,
     accent, border, etc.).
   - **Content** — the exact text of every string, in document order. Do not
     paraphrase or summarise — copy it verbatim.
   - **Components** — repeated / reusable elements (buttons, cards, nav items)
     with their variants and states if visible.
   - **Spacing** — concrete pixel values for margins, paddings and gaps.
   - **Assets** — a dedicated, exhaustive catalogue of every image, icon, logo
     and decorative SVG. For each asset you MUST provide:
     - **Exact Figma node ID of the export container** — this is the FRAME or GROUP
       that wraps all the vectors/children of the asset. Do NOT give the ID of an
       individual VECTOR child — Figma exports the whole subtree from the container.
       Example: a logo FRAME `1:1903` that contains GROUP → VECTOR × 5 → export
       the FRAME `1:1903`, not any of the vectors inside it.
       Never write "inside navbar" or "inline in button" — drill into the layer
       tree and provide the numeric node ID (e.g. `1:1903`).
       A missing or vague node ID means the asset cannot be fetched automatically.
     - Type (logo / icon / svg-bg / svg-decorative / raster)
     - Short description
     - Suggested filename (kebab-case with extension)
     - Dimensions (width × height, or viewBox)
     - Any special rendering notes (preserveAspectRatio, overflow, z-index)

     Format the catalogue as a Markdown table with columns:
     `| File | Type | Node ID | Description | Dimensions | Notes |`

     The rebuild step fetches every asset by its node ID — a missed or wrong ID
     means a missing element on the page.

     **Do NOT catalogue a content-bearing UI FRAME as an asset (this is the #1 asset mistake).**
     A frame whose visual is STRUCTURED UI - a diagram or flow (labelled boxes + connector lines,
     e.g. "Seller -> Buyer"), a faux dashboard / app screenshot, a chart or graph with text labels
     and axes, a card mock with copy - must be REBUILT as real HTML/CSS, NOT flattened to a
     `.png`/`.jpg`. Exporting such a frame as a raster ships soft, unselectable, non-responsive,
     un-refinable pixels that the loop cannot fix. So: leave it OUT of the asset catalogue (give it
     no fetchable node ID) and instead document its STRUCTURE in the section spec - every box and
     its exact label/copy, the connector style, the layout (flex/grid), exact colours, borders and
     fonts - so the rebuild recreates it. Only the genuine photographic/textured BACKGROUND behind
     such a frame (if any) is catalogued as a raster.
     - **What IS still an asset (catalogue as normal):** photographs and headshots, logos and icons,
       decorative SVG shapes (blobs, waves, dividers, full-bleed art), textures/gradients, and
       complex illustrations that genuinely cannot be reconstructed from shapes + text.
     - **Tiebreaker when unsure:** look at the visual. Mostly editable text labels, rectangles and
       lines = a diagram/chart = REBUILD (no node ID). A photograph or rendered illustration with no
       editable text/boxes = ASSET (catalogue it). When still unsure, prefer cataloguing it as an
       asset - a wrongly-rebuilt photo is worse than a rasterised diagram.

     **SVG-specific rules** — for every SVG (decorative backgrounds, section
     dividers, full-bleed footer shapes, etc.) document:
     - Whether it spans the full width or full height of its section.
     - Its Figma `viewBox` (the internal coordinate space — e.g. `0 0 1440 320`).
     - The expected rendered dimensions in the design (e.g. `width: 100%, height: 320px`).
     - Whether `preserveAspectRatio` should be `none` (stretch) or `xMidYMid meet/slice`.
     - The container constraints (the parent frame's width/height/overflow).
     A full-bleed SVG that clips in code is one of the most common Figma→code
     gaps — document it explicitly so the fixer can get it right.

   - **Background grid / guide lines** — faint full-bleed lines that run *behind* the
     content (column rulers, section dividers, baseline grid). They are easy to miss and a
     pixel-diff barely registers them (1px, ~5–10% contrast), so they vanish from the build
     unless captured here. **Hunt for them.** In Figma they are almost always **VECTOR nodes
     with a zero dimension** — `width == 0` (a vertical line) or `height == 0` (a horizontal
     line) — carrying a `strokes[]` entry, or thin full-bleed rectangles. Extract each
     deterministically from the node tree:
     - orientation: **H** if `height == 0`, **V** if `width == 0`
     - position: `x` / `y` relative to the section root
     - length: `width` (H) or `height` (V); colour + opacity from `strokes[0]`
     - which column edge / section boundary it is pinned to (e.g. `x == 720` on a 1440 frame → 50%)

     Document them as a section that the rebuild reproduces as a **dedicated absolutely-
     positioned overlay** (`position:absolute; inset:0; pointer-events:none; z-index:0`,
     content above): horizontal lines **full-bleed** (bleed past the container gutter),
     vertical lines **pinned to the column grid** (`left:50%`, `left:calc(50% + Npx)`).
     The overlay must live **inside the same positioning context as the content it sits
     behind** (the section's `position:relative` wrapper), and its vertical anchor must be
     **relative to a content landmark** (e.g. "starts at the headline baseline row"), never
     a fixed `top: Npx` offset — otherwise it drifts the moment the headline reflows between
     breakpoints. List every line — this is structural design scaffolding, not noise.

   - **Other low-contrast / full-bleed decoration the pixel-diff under-weights** — beyond the
     grid above, the same blindness applies to any subtle, large-area, or behind-content element:
     faint hairlines & dividers, near-background borders, baseline grids, `repeating-linear-gradient`
     textures, full-bleed background shapes/blurs, ghost/low-opacity text, watermarks. They cover
     few pixels at low contrast so a diff barely moves — **document each one explicitly** (position,
     size/extent, colour, opacity, full-bleed or contained) so it survives into the build.
     Rule of thumb: *if it's visible in Figma but a pixel-diff would shrug at it, it MUST be in the spec.*

   - **Frame & panel borders (`strokes[]` → CSS `border`) — the single most-missed element.**
     Every container node — section panel, card, chip, table cell, badge, the rounded section
     frames themselves — that carries a `strokes[]` entry has a **border**. Emit it: width from
     `strokeWeight`, colour + opacity from `strokes[0]` — **even at low alpha**
     (`1px solid rgba(223,234,255,0.08)`). The fill and `border-radius` get copied but the 1px
     stroke around the panel is silently dropped, and a pixel-diff won't flag it. So **for every
     panel/section you describe, state its border explicitly** — `background X, border-radius Y,
     border: Wpx solid rgba(...)` — or write "no border". Never leave it unsaid.

   - **Effects** — shadows, borders, radii, gradients, blurs — with exact values.
     Document each with enough detail to implement:
     - **Box shadows**: list every layer (x, y, blur, spread, colour, opacity).
       Figma often stacks 2–4 shadow layers — list all of them.
     - **Gradient text**: if text appears to have a gradient fill (not a flat colour),
       flag it explicitly as "gradient text — requires `background-clip: text;
       -webkit-background-clip: text; color: transparent`" and document the gradient stops.
     - **Glassmorphism / frosted glass**: if a card or panel has a blurred, semi-transparent
       background, document `backdrop-filter: blur(Xpx)` and the background rgba value.
     - **Hover states**: if the design shows a hover/active variant of a card, button,
       or link, document both states so the fixer can add CSS transitions.
     - **Image constraints**: if an image area has a fixed aspect ratio in Figma, document
       it — the fixer needs `aspect-ratio` + `object-fit: cover` to match.

   - **Animation signals** — look explicitly for these patterns and document each one:
     - **Ghost / faded text** — a text element with low opacity (< 40%) or a colour close
       to the background sitting next to or overlapping normal-weight text. This is the
       standard Figma convention for a *rotating/typewriter text* animation. Document:
       the full-opacity anchor text, the faded variant text(s), and the implied cycling
       list (e.g. layer names like "Tesla | Bosch | Overstock" or sibling frames).
     - **Layer naming hints** — layer names containing keywords like `[cycle]`, `[rotate]`,
       `[typewriter]`, `[animate]`, `[marquee]`, `[ticker]`, `[loop]`, `[slide]`,
       `state-1 / state-2` variants. Copy the layer name verbatim into the spec.
     - **Component variants** — if a component has named variants (e.g. "Word=Tesla",
       "Word=Bosch", "Word=Overstock"), list all variant values — they define the
       cycling set.
     - **Counter / stat numbers** — large standalone numbers (e.g. "2,400+", "98%") in
       a stats section. These commonly count up on scroll. Flag them.
     - **Progress bars / loaders** — any bar element at a partial fill (e.g. 60% width).
       Flag as "likely animated to fill on scroll or load".
     - **Marquee / ticker rows** — a row of logos or text items that appears to extend
       beyond the frame edge. Flag as "likely infinite-scroll marquee".
     If NONE of these signals are present, write: `Animation signals: none detected.`

## Output

Write the full spec as Markdown to **this exact path**:

/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/spec.md

Be exhaustive and concrete. Prefer exact numbers over adjectives. This file is
the single source of truth for the rebuild loop, so nothing visual should be
left undocumented.

### This document ships with the code

The spec is copied into the project as `docs/pages/<page>.md` and handed over with the
site, so it is read by the client's developers and by whoever picks the page up in a
year. Write it as a document about THIS SITE, not about the process that produced it.

- **Name no tooling.** Not the pipeline that is running you, not the loop, the fixer, the
  judge, the editor, any agent, any model, any vendor. "The build", "this project" and
  "the design" say the same thing and stay true after handover. Breakpoints belong to the
  design, not to a tool: write "the design's frames are 1440 / 768 / 390".
- **No absolute paths.** Every path relative to the project root - `src/app/page.tsx`, not
  `/Users/someone/Documents/.../src/app/page.tsx`. An absolute path is wrong on every
  machine but one, and it carries a directory tree nobody outside needs to see.
- **Do not describe the run.** "Re-extracted this run", "iteration 3 fixed this", "the
  judge scored it 87" are notes to ourselves. What belongs here is the decision and why,
  not the sequence of attempts that reached it.

This is not cosmetic. Handover refuses to ship a repo that names the tooling, so a spec
that mentions it is a spec that gets left behind - and the reasoning it holds is the
reason it is being kept at all.


## Section index — machine-readable (for per-section build & verification)

Also write a JSON array to **this exact path**: `/Users/arturgrzeda/Documents/Devlooper/clippership/.devlooper/runs/2026-09-22T18-47-47-486Z/figma/page/sections.json`

**This file is MANDATORY — it is not optional.** Without it the loop cannot build
section-by-section and silently rebuilds the entire page in one shot (lower fidelity,
no per-section regression protection). If the Figma MCP could not give you the layout
tree, use the REST fallback above to derive the sections — but always write this file
with at least the page's real top-level sections.

**EVERY entry MUST have a real, non-null `name`, `selector`, and `nodeId` — null /
empty / placeholder entries are a FAILURE.** You already named every section in the
spec above (the `## Section N — <Name>` headings); the `sections.json` entries MUST
mirror those one-to-one, in the same order. Do NOT emit a list of empty objects to
"satisfy the count": an entry whose `name` or `selector` is null is worse than useless —
it makes the loop screenshot the WHOLE page for that section (no scoping) and breaks the
section tree / per-section build. Derive each `name` (kebab-case) straight from its spec
heading; if you wrote the section in the spec, you know its name.

List the page's top-level sections **in layout order**. For each, give a **stable
selector** the rebuild MUST apply to that section's root element. **Prefer a
`[data-section="<name>"]` selector** (the rebuild stamps `data-section="<name>"` on the
section root — deterministic regardless of class naming); a kebab-case class
(`class="hero"` → `.hero`) is acceptable too. The loop builds and verifies the page **one
section at a time**, scoping screenshots and measurement to these selectors — so the
selectors must be unique and match what gets built.

```json
[
  {
    "name": "hero",
    "selector": "[data-section=\"hero\"]",
    "nodeId": "1:120",
    "summary": "Headline, subcopy, primary CTA, product shot on the right",
    "expected": { "h1FontSize": "48px", "h1FontWeight": 700, "ctaBg": "#156AFF", "paddingTop": "96px" }
  }
]
```

- `name` — REQUIRED, kebab-case, taken from this section's spec heading. Never null.
- `selector` — REQUIRED, unique, the rebuild applies it verbatim (stamps
  `data-section="<name>"` on the section root). Never null.
- `nodeId` — REQUIRED, the Figma node for this section (so its reference can be cached
  once + the geometry channel can slice it). Pull it from the layout tree / REST. Never null.
- `expected` — **optional but valuable**: a few exact, high-signal values for this
  section (heading size/weight, key colour, section padding) pulled straight from
  Figma. These feed a deterministic expected-vs-actual measurement check. Use the
  exact token values — never approximate.

**Before you finish: re-read the `sections.json` you wrote. If ANY entry has a null or
empty `name`, `selector`, or `nodeId`, you have NOT completed the task — go back, pull
the value from the spec heading / the Figma layout tree, and rewrite the file.** One real
section per spec `## Section` heading, same order, every field populated.

If the node is a single component (not a full page), emit one entry for it.
