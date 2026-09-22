# Clippership - Index (home page)

Implementation spec for the single marketing page of **Clippership**, an AI-compute
company that puts datacentre capacity on autonomous sail freighters.

- **Design source:** Figma file `A9PHMFuLwB4yZHYR2W020Q`, frame `181:498` (`Index - 2.2`).
- **Design system:** see `DESIGN.md`. Token names below (`ink`, `display-xl`,
  `border-hairline`, …) refer to that document; this spec does not restate the palette
  or the type scale, only which token each part uses and the page-specific values that
  are not in the system.
- **Canvas:** 1440 × 3708. Five sections, stacked in a vertical flow with **no gap
  between them** (each section supplies its own padding).

---

## 0. Page shell and grid

The page root is a vertical flex column, `width: 100%`, background `surface` (`#FFFFFF`),
children in document order: Hero, How It Works, The Fleet, About, Footer. There is **no
navigation bar** - the wordmark sits inside the hero headline block and again in the
footer.

### The 48px rule

Every section's content begins **48px from the viewport edge**, reached two different ways:

- **Panel sections** (Hero, How It Works, The Fleet, Footer) inset a rounded panel `12px`
  from each edge, then pad `36px` inside it. `12 + 36 = 48`.
- **Bare sections** (About) have no panel and simply use a `48px` gutter.

Content width is therefore **1344px** on a 1440 canvas.

### The column grid

1344px divides exactly into **12 columns of 90px with 24px gutters**
(`12 × 90 + 11 × 24 = 1344`). The About section lands on this grid precisely; the other
sections use free-standing column widths inside the same 1344px measure.

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 24px;
}
```

### Breakpoints

The file contains **one frame only (1440)**. The responsive rules in this document are
therefore design intent for the build, not extracted frames. Targets: **1440 / 1024 /
768 / 390**. Every section reflows with flex/grid - nothing is laid out by fixed offsets,
and nothing is achieved by scaling a desktop layout down.

Fluid type: headline sizes below are given as `clamp()` so the display serif keeps its
proportion to the measure rather than stepping at breakpoints.

---

## Section 1 - Hero

**Node `181:499`** · 1440 × 1280 · `layoutMode: VERTICAL`, `padding: 0 12px`,
background `surface`, `overflow: hidden`.

A single full-bleed image stage with two content blocks floating over it: a centred
title at the top and a right-hand lead + CTA at mid-height.

### Structure

```
section.hero                     (1440 × 1280, padding 0 12px, overflow hidden)
└── .hero__stage   181:500       (1416 × 1280, radius 0 0 12px 12px, overflow hidden, position: relative)
    ├── img  181:671             sky painting   - background layer   (overlay)
    ├── img  247:655             vessel render  - foreground layer   (overlay)
    ├── .hero__title  181:505    (flex column, gap -12px, align/justify center)
    │   ├── .hero__wordmark 235:424   157 × 28
    │   └── h1 181:507                108px display, centred
    └── .hero__lead   181:502    (flex column, gap 24px, padding-right 48px)
        ├── p  181:503                383px measure
        └── a.btn  181:708            glass pill, 174 × 40
```

### Layout (flow, not offsets)

The stage is `position: relative`. The two image layers are genuine **overlays**
(`position: absolute`), everything else is normal flow:

```css
.hero__stage {
  position: relative;
  aspect-ratio: 1440 / 1280; /* 1416 wide at 1440 viewport */
  border-radius: 0 0 12px 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.hero__title {
  /* centred content column */
  align-self: center;
  width: min(1002px, 100%);
  margin-top: 148px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: -12px; /* negative: tucks the wordmark into the cap-height */
}
.hero__lead {
  align-self: flex-end;
  width: 431px; /* 383px measure + 48px right padding */
  padding-right: 48px;
  margin-top: 96px; /* title block bottom → lead top */
  margin-right: 36px; /* panel padding */
  display: flex;
  flex-direction: column;
  gap: 24px;
}
```

Derived spacing: title top `148px`; title block is `232px` tall (28px wordmark − 12px
overlap + 216px headline); lead block starts `96px` below it; lead block is `176px`
tall, leaving `628px` of open vessel imagery beneath it. That deep bottom margin is the
point of the section - do not shrink it.

**Negative gap:** the `-12px` between wordmark and headline is an optical correction that
drops the wordmark into the headline's ascender space. Keep it. In CSS use
`margin-bottom: -12px` on the wordmark rather than a negative `gap` (which is invalid).

### Content

| Element  | Text                                                                                                                                                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Wordmark | `clippership` (image-mask asset, not live text)                                                                                                                                                                              |
| `h1`     | `AI compute at the maritime edge.` - the space between **the** and **maritime** is a **non-breaking space (U+00A0)**; it forces the two-line break `AI compute at` / `the maritime edge.` Preserve it (`the&nbsp;maritime`). |
| Lead     | `Autonomous vessels take AI compute onto the wide-open ocean, where clean energy and cooling are plentiful, and the red tape is thin.` - also contains a NBSP between **the** and **wide-open**.                             |
| CTA      | `Read the white paper`                                                                                                                                                                                                       |

### Typography

| Element           | Token        | Exact values                                                                                                          |
| ----------------- | ------------ | --------------------------------------------------------------------------------------------------------------------- |
| `h1` 181:507      | `display-xl` | Exposure (`Exposure-20`) 450 · `108px` / `108px` (1.0) · `-4.32px` (−0.04em) · `text-align: center` · `ink` `#291D1D` |
| Lead 181:503      | `lead`       | Matter Medium 500 · `24px` / `28.32px` (1.18) · `-0.96px` (−0.04em) · see split colour below                          |
| CTA label 181:709 | `label`      | Matter SemiBold 600 · `14px` / `16px` · `-0.28px` (−0.02em) · `#191919` @ 64%                                         |

**Split-opacity lead (animation signal - see §6).** The paragraph is one text node with
two colour runs:

- chars 0-19 - `Autonomous vessels ` - `#191919` at **100%**
- chars 19-132 - `take AI compute onto the wide-open ocean, where clean energy and cooling are plentiful, and the red tape is thin.` - `#191919` at **48%** (`text-quiet`)

### Colours

| Role                 | Value                                                     |
| -------------------- | --------------------------------------------------------- |
| Section background   | `surface` `#FFFFFF` (only visible behind the 12px gutter) |
| Headline + wordmark  | `ink` `#291D1D`                                           |
| Lead, emphasised run | `text-strong` `#191919`                                   |
| Lead, remainder      | `text-quiet` `#1919197A` (48%)                            |
| CTA fill             | `glass-light` `#F6F6F7` @ 16%                             |
| CTA border           | `border-hairline` `rgba(25,25,25,0.08)`, 1px inside       |
| CTA label            | `text-secondary` `#191919A3` (64%)                        |

### Image layers (overlays)

Both are `position: absolute` - the only absolute positioning in this section.

| Layer         | Node      | Natural size | Placement                                                                                                                                                                                                     |
| ------------- | --------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sky painting  | `181:671` | 2279 × 1607  | centred both axes, `object-fit: cover`; at 1440 it sits at `-420px, -72px` relative to the stage, i.e. **overscaled ~1.6×** so the brushwork reads at full grain                                              |
| Vessel render | `247:655` | 2252 × 1588  | **bottom-anchored**, horizontally centred (`-267px` at 1440), `object-fit: cover`, `object-position: center bottom`. Two image fills are composited in this one node - export it as a single flattened asset. |

```css
.hero__stage > img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
.hero__sky {
  object-position: center center;
}
.hero__vessel {
  object-position: center bottom;
}
```

### Effects

- CTA pill: `background: rgba(246,246,247,0.16)`, `backdrop-filter: blur(4px)`,
  `border: 1px solid rgba(25,25,25,0.08)`, `border-radius: 999px`, height `40px`,
  padding `12px 20px`.
- Stage: `border-radius: 0 0 12px 12px` - **top corners square, bottom corners rounded.**
- **No border on the stage** and no shadow anywhere.

### Responsive

| Width     | Behaviour                                                                                                                                                                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ≥ 1280    | As above.                                                                                                                                                                                                                                                          |
| 1024-1279 | Stage keeps `aspect-ratio: 9/8`. `h1` → `clamp(64px, 7.5vw, 108px)`. Title `margin-top: 11.5vw`. Lead column `width: min(431px, 40vw)`.                                                                                                                            |
| 768-1023  | Lead column moves out of the right gutter and becomes `align-self: center; width: min(431px, 72vw); text-align: left`, sitting under the title with `margin-top: 64px`.                                                                                            |
| < 768     | Stage `aspect-ratio: 3/4`, `min-height: 620px`. Title `margin-top: 72px`, `h1` → `clamp(40px, 12vw, 64px)`. Lead `width: calc(100% - 48px)`, `align-self: center`, `padding-right: 0`. Vessel stays `object-position: center bottom` so the hulls remain in frame. |

### Hero scroll interaction

Two additional frames in the file document the hero as a **scroll-driven sequence**
(`181:690` = state A, `181:699` = state B). Build it as one scroll-linked timeline over
the hero's own height.

| Property                    | State A (rest)           | State B (scrolled)                                          |
| --------------------------- | ------------------------ | ----------------------------------------------------------- |
| Vessel layer `y`            | `0`                      | `-461px` (image translates up ≈ 0.58 × stage height)        |
| Title block `y`             | `148px`                  | `48px` (rises 100px)                                        |
| Title opacity               | `1`                      | `0.6`                                                       |
| Title blur                  | none                     | `filter: blur(8px)` (Figma `LAYER_BLUR` 8)                  |
| **Foreground vessel plate** | absent                   | `247:680` - a second vessel image drawn **above** the title |
| Lead colour                 | `#191919` @ 48%          | `#191919` @ **100%**                                        |
| Lead block `y`              | `476px`                  | `380px`                                                     |
| CTA fill                    | `rgba(246,246,247,0.16)` | `rgba(246,246,247,0.32)`                                    |
| CTA label                   | `#191919` @ 64%          | `#191919` @ **100%**                                        |

The effect: as the hero scrolls, the vessel rises, the display headline recedes (fades to
60% and blurs), the **masts pass in front of the headline** via the foreground plate, and
the right-hand paragraph resolves from ghosted to full contrast.

Implementation: a `position: sticky` stage with a scroll-linked progress value `p` (0→1)
across roughly one viewport of scroll. Z-order bottom→top: sky, vessel-back, title,
vessel-front, lead. The foreground plate `247:680` is a transparent PNG containing only
the masts/hull, so at `p = 0` it sits at the same `-461px` offset as the back plate and
simply moves with it. Interpolate every row of the table above linearly on `p` with
`--ease-fluid`. Under `prefers-reduced-motion: reduce`, render state A statically and
skip the foreground plate.

---

## Section 2 - How It Works

**Node `181:508`** · 1440 × 428 · `layoutMode: VERTICAL`, `padding: 12px`,
background `surface`, `overflow: hidden`.

A single **horizontally overflowing strip of five photographs**. There is no heading, no
eyebrow and no body copy in this section - the figure chips are the only text.

### Structure and layout

```
section.how-it-works              (padding 12px, overflow hidden)
└── .strip  181:764               (flex row, gap 24px, align-items center, width 2232px)
    └── figure.tile × 5
```

```css
.strip {
  display: flex;
  gap: 24px;
  align-items: center;
  width: max-content;
}
.tile {
  position: relative;
  flex: 0 0 auto;
  height: 404px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ececec;
}
```

Tile widths in order: **546, 320, 404, 320, 546** - all `404px` tall.
`546 + 320 + 404 + 320 + 546 + (4 × 24) = 2232px` inside a 1416px viewport, so the strip
**overflows 816px to the right and is clipped by the section**. This is deliberate
(see §6). Do not let it wrap into a grid.

### Tiles

Each tile crops an oversized image. Use `object-fit: cover` with the explicit
`object-position` below rather than fitting the image to the frame.

| #   | Node                | Image node | Natural size | `object-position` | Chip     | Subject                                           |
| --- | ------------------- | ---------- | ------------ | ----------------- | -------- | ------------------------------------------------- |
| 1   | `181:726` (546×404) | `247:662`  | 729 × 423    | `-13px 0`         | `fig.01` | Vessel at sea below the Golden Gate Bridge        |
| 2   | `181:765` (320×404) | `235:614`  | 408 × 544    | `-44px -70px`     | `fig.02` | Operator at a laptop on deck, branded sail behind |
| 3   | `235:616` (404×404) | `235:629`  | 538 × 404    | `4px 0`           | `fig.03` | Hull section under construction in a hangar       |
| 4   | `235:622` (320×404) | `235:627`  | 492 × 656    | `-79px -101px`    | `fig.02` | Vessel on a travel-lift at a marina dock          |
| 5   | `247:657` (546×404) | `247:658`  | 837 × 1116   | `-291px -363px`   | `fig.05` | Vessel under sail in open ocean, monochrome       |

**Content note - verbatim:** the chips read `fig.01`, `fig.02`, `fig.03`, `fig.02`,
`fig.05`. Tile 4 repeats `fig.02` and `fig.04` is skipped. Reproduce exactly as drawn.

### Figure chip

Component `figure-chip`. An **overlay** pinned to each tile's top-left corner.

```css
.tile__chip {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 32px 32px 24px;
  background: radial-gradient(
    farthest-side at 0% 0%,
    rgba(43, 38, 38, 0.8) 0%,
    rgba(43, 38, 38, 0) 100%
  );
  opacity: 0.64;
  pointer-events: none;
}
.tile__chip span {
  /* caption-mono */
  font:
    700 8px/1 "Overpass Mono",
    ui-monospace,
    monospace;
  letter-spacing: 0.08px;
  text-transform: uppercase;
  color: #ffffff;
}
```

Chip frame is `86 × 64`; the gradient is a radial from the top-left corner, so the scrim
fades out diagonally and the label never sits on a hard box.

### Borders

Every tile carries **two 1px inside strokes**: `#FFFFFF` under `rgba(25,25,25,0.08)`.
Composited that is a solid **`#ECECEC`** hairline. Either write it as
`border: 1px solid #ECECEC`, or keep the system's two-layer recipe from `DESIGN.md`:

```css
box-shadow:
  inset 0 0 0 1px #fff,
  inset 0 0 0 1px rgb(25 25 25 / 0.08);
```

The white under-ring is what separates a tile from dark photography; do not drop it on
the tiles that sit over dark imagery.

### Responsive

| Width | Behaviour                                                                                                                                                                                                                                                               |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ≥ 768 | Strip as drawn: fixed tile widths, 24px gap, overflows and clips.                                                                                                                                                                                                       |
| < 768 | Same strip, but make it a real scroller: `overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch`, tiles `scroll-snap-align: start`, heights scale to `min(404px, 62vw)` with widths held to the same ratios. Section padding stays `12px`. |

---

## Section 3 - The Fleet

**Node `181:534`** · 1440 × 800 · background `surface`, `overflow: hidden`.

A `section-panel` carrying full-bleed painted imagery, a 3D vessel viewer centred in the
panel, a headline top-left, a lead + CTA right, and a segment control along the bottom.

### Structure

```
section.the-fleet                  (1440 × 800)
└── .panel  181:535                (1416 × 776, inset 12px, radius 12px, overflow hidden, position: relative)
    ├── .panel__bg  181:536        overlay stack (3 layers)
    ├── .fleet__viewer             overlay, centred: vessel + orbit ring + drag CTA
    ├── .fleet__header  181:556    top-left, 660px
    ├── .fleet__text    181:559    right, 384px, vertically centred
    └── .fleet__segments 181:549   bottom, centred
```

### Panel

```css
.panel {
  position: relative;
  margin: 12px;
  border-radius: 12px;
  background: rgba(229, 228, 230, 0.32); /* panel-wash */
  overflow: hidden;
  /* no border */
}
```

**The panel has no stroke.** Its edge is defined by the fill against white.

### Background stack (overlays, `z-index: 0`)

Three absolutely-positioned layers inside `.panel__bg` (`inset: 0; overflow: hidden`):

1. **`181:537` "mask"** - painted sky/sea, natural `1697 × 1358`, `object-fit: cover`,
   centred (at 1440 it sits at `-62px, -373px`). Carries a Figma `TEXTURE` effect,
   radius 8 - reproduce as a tiling **noise/grain overlay** at low opacity. Without it the
   large flat washes band visibly.
2. **`181:538` "bg"** - secondary painted backdrop, natural `1572 × 1054`,
   **`opacity: 0.64`**, `object-fit: cover`, centred.
3. **`181:539` radial wash** - full panel, no image:
   ```css
   background: radial-gradient(
     at 0% 0%,
     rgba(246, 246, 247, 0.64) 0%,
     rgba(246, 246, 247, 0) 100%
   );
   ```
   Figma handles `[0,0] → [1.01,1.019] → [-1.019,3.361]`, i.e. an ellipse anchored at the
   panel's **top-left corner**, wider than tall, fading to transparent. This is what keeps
   the headline legible over the sky.

### The 3D navigator (centred overlay)

Three stacked overlays, all centred on the panel's centre point (`50% / 50%`):

| Part          | Node      | Size      | Detail                                                                                      |
| ------------- | --------- | --------- | ------------------------------------------------------------------------------------------- |
| Vessel render | `181:540` | 400 × 400 | Grey 3D model, `object-fit: cover`. Centre `x = 720`, centre `y = 399`.                     |
| Orbit ring    | `181:541` | 480 × 144 | See below.                                                                                  |
| Drag CTA      | `181:546` | 40 × 40   | White circle, `border-radius: 999px`, `background: #FFFFFF`. Centre = panel centre exactly. |

**Orbit ring - low-contrast decoration, easy to lose.** An ellipse `480 × 92` with a
**1px `#191919` stroke at `opacity: 0.12`**, centred on the CTA. It is **masked by a
subtract shape** so only its outer ends show: the mask is a `480 × 144` rectangle minus a
`294 × 144` rectangle centred in it, leaving **two 93px-wide windows** at the left and
right ends. The result is two faint arcs flanking the vessel, reading as a turntable the
hull passes through. Build it as inline SVG:

```html
<svg width="480" height="144" viewBox="0 0 480 144" aria-hidden="true">
  <defs>
    <mask id="orbit">
      <rect width="480" height="144" fill="#fff" />
      <rect x="93" width="294" height="144" fill="#000" />
    </mask>
  </defs>
  <ellipse
    cx="240"
    cy="72"
    rx="239.5"
    ry="45.5"
    fill="none"
    stroke="#191919"
    stroke-width="1"
    opacity="0.12"
    mask="url(#orbit)"
  />
</svg>
```

A pixel diff will not register this ring. It is structural: without it the vessel floats
with no spatial cue.

**Drag CTA glyphs.** Two `16 × 16` chevrons inside the 40px circle, laid out as a flex row
with **`gap: -8px`** (they overlap by 8px) and `padding: 12px 20px`. One is rotated
`-90°`, one `+90°`, producing a `‹ ›` horizontal-drag cue. Each glyph is a `9.33 × 4.67`
path with a **1px `#191919` stroke, centre-aligned**. Keep the negative gap - it is what
makes the pair read as one control.

### Header (top-left)

```css
.fleet__header {
  position: absolute;
  top: 36px;
  left: 36px; /* = 48px from the viewport edge */
  width: min(660px, 50%);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
```

| Element  | Node      | Text                             | Type                                                                                                              |
| -------- | --------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Eyebrow  | `181:557` | `the roadmap`                    | `eyebrow` - Overpass Mono Bold `12px` / `12px`, `+0.12px` (+0.01em), **uppercase**, `#191919` @ **60%**           |
| Headline | `181:558` | `One architecture, three scales` | `display-lg` - Exposure 450 `80px` / `80px` (1.0), `-3.2px` (−0.04em), `ink` `#291D1D`, wraps to 2 lines at 660px |

### Text column (right, vertically centred)

```css
.fleet__text {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 36px;
  width: 384px;
  display: flex;
  flex-direction: column;
  gap: 56px;
}
```

| Element | Node      | Detail                                                                                                                                                                                                                                                                                                                                                                                              |
| ------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lead    | `181:560` | `Our roadmap starts with maritime edge compute and scales to fleets of 3MW vessels for AI inference` - `lead` token, Matter Medium 500 `24px` / `28.32px`, `-0.96px`. **Split opacity:** chars 0-46 (`Our roadmap starts with maritime edge compute `) at `#191919` **100%**; chars 46-98 (`and scales to fleets of 3MW vessels for AI inference`) at `#191919` **24%**. Animation signal - see §6. |
| CTA     | `181:561` | `Specifications` - `button-solid`: `background: #F6F6F7`, `border: 1px solid rgba(25,25,25,0.08)`, `border-radius: 999px`, height `40px`, padding `12px 20px`, label `label` token in `#191919`. Opens the Specifications overlay.                                                                                                                                                                  |

### Segment control (bottom, centred)

```css
.fleet__segments {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  height: 40px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.4); /* glass-white */
  backdrop-filter: blur(8px);
}
.fleet__segments button {
  height: 32px;
  padding: 8px 16px;
  border-radius: 999px;
  font:
    600 14px/16px "Matter",
    sans-serif;
  letter-spacing: -0.28px;
  color: #191919;
  opacity: 0.64;
  background: transparent;
}
.fleet__segments button[aria-selected="true"] {
  background: #191919;
  color: #ffffff;
  font-weight: 500;
  opacity: 1;
}
```

Track `384 × 40`. Items: **`October 2026`** (selected, 120 × 32), **`Mid-2027`**
(124 × 32), **`This decade`** (124 × 32).

The selected item uses `label-active` (Matter **Medium 500**) in white; unselected use
`label` (Matter **SemiBold 600**) in `#191919` at 64%. Animate the black pill **sliding**
between positions at `base` (360ms) with `--ease-fluid`; cross-fade the labels. Do not
fade two pills in and out.

### The Specifications overlay

Triggered by the `Specifications` CTA. Documented in Figma as three placeholder frames,
one per roadmap state (`182:782`, `247:877`, `247:975`). It is a **dark panel that covers
the right-hand two-thirds of the fleet panel**, not a separate page section - build it
inside the fleet section's DOM.

**Placement:** `912 × 752`, offset `504px` from the section's left edge and `24px` from
its top - i.e. inset `12px` inside the fleet panel on the top/right/bottom edges and
flush against a 456px column line. Express it as:

```css
.specs {
  position: absolute;
  inset: 12px 12px 12px auto;
  width: 912px;
  background: #191919;
  border-radius: 4px;
  overflow: hidden;
  z-index: 10;
}
```

**Internal layout** - two columns split by a full-height vertical rule at `456px`:

```
.specs                                    (912 × 752, #191919, radius 4)
├── img .specs__waves   182:906           overlay: 1544 × 440, bottom-anchored,
│                                          opacity 0.32, mix-blend-mode: soft-light
├── img .specs__vessel  247:1082          overlay: 400 × 400, left 24px, vertically centred
├── span.specs__chip    182:916           overlay: top 24px, left 24px
├── button.specs__close 182:909           overlay: top 24px, right 24px, 40 × 40
├── hr  182:911                           vertical rule at x = 456, full height
├── .specs__length      247:842           bottom-left, 408 wide, 24px from left
└── .specs__table       247:838           right column, 456 wide, starts at y = 192
```

**Left column** - the vessel render on a dark field, a state chip top-left, and a single
length stat pinned to the bottom.

**Right column** - a display heading, then a 2 × 2 stat grid separated by two horizontal
rules:

```css
.specs__table {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px 24px;
}
.specs__row {
  display: flex;
  gap: 24px;
}
.specs__cell {
  flex: 0 0 192px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 140px;
}
```

**Rules:** `182:911` (vertical, `0 × 752`) and `182:912` / `182:913` (horizontal,
`456 × 0`) - all **1px `rgba(255,255,255,0.08)`**. These are the panel's only structure;
they are trivially lost. Horizontal rules run the **full 456px column width**, bleeding
past the 24px cell padding on both sides.

**Overlay-only styles** (not in `DESIGN.md` - they exist solely inside this dark panel):

| Role                        | Value                                                            |
| --------------------------- | ---------------------------------------------------------------- |
| Panel background            | `#191919`                                                        |
| State chip text             | `#4D80E6`                                                        |
| State chip fill             | `rgba(77,128,230,0.12)`, `border-radius: 2px`, padding `6px 8px` |
| Rules & close-button border | `rgba(255,255,255,0.08)`                                         |
| Stat labels                 | `#FFFFFF` @ **48%**                                              |
| Stat values, heading        | `#FFFFFF`                                                        |

| Element                                     | Font                                                                                   |
| ------------------------------------------- | -------------------------------------------------------------------------------------- |
| Heading (`10kW sense & compute node`)       | Exposure 450 `48px` / `48px`, `-1.92px`, `#FFFFFF`, `align-items: flex-end`            |
| Stat labels (`Onboard electrical power`, …) | **Server Mono** Regular 400 `12px` / `12px`, `-0.24px`, **uppercase**, `#FFFFFF` @ 48% |
| Stat values (`10kW`, `up to 8xH200`, …)     | Matter Regular 400 `16px` / `19.84px`, `-0.32px`, `#FFFFFF`                            |
| State chip                                  | Overpass Mono Bold `12px` / `12px`, `+0.12px`, uppercase, `#4D80E6`                    |

**Server Mono is used nowhere else on the page.** It is the only typeface outside the
three-family system and appears exclusively on the spec-panel stat labels.

**Close button** `182:909`: `40 × 40`, `border-radius: 999px`,
`border: 1px solid rgba(255,255,255,0.08)`, transparent fill, a `24 × 24` "x" glyph drawn
with two `12 × 12` paths at **1.6px** `#FFFFFF` stroke.

**Content per state** - the three frames differ only in these values. The segment control
selects between them.

| Field                        | State 1 (`182:782`)           | State 2 (`247:877`)            | State 3 (`247:975`)                   |
| ---------------------------- | ----------------------------- | ------------------------------ | ------------------------------------- |
| Chip                         | `in the water today`          | `Mid-2007`                     | `Mid 2007`                            |
| Heading                      | `10kW sense`⏎`& compute node` | `250kW sense`⏎`& compute node` | `3MW sense`⏎`& compute node`          |
| `Lenght`                     | `12 meters`                   | `24 meters`                    | `70 meters`                           |
| `Onboard electrical`⏎`power` | `10kW`                        | `250 kW`                       | `3MW`                                 |
| `Compute`                    | `up to 8xH200`                | `up to 144xH200`               | `up to 1600 accelerators`             |
| `Cooling`                    | `heat-exchanged`⏎`seawater`   | `heat-exchanged`⏎`seawater`    | `heat-exchanged`⏎`seawater`           |
| `Connectivity`               | `Starlink Marine`             | `Bonded Starlink`⏎`(gigabit)`  | `multiple Bonded Starlink (gigabit+)` |

⏎ marks a **U+2028 line separator** in the source - an explicit line break inside the
string, not a wrap. Render as `<br>`.

> **Copy flags for the client.** `Lenght` is misspelled (should be `Length`), and the
> chips on states 2 and 3 read `Mid-2007` / `Mid 2007` where the segment control says
> `Mid-2027` / `This decade`. These are drawn that way in the design. Reproduce verbatim
> and raise them as copy fixes rather than silently correcting.

### Fleet - segment / state naming

The shipping fleet section (`181:534`) labels its segments **`October 2026` / `Mid-2027` /
`This decade`**. Alternate frames in the file (`182:782`, `247:877`, `247:975`) label the
same control **`In the water today` / `Next year` / `This decade`**. **Use the shipping
labels** (`October 2026` / `Mid-2027` / `This decade`) - they match the section that is
actually in the page frame.

### Responsive

| Width     | Behaviour                                                                                                                                                                                                                                                                                                                                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ≥ 1280    | As drawn.                                                                                                                                                                                                                                                                                                                                                                                                              |
| 1024-1279 | Panel keeps its 12px inset. Header `width: 46%`, headline `clamp(52px, 6vw, 80px)`. Text column `width: min(384px, 30%)`. Viewer scales to `min(400px, 32vw)`.                                                                                                                                                                                                                                                         |
| 768-1023  | Panel becomes a flow column: header (top-left), viewer (centred, `min(400px, 52vw)`), text column below the viewer centred at `width: min(384px, 80%)`, segments still bottom-centred. Panel height `auto`, `min-height: 720px`, `padding: 36px`.                                                                                                                                                                      |
| < 768     | Full column stack at `padding: 24px`: eyebrow → headline (`clamp(36px, 11vw, 52px)`) → viewer → lead → CTA → segment control. Segment control scrolls horizontally if it exceeds the width. Background stack unchanged (it is `cover` on both axes). Specifications overlay becomes a full-screen sheet: `inset: 0`, `border-radius: 0`, stat grid collapses from 2 columns to 1, vessel render moves above the table. |

---

## Section 4 - About

**Node `182:2323`** · 1440 × 948 · background `surface`. **No panel** - this section sits
directly on white with a `48px` gutter.

### Structure and layout

A 12-column grid, two content columns and two rows. The left block spans **columns 1-4**
(432px), the right block spans **columns 6-12** (774px); **column 5 is deliberately
empty**, which is what produces the wide 138px trough between them.

```css
.about {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 24px;
  row-gap: 100px;
  padding: 48px 48px 96px;
  background: #ffffff;
}
.about__intro {
  grid-column: 1 / span 4;
  grid-row: 1;
} /* 432px */
.about__trades {
  grid-column: 6 / span 7;
  grid-row: 1;
} /* 774px; inner block 660px */
.about__cards {
  grid-column: 1 / span 4;
  grid-row: 2;
}
.about__photo {
  grid-column: 6 / span 7;
  grid-row: 2;
}
```

Derived: both rows start at `y = 48` and `y = 332`; the section ends `96px` below the
photo.

### 4a - Intro (top-left, `182:2343`)

Flex column, `gap: 12px`, `padding-bottom: 64px`.

| Element | Node       | Text                                | Type                                                                                                            |
| ------- | ---------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Eyebrow | `182:2344` | `Clippership`                       | `eyebrow` - Overpass Mono Bold `12px`/`12px`, `+0.12px`, **uppercase** (renders `CLIPPERSHIP`), `#191919` @ 60% |
| Heading | `182:2345` | `One team, built across industries` | `display-md` - Exposure 450 `48px`/`48px`, `-1.92px`, `ink` `#291D1D`; wraps to 2 lines at 430px                |

### 4b - Trades list (top-right, `247:670`)

Flex column, `gap: 16px`, `padding-top: 24px`, width 659px.

| Element | Node      | Text                                                                     | Type                                                              |
| ------- | --------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| Lead    | `247:673` | `Our team honed their trades at` - NBSP between **their** and **trades** | `lead` - Matter Medium 500 `24px`/`28.32px`, `-0.96px`, `#191919` |

Then a **two-column bullet list** (`247:707`), `gap: 8px` between rows:

```css
.trades__list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 24px;
  row-gap: 8px;
}
.trades__item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 20px;
}
```

Rows read **left-to-right**, so in DOM order the items are:

1. `Tesla` - `Jet Propulsion Laboratory`
2. `Canadian Special Forces` - `Mercedes-AMG Formula 1 Team`
3. `Microsoft` - `Damen Shipyards Group`
4. `Bay Ship and Yacht` - _(no right-hand item; this row spans the full 659px)_

Label type: `body` - Matter Regular 400 `16px` / `19.84px`, `-0.64px`,
`text-tertiary` `#19191999` (60%).

**Bullet marker** (`bullet-item` component): an `8 × 8` box,
`border: 1px solid rgba(25,25,25,0.08)`, `border-radius: 2px`, `overflow: hidden`,
containing a centred `→` glyph at **Matter Bold 700, 4px / 4px, `+0.04px`, uppercase,
`#191919` @ 60%**. At 4px the arrow reads as a dot - that is the intended weight. Do not
substitute a list marker or a larger icon.

### 4c - Team cards (bottom-left, `182:1898`)

Flex column, `gap: 12px`, `align-items: flex-end`, width 432px. Three `card` components,
each `432 × 146`.

```css
.card {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 24px;
  border-radius: 4px;
  background: #ffffff;
  border: 1px solid #ececec; /* white ring + hairline, flattened */
  position: relative; /* for the LinkedIn glyph overlay */
}
.card__id {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

| Card | Node       | Role (`eyebrow`, 60%) | Name (`lead`)    | Credentials (`body`, 64%)        |
| ---- | ---------- | --------------------- | ---------------- | -------------------------------- |
| 1    | `182:1880` | `CEO`                 | `Nico Cymbalist` | `Ex-Tesla, Mercedes-F1, Caltech` |
| 2    | `182:1889` | `COO`                 | `Luca Cymbalist` | `Ex-Canadian Special Forces`     |
| 3    | `182:1899` | `CTO`                 | `Kai Matsuka`    | `Ex-Tesla, JPL, Caltech`         |

- Role: Overpass Mono Bold `12px`/`12px`, `+0.12px`, uppercase, `#191919` @ 60%.
- Name: Matter Medium 500 `24px`/`28.32px`, `-0.96px`, `#191919`.
- Credentials: Matter Regular 400 `16px`/`19.84px`, `-0.64px`, `#191919A3` (64%).

**LinkedIn glyph** (`182:2097`, `182:2099`, `182:2101`) - a `16 × 16` path, `#191919` at
**60% opacity**, a genuine **overlay** pinned `24px` from the card's top and right edges
(`position: absolute; top: 24px; right: 24px`). Marked `layoutPositioning: ABSOLUTE` in
the source, so it does not participate in the card's flex flow.

The card stack gap is `12px` - tighter than the 24px grid gutter, so the three cards read
as one object rather than three.

### 4d - Team photo (bottom-right, `182:2559`)

`774 × 520` frame, `border-radius: 4px`, `overflow: hidden`, white ring + hairline
(flattened `#ECECEC`). Image `182:2560` natural `1114 × 740`, `object-fit: cover`,
centred (`object-position` ≈ `-170px -31px` at 1440).

`aspect-ratio: 774 / 520` (≈ 1.488) - hold it at every width.

- **Figure chip** `182:2561` - overlay, top-left, label `Our Team`, `caption-mono`
  (Overpass Mono Bold `8px`, `+0.08px`, uppercase) at `#191919` @ 60%. Padding
  `24px 64px 32px 24px`. **This chip has no scrim gradient** - unlike the How It Works
  chips, it is plain dark text on the photo.
- **`FPO // Image Placeholder` badge** `182:2564` - a production marker, **not part of the
  design**. It is a glass pill (`rgba(246,246,247,0.64)`, `backdrop-filter: blur(4px)`,
  hairline border, radius 999px) with the label in `#FF0000` @ 64%. **Do not ship it.**
  It marks the team photo as a placeholder awaiting the final shot.

### Responsive

| Width     | Behaviour                                                                                                                                                                                                       |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ≥ 1280    | As drawn.                                                                                                                                                                                                       |
| 1024-1279 | Same grid; left block `grid-column: 1 / span 5`, right `grid-column: 6 / span 7`. Heading `clamp(36px, 3.8vw, 48px)`.                                                                                           |
| 768-1023  | Collapse to 2 rows of full-width blocks: intro, trades, cards, photo - `grid-template-columns: 1fr`, `row-gap: 64px`, `padding: 48px 32px`. Trades list stays 2 columns.                                        |
| < 768     | Single column, `padding: 48px 24px`, `row-gap: 48px`. Trades list → 1 column, `row-gap: 12px`. Cards full width, `align-items: stretch`. Photo keeps `aspect-ratio: 774/520`. Heading `clamp(32px, 9vw, 40px)`. |

---

## Section 5 - Footer

**Node `182:2746`** · 1440 × 252 · `layoutMode: VERTICAL`, `padding: 0 12px 12px`,
background `surface`.

### Structure

```
footer                               (padding 0 12px 12px)
└── .footer__panel  182:2961         (1416 × 240, radius 12px, overflow hidden, position: relative)
    ├── img .footer__waves 183:93    overlay, behind everything
    ├── .footer__backers  246:631    top row, 9 logo slots
    └── .footer__meta     246:652    bottom row, 3 parts
```

```css
.footer__panel {
  position: relative;
  height: 240px;
  border-radius: 12px;
  background: rgba(229, 228, 230, 0.32); /* panel-wash */
  overflow: hidden;
  /* no border */
}
```

Same `section-panel` component as The Fleet. **No stroke.**

### Wave backdrop (overlay)

`183:93` - painted wave band, natural `1416 × 478`, **`opacity: 0.64`**,
`object-fit: cover`, top-anchored at `-59px` so the wave crests land behind the meta row:

```css
.footer__waves {
  position: absolute;
  top: -59px;
  left: 0;
  width: 100%;
  height: 478px;
  object-fit: cover;
  opacity: 0.64;
  pointer-events: none;
}
```

At other widths, anchor it proportionally: `top: calc(-59 / 240 * 100%)`, `height: 199%`.

### Backer row (`246:631`)

```css
.footer__backers {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 48px 36px 0;
}
.footer__backers a {
  flex: 1 1 0;
  height: 36px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer__backers img {
  mix-blend-mode: darken;
  opacity: 0.6;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
```

Nine equal slots of `128 × 36` (`9 × 128 + 8 × 24 = 1344`), each `flex: 1`. Logos are at
**`opacity: 0.6` with `mix-blend-mode: darken`** so their white plates disappear into the
panel wash - without the blend mode you get nine visible white rectangles.

In order: **Y50 · JC · Long Journey · Founders Factory · KM Yachtbuilders · ABS · RINA ·
Dykstra Naval Architects · NVIDIA Inception Program.**

Note each logo's natural size exceeds its 36px-tall slot and is **clipped** (the slot has
`overflow: hidden`) - e.g. slot 1 holds a 48 × 48 image, slot 9 an 80 × 63 image. The
clipping is part of the look; keep `overflow: hidden` on the slot.

### Meta row (`246:652`)

```css
.footer__meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 48px 0;
}
```

Three parts, all `eyebrow` type - Overpass Mono Bold `12px` / `12px`, `+0.12px`,
`#191919` at **80% opacity**:

**Left (`183:79`)** - flex column, `gap: 8px`, `padding: 0 36px`, `justify-content: center`:

| Node     | Content                    | Notes                                                                                            |
| -------- | -------------------------- | ------------------------------------------------------------------------------------------------ |
| `183:78` | `(c)2026 Clippership inc.` | **uppercase** → renders `(C)2026 CLIPPERSHIP INC.`                                               |
| `183:88` | horizontal rule            | `181px × 1px`, `background: rgba(25,25,25,0.16)` (`border-rule`), stretches to the block's width |
| `183:80` | `hello@clippership.co`     | **not uppercased** - `text-transform: none`. Mailto link.                                        |

**Centre (`235:514`)** - the wordmark, `157 × 28`, `#291D1D`. Marked
`layoutPositioning: ABSOLUTE` in the source: it is an **overlay centred on the panel**,
independent of the space-between row, so it stays on the page's centre line regardless of
how wide the left and right blocks get.

```css
.footer__wordmark {
  position: absolute;
  left: 50%;
  bottom: 54px;
  transform: translateX(-50%);
  width: 157px;
  height: 28px;
}
```

**Right (`183:73`)** - flex row, `gap: 24px`, `padding: 0 36px`, **`opacity: 0.8`**:

| Node     | Icon     | Size    |
| -------- | -------- | ------- |
| `183:74` | YouTube  | 23 × 16 |
| `183:75` | LinkedIn | 16 × 16 |
| `183:76` | X        | 18 × 16 |

All three are solid `#191919` paths.

### Responsive

| Width    | Behaviour                                                                                                                                                                                                                             |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ≥ 1024   | As drawn.                                                                                                                                                                                                                             |
| 768-1023 | Backer row wraps: `flex-wrap: wrap`, slots `flex: 0 0 calc((100% - 96px) / 5)`, `row-gap: 24px`. Panel height `auto`, `padding-bottom: 24px`; meta row becomes static (not absolute) with `margin-top: 48px`. Wordmark stays centred. |
| < 768    | Backers → 3 per row (`flex: 0 0 calc((100% - 48px) / 3)`). Meta row becomes a centred column: wordmark first, then the copyright/email block (centred, rule centred), then the social row. `gap: 24px`, `padding: 32px 24px`.         |

---

## 6. Animation signals

Five patterns are present in the design. Each is listed with what triggers it.

### 6.1 Split-opacity lead paragraphs - scroll-linked text reveal

Two paragraphs are single text nodes carrying **two colour runs**, the trailing run at a
much lower opacity. This is the design's notation for a **word-by-word reveal driven by
scroll**, not a static two-tone paragraph.

| Node      | Section   | Full-contrast run                                       | Ghosted run                                                                                                                   |
| --------- | --------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `181:503` | Hero      | `Autonomous vessels ` (100%)                            | `take AI compute onto the wide-open ocean, where clean energy and cooling are plentiful, and the red tape is thin.` (**48%**) |
| `181:560` | The Fleet | `Our roadmap starts with maritime edge compute ` (100%) | `and scales to fleets of 3MW vessels for AI inference` (**24%**)                                                              |

Implementation: split the paragraph into word spans, start every word at the ghost
opacity, and raise each to 100% as the paragraph crosses the viewport (a scroll-linked
gradient sweep left-to-right, top-to-bottom). The hero's variant is confirmed by the
interaction frames - the same paragraph is at **48%** in state A and **100%** in state B
(§1), so the ghost/full pair is the start and end of one transition.

Under `prefers-reduced-motion: reduce`, render the static two-tone state exactly as
drawn.

### 6.2 Hero parallax and foreground pass

Full sequence documented in §1 under _Hero scroll interaction_: the vessel translates up
`461px`, the display headline rises `100px` while fading to 60% and blurring to 8px, a
foreground vessel plate passes **in front of** the headline, and the lead + CTA resolve to
full contrast.

### 6.3 Media strip - infinite marquee

The How It Works strip is `2232px` wide inside a `1416px` frame and is clipped. It is a
**continuously scrolling marquee**, not a grid that failed to wrap. Duplicate the five
tiles and translate the track at a constant rate (`slow`, 640ms easing for hover/pause
transitions); pause on hover and on `prefers-reduced-motion: reduce` (fall back to a
native horizontal scroller).

### 6.4 3D vessel turntable

The `‹ ›` drag CTA, the masked orbit ring and the segment control together describe an
**interactive 3D viewer**: horizontal drag rotates the vessel, and the segment control
swaps the model between the three roadmap scales. The ring's masked ends indicate the
rotation axis. Minimum viable build: an image sequence scrubbed by horizontal drag, with
a cross-fade between the three models on segment change.

### 6.5 Segment control pill

The selected black pill **slides** between the three items at `base` (360ms) with
`--ease-fluid`; labels cross-fade between `label` 600 @ 64% and `label-active` 500 in
white. Animate one pill's position - do not fade two pills.

**Not present:** no rotating/typewriter word lists, no counters or stat numbers, no
progress bars, no `[cycle]` / `[marquee]` layer-name tags, no component variant sets.

---

## 7. Low-contrast and full-bleed decoration

Everything here is visible in the design but covers few pixels at low contrast, so it is
easy to lose. Each must survive into the build.

| #   | What                       | Node                                                                  | Where                               | Exact value                                                                                                                      |
| --- | -------------------------- | --------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Orbit ring**             | `181:541`                                                             | Fleet panel centre                  | Ellipse `480 × 92`, 1px `#191919` stroke at `opacity: 0.12`, masked to two 93px windows at its left/right ends. Full spec in §3. |
| 2   | **Footer meta rule**       | `183:88`                                                              | Footer, between copyright and email | `181px × 1px`, `rgba(25,25,25,0.16)`; stretches to the meta block's width                                                        |
| 3   | **Specs vertical rule**    | `182:911`                                                             | Specifications overlay, `x = 456`   | `1px × 752px`, `rgba(255,255,255,0.08)`, full panel height                                                                       |
| 4   | **Specs horizontal rules** | `182:912`, `182:913`                                                  | Specifications overlay              | `456px × 1px` each, `rgba(255,255,255,0.08)`, full column width - bleed past the 24px cell padding                               |
| 5   | **Fleet radial wash**      | `181:539`                                                             | Fleet panel, full bleed             | `radial-gradient(at 0% 0%, rgba(246,246,247,0.64), rgba(246,246,247,0))`                                                         |
| 6   | **Fleet grain texture**    | `181:537`                                                             | Fleet backdrop                      | Figma `TEXTURE` effect, radius 8 - tiling noise overlay; prevents banding in the large washes                                    |
| 7   | **Fleet backdrop opacity** | `181:538`                                                             | Fleet panel                         | `opacity: 0.64` on a `1572 × 1054` image                                                                                         |
| 8   | **Footer wave opacity**    | `183:93`                                                              | Footer panel                        | `opacity: 0.64` on a `1416 × 478` image                                                                                          |
| 9   | **Backer logo blend**      | `246:634` … `246:650`                                                 | Footer                              | `opacity: 0.6` + `mix-blend-mode: darken`                                                                                        |
| 10  | **Figure-chip scrims**     | `181:751`, `181:769`, `235:618`, `235:624`, `247:659`                 | Media tiles                         | Radial `rgba(43,38,38,0.8) → transparent` from the top-left corner, whole chip at `opacity: 0.64`                                |
| 11  | **Specs wave wash**        | `182:906`                                                             | Specifications overlay              | `opacity: 0.32`, `mix-blend-mode: soft-light`, bottom-anchored                                                                   |
| 12  | **Bullet marker arrows**   | `247:797` and siblings                                                | About trades list                   | `→` at **4px**, `#191919` @ 60%, inside an 8px hairline box                                                                      |
| 13  | **LinkedIn card glyphs**   | `182:2097`, `182:2099`, `182:2101`                                    | Team cards                          | `#191919` at `opacity: 0.6`                                                                                                      |
| 14  | **Eyebrow opacity**        | `181:557`, `182:2344`, `182:1885`, `182:1894`, `182:1904`, `182:2562` | Throughout                          | All eyebrows render at **60%**, not 100%                                                                                         |
| 15  | **Footer meta opacity**    | `183:78`, `183:80`, `183:73`                                          | Footer                              | All at **80%**                                                                                                                   |

**There is no background column grid or baseline-grid overlay on this page.** A full scan
of the frame found exactly one zero-dimension stroke node (`183:88`, the footer rule,
item 2 above). Do not invent ruler lines.

---

## 8. Borders and panels - explicit list

`strokes[]` → CSS `border`. Every container on the page, stated:

| Element                     | Node                                                  | Border                                                                                            |
| --------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Hero stage                  | `181:500`                                             | **none** (radius `0 0 12px 12px`)                                                                 |
| Hero CTA pill               | `181:708`                                             | `1px solid rgba(25,25,25,0.08)`                                                                   |
| Media tiles (× 5)           | `181:726`, `181:765`, `235:616`, `235:622`, `247:657` | **two** 1px inside strokes: `#FFFFFF` under `rgba(25,25,25,0.08)` → flattened `1px solid #ECECEC` |
| Fleet panel                 | `181:535`                                             | **none**                                                                                          |
| Fleet `Specifications` CTA  | `181:561`                                             | `1px solid rgba(25,25,25,0.08)`                                                                   |
| Fleet segment control track | `181:549`                                             | **none**                                                                                          |
| Fleet drag CTA circle       | `181:546`                                             | **none**                                                                                          |
| Orbit ring                  | `181:545`                                             | 1px `#191919` @ 12%, stroke-only (no fill)                                                        |
| Team cards (× 3)            | `182:1880`, `182:1889`, `182:1899`                    | **two** 1px inside strokes → flattened `1px solid #ECECEC`                                        |
| Trades bullet boxes         | `247:719` and siblings                                | `1px solid rgba(25,25,25,0.08)`                                                                   |
| Team photo frame            | `182:2559`                                            | **two** 1px inside strokes → flattened `1px solid #ECECEC`                                        |
| FPO badge                   | `182:2564`                                            | `1px solid rgba(25,25,25,0.08)` - _not shipped_                                                   |
| Footer panel                | `182:2961`                                            | **none**                                                                                          |
| Footer backer slots         | `246:633` … `246:649`                                 | **none** (radius 4px, `overflow: hidden`)                                                         |
| Specs overlay panel         | `182:905`                                             | **none** (radius 4px)                                                                             |
| Specs close button          | `182:909`                                             | `1px solid rgba(255,255,255,0.08)`                                                                |

**No element on this page has a box-shadow.** Depth comes from the hairline + white ring,
backdrop blur, radial washes and opacity - see `DESIGN.md`, _Elevation & Depth_.

---

## 9. Typography inventory

Every distinct text style on the page, with where it is used.

| #   | Family / PostScript                 | Weight | Size / line-height        | Letter-spacing      | Case      | Colour                      | Used for                                              |
| --- | ----------------------------------- | ------ | ------------------------- | ------------------- | --------- | --------------------------- | ----------------------------------------------------- |
| 1   | Exposure / `Exposure-20`            | 450    | `108px` / `108px` (1.0)   | `-4.32px` (−0.04em) | -         | `#291D1D`                   | Hero `h1`                                             |
| 2   | Exposure / `Exposure-20`            | 450    | `80px` / `80px` (1.0)     | `-3.2px` (−0.04em)  | -         | `#291D1D`                   | Fleet headline                                        |
| 3   | Exposure / `Exposure-20`            | 450    | `48px` / `48px` (1.0)     | `-1.92px` (−0.04em) | -         | `#291D1D`                   | About heading                                         |
| 4   | Exposure / `Exposure-20`            | 450    | `48px` / `48px` (1.0)     | `-1.92px`           | -         | `#FFFFFF`                   | Specs overlay heading                                 |
| 5   | Matter / `Matter-Medium`            | 500    | `24px` / `28.32px` (1.18) | `-0.96px` (−0.04em) | -         | `#191919`                   | Leads, team names, trades intro                       |
| 6   | Matter / `Matter-Regular`           | 400    | `16px` / `19.84px` (1.24) | `-0.64px` (−0.04em) | -         | 60% / 64% ink               | Trades list, card credentials                         |
| 7   | Matter / `Matter-Regular`           | 400    | `16px` / `19.84px` (1.24) | `-0.32px` (−0.02em) | -         | `#FFFFFF`                   | Specs overlay stat values                             |
| 8   | Matter / `Matter-SemiBold`          | 600    | `14px` / `16px` (1.143)   | `-0.28px` (−0.02em) | -         | varies                      | Buttons, unselected segments                          |
| 9   | Matter / `Matter-Medium`            | 500    | `14px` / `16px` (1.143)   | `-0.28px` (−0.02em) | -         | `#FFFFFF`                   | **Selected** segment item                             |
| 10  | Matter / `Matter-Bold`              | 700    | `4px` / `4px`             | `+0.04px`           | upper     | `#191919` @ 60%             | Bullet marker `→`                                     |
| 11  | Overpass Mono / `OverpassMono-Bold` | 700    | `12px` / `12px` (1.0)     | `+0.12px` (+0.01em) | **upper** | `#191919` @ 60-80%          | Eyebrows, roles, footer meta, state chip              |
| 12  | Overpass Mono / `OverpassMono-Bold` | 700    | `12px` / `12px`           | `+0.12px`           | **none**  | `#191919` @ 80%             | Footer email - the one mono string **not** uppercased |
| 13  | Overpass Mono / `OverpassMono-Bold` | 700    | `8px` / `8px` (1.0)       | `+0.08px` (+0.01em) | upper     | `#FFFFFF` / `#191919` @ 60% | Figure chips (`fig.01`, `Our Team`)                   |
| 14  | Server Mono / `ServerMono-Regular`  | 400    | `12px` / `12px` (1.0)     | `-0.24px` (−0.02em) | **upper** | `#FFFFFF` @ 48%             | Specs overlay stat labels **only**                    |

### Loading the fonts

| Family            | Source                                                                                                                                                           |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Overpass Mono** | Google Fonts - `https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@700&display=swap`                                                                    |
| **Exposure**      | Licensed display serif. Self-host WOFF2 under `public/fonts/`. Fallback stack: `"Exposure", "Exposure-20", Georgia, "Times New Roman", serif`.                   |
| **Matter**        | Licensed grotesque. Self-host WOFF2 (Regular 400, Medium 500, SemiBold 600, Bold 700). Fallback: `"Matter", -apple-system, "Helvetica Neue", Arial, sans-serif`. |
| **Server Mono**   | Licensed mono, used only in the Specifications overlay. Self-host WOFF2 Regular 400. Fallback: `"Server Mono", ui-monospace, "SF Mono", Menlo, monospace`.       |

Declare all self-hosted faces with `font-display: swap` and matching `size-adjust` so the
fallback does not reflow the 108px headline.

**Weight 450 on Exposure is deliberate** - an optical weight between Regular and Medium.
Rounding it to 400 or 500 visibly changes the headline's colour on the page.

### Font substitution to correct

Two `24px` lead paragraphs (hero `181:503`, fleet `181:560`) are set in
`ArticulatCF-Regular` at weight 400 with metrics identical to the Matter Medium leads
elsewhere (`28.32px` / `-0.96px`). Matter is the system family and covers the rest of the
page. **Build both leads in Matter Medium 500** and treat Articulat CF as a stray
substitution, per `DESIGN.md`.

---

## 10. Colours used on this page

All from `DESIGN.md` unless marked.

| Hex                | Token             | Role on this page                                        |
| ------------------ | ----------------- | -------------------------------------------------------- |
| `#FFFFFF`          | `surface`         | Page background, cards, drag CTA, tile white ring        |
| `#291D1D`          | `ink`             | All three display headings, both wordmarks               |
| `#191919`          | `text`            | Body, UI, icons, selected segment fill, specs panel fill |
| `#F6F6F7`          | `surface-muted`   | `Specifications` button fill, orbit-ring mask shape      |
| `#E5E4E652`        | `panel-wash`      | Fleet panel, footer panel (32%)                          |
| `#2B2626CC`        | `scrim-chip`      | Figure-chip radial scrim (80% → 0)                       |
| `#191919FF`        | `text-strong`     | Names, values, emphasised lead runs                      |
| `#191919A3`        | `text-secondary`  | Hero CTA label, card credentials (64%)                   |
| `#19191999`        | `text-tertiary`   | Trades list, eyebrows, bullet arrows (60%)               |
| `#1919197A`        | `text-quiet`      | Hero lead, specs stat labels (48%)                       |
| `#19191929`        | `border-rule`     | Footer meta rule (16%)                                   |
| `#19191914`        | `border-hairline` | Every hairline border (8%)                               |
| `#F6F6F729`        | `glass-light`     | Hero CTA fill (16%)                                      |
| `#F6F6F7A3`        | `glass-mid`       | FPO badge fill, fleet radial wash (64%)                  |
| `#FFFFFF66`        | `glass-white`     | Segment control track (40%)                              |
| `#19191914` at 12% | -                 | Orbit ring stroke                                        |
| **`#4D80E6`**      | _page-local_      | Specs overlay state chip text                            |
| **`#4D80E61F`**    | _page-local_      | Specs overlay state chip fill (12%)                      |
| **`#FFFFFF14`**    | _page-local_      | Specs overlay rules + close-button border (8%)           |
| `#FF0000A3`        | _not a token_     | FPO placeholder label - **do not ship**                  |

---

## 11. Components on this page

| Component                   | System entry                 | Instances                                                                                     |
| --------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------- |
| Section panel               | `section-panel`              | Fleet `181:535`, Footer `182:2961` - `panel-wash`, radius 12, inset 12, padding 36, no border |
| Pill button - `glass`       | `button-glass`               | Hero `Read the white paper` `181:708` - 16% fill, 4px blur, 64% label                         |
| Pill button - `solid`       | `button-solid`               | Fleet `Specifications` `181:561` - `#F6F6F7` fill, 100% label                                 |
| Pill button - `translucent` | `button-glass` (64% variant) | FPO badge `182:2564` - _not shipped_                                                          |
| Round icon button           | `button-icon`                | Fleet drag CTA `181:546` (40px, white, two chevrons at −8px gap)                              |
| Close button                | _page-local_                 | Specs overlay `182:909` - 40px, transparent, 8% white border, 1.6px "x"                       |
| Segment control             | `segment-control`            | Fleet `181:549` - 3 items, first selected                                                     |
| Card                        | `card`                       | Team cards `182:1880` / `182:1889` / `182:1899` - 432 × 146                                   |
| Media tile                  | `media-tile`                 | 5 strip tiles (radius 8)                                                                      |
| Media tile - inline         | `media-tile-inline`          | Team photo `182:2559` (radius 4)                                                              |
| Figure chip                 | `figure-chip`                | 5 strip chips (with scrim) + team photo chip `182:2561` (**no scrim**)                        |
| Eyebrow                     | `eyebrow`                    | `the roadmap`, `Clippership`, `CEO`/`COO`/`CTO`, footer meta                                  |
| Bullet item                 | `bullet-item`                | 7 trades entries                                                                              |
| Footer                      | `footer`                     | `182:2746`                                                                                    |

### Hover / active states

The file draws no hover variants, so these follow `DESIGN.md`, _Motion_:

| Element               | Rest → hover                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Glass pill            | fill `glass-light` → `glass-mid`; label `text-secondary` → `text-strong`; `fast` (160ms). No lift, no scale.        |
| Solid pill            | border `border-hairline` → `border-rule`; `fast`.                                                                   |
| Card                  | border `border-hairline` → `border-rule` at `fast`; the LinkedIn glyph may translate a few px - nothing else moves. |
| Media tile            | the image inside scales gently at `slow` (640ms); the tile itself does not move (`overflow: hidden`).               |
| Segment item          | unselected label opacity 64% → 100% at `fast`.                                                                      |
| Social / backer logos | opacity 80% → 100% / 60% → 100% at `fast`.                                                                          |

Single curve everywhere: `--ease-fluid: cubic-bezier(0.32, 0.72, 0, 1)`. No bounce, no
overshoot. Collapse every transition to an opacity change at `fast` under
`prefers-reduced-motion: reduce`.

---

## 12. Spacing reference

| Context                                   | Value                       |
| ----------------------------------------- | --------------------------- |
| Page gutter (panel inset)                 | `12px`                      |
| Panel inner padding                       | `36px`                      |
| Bare-section gutter (About)               | `48px`                      |
| Effective content inset, all sections     | `48px`                      |
| Content width @ 1440                      | `1344px`                    |
| Grid                                      | 12 × `90px`, gutters `24px` |
| Hero - title top                          | `148px`                     |
| Hero - wordmark → headline                | `-12px` (optical overlap)   |
| Hero - title block → lead block           | `96px`                      |
| Hero - lead → CTA                         | `24px`                      |
| Hero - lead column right padding          | `48px`                      |
| Strip - tile gap                          | `24px`                      |
| Strip - section padding                   | `12px`                      |
| Figure chip - inset from tile             | `24px` top / `24px` left    |
| Fleet - eyebrow → headline                | `16px`                      |
| Fleet - lead → CTA                        | `56px`                      |
| Fleet - segment control from panel bottom | `36px`                      |
| Fleet - segment track padding / item gap  | `4px` / `4px`               |
| Fleet - segment item padding              | `8px 16px`                  |
| About - row gap                           | `100px`                     |
| About - intro eyebrow → heading           | `12px`                      |
| About - intro block bottom padding        | `64px`                      |
| About - trades block top padding          | `24px`                      |
| About - trades lead → list                | `16px`                      |
| About - bullet row gap / column gap       | `8px` / `24px`              |
| About - bullet marker → label             | `8px`                       |
| About - card stack gap                    | `12px`                      |
| About - card padding                      | `24px`                      |
| About - card identity → credentials       | `28px`                      |
| About - card role → name                  | `8px`                       |
| About - section bottom padding            | `96px`                      |
| Footer - backer row padding               | `48px 36px 0`               |
| Footer - backer slot gap                  | `24px`                      |
| Footer - meta row padding                 | `48px 0`                    |
| Footer - meta side padding                | `36px`                      |
| Footer - copyright → rule → email         | `8px`                       |
| Footer - social icon gap                  | `24px`                      |
| Specs - panel padding                     | `24px`                      |
| Specs - table section gap                 | `24px`                      |
| Specs - table vertical padding            | `32px`                      |
| Specs - stat column gap                   | `24px`                      |

**Every value is a multiple of 4.** The one exception, `itemSpacing: 10` inside segment
buttons, is inert (the label is the only child) - ignore it. The negative gaps (`-12px`
hero title, `-8px` drag CTA) are optical corrections, not errors.

---

## 13. Assets

Fetch each by the node ID given. These are the **export containers** - the frame or node
that renders the whole asset, never an individual child path.

| File                              | Type           | Node ID    | Description                                                                             | Dimensions                          | Notes                                                                                                                                                                                                                                                                                       |
| --------------------------------- | -------------- | ---------- | --------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hero-sky.png`                    | raster         | `181:671`  | Painted sky-and-sea backdrop behind the hero                                            | 2279 × 1607                         | Full-bleed overlay, `object-fit: cover`, `object-position: center`. Overscaled ~1.6× at 1440 so the brushwork keeps its grain - do not downscale to the frame.                                                                                                                              |
| `hero-vessel.png`                 | raster         | `247:655`  | Four-masted sail freighter, hero foreground                                             | 2252 × 1588                         | Transparent PNG. Two image fills composited in this one node - export the node, not the fills. `object-position: center bottom`; bottom-anchored so the hulls stay in frame at every height.                                                                                                |
| `hero-vessel-front.png`           | raster         | `247:680`  | Foreground vessel plate that passes **in front of** the headline during the hero scroll | 2252 × 1588                         | Transparent PNG, masts only. Sits above the title in z-order; see §1 _Hero scroll interaction_. Same placement as `hero-vessel.png`.                                                                                                                                                        |
| `wordmark-clippership.svg`        | logo           | `235:424`  | `clippership` wordmark, hero                                                            | 157 × 28                            | Authored as an image used as an alpha mask over a `#291D1D` fill. Export the **frame** (not the inner rectangles) to get the tinted result. A true vector version of the same wordmark exists at `181:697` (197 × 20, `#191919`) - prefer it if an SVG is needed and recolour to `#291D1D`. |
| `wordmark-clippership-footer.svg` | logo           | `235:514`  | Same wordmark, footer                                                                   | 157 × 28                            | Identical asset to the hero wordmark; ship one file and reuse.                                                                                                                                                                                                                              |
| `how-it-works-01.jpg`             | raster         | `247:662`  | Vessel at sea below the Golden Gate Bridge                                              | 729 × 423                           | Tile 1 (546 × 404). `object-fit: cover`, `object-position: -13px 0`.                                                                                                                                                                                                                        |
| `how-it-works-02.jpg`             | raster         | `235:614`  | Operator at a laptop on deck, branded sail behind                                       | 408 × 544                           | Tile 2 (320 × 404). `object-position: -44px -70px`.                                                                                                                                                                                                                                         |
| `how-it-works-03.jpg`             | raster         | `235:629`  | Hull section under construction in a hangar                                             | 538 × 404                           | Tile 3 (404 × 404). `object-position: 4px 0`.                                                                                                                                                                                                                                               |
| `how-it-works-04.jpg`             | raster         | `235:627`  | Vessel on a travel-lift at a marina dock                                                | 492 × 656                           | Tile 4 (320 × 404). `object-position: -79px -101px`.                                                                                                                                                                                                                                        |
| `how-it-works-05.jpg`             | raster         | `247:658`  | Vessel under sail in open ocean, monochrome                                             | 837 × 1116                          | Tile 5 (546 × 404). `object-position: -291px -363px`.                                                                                                                                                                                                                                       |
| `fleet-sky.png`                   | raster         | `181:537`  | Painted sky-and-sea backdrop, fleet panel                                               | 1697 × 1358                         | Full-bleed overlay, `object-fit: cover`, centred. Carries a grain texture - add a tiling noise overlay on top (radius 8).                                                                                                                                                                   |
| `fleet-backdrop.png`              | raster         | `181:538`  | Secondary painted backdrop, fleet panel                                                 | 1572 × 1054                         | Render at **`opacity: 0.64`**, `object-fit: cover`, centred.                                                                                                                                                                                                                                |
| `vessel-silhouette.png`           | raster         | `181:540`  | Grey 3D vessel render, fleet viewer                                                     | 400 × 400                           | Transparent PNG, centred on the panel. Same asset is reused in the Specifications overlay (`247:1082`). If the turntable ships, this is frame 0 of the image sequence.                                                                                                                      |
| `orbit-ring.svg`                  | svg-decorative | `181:541`  | Masked elliptical orbit ring around the vessel                                          | 480 × 144 · `viewBox="0 0 480 144"` | Rendered `width: 480px; height: 144px`, `preserveAspectRatio="xMidYMid meet"`. Centred on the panel centre, `pointer-events: none`, below the drag CTA. Full geometry in §3 - prefer hand-building the inline SVG so the stroke stays crisp at 1px.                                         |
| `icon-chevron.svg`                | icon           | `181:547`  | Chevron glyph, drag CTA                                                                 | 16 × 16 (path 9.33 × 4.67)          | Used twice: one rotated `-90°`, one `+90°`, overlapped by `-8px` to read as `‹ ›`. Stroke `1px #191919`, centre-aligned.                                                                                                                                                                    |
| `about-team.jpg`                  | raster         | `182:2560` | Team group photo, About section                                                         | 1114 × 740                          | Frame is `774 × 520` (`aspect-ratio: 774/520`), `object-fit: cover`, `object-position: -170px -31px` at 1440. **Placeholder** - the FPO badge marks it as awaiting the final shot.                                                                                                          |
| `icon-linkedin.svg`               | icon           | `182:2097` | LinkedIn glyph on team cards                                                            | 16.16 × 16                          | `#191919` at `opacity: 0.6`. Overlay: `top: 24px; right: 24px` on each card.                                                                                                                                                                                                                |
| `footer-waves.png`                | raster         | `183:93`   | Painted wave band behind the footer                                                     | 1416 × 478                          | Full-bleed, **`opacity: 0.64`**, top-anchored at `-59px` in a 240px panel, `object-fit: cover`. Parent has `overflow: hidden` - the image is ~2× the panel height by design, so do not fit it to the panel or the crests move.                                                              |
| `backer-y50.png`                  | raster         | `246:633`  | Backer logo 1 - Y50                                                                     | slot 128 × 36 (image 48 × 48)       | Export the **slot frame** - it already clips and centres the logo. `mix-blend-mode: darken`, `opacity: 0.6`.                                                                                                                                                                                |
| `backer-jc.png`                   | raster         | `246:635`  | Backer logo 2 - JC                                                                      | slot 128 × 36 (image 30 × 30)       | As above.                                                                                                                                                                                                                                                                                   |
| `backer-long-journey.png`         | raster         | `246:637`  | Backer logo 3 - Long Journey                                                            | slot 128 × 36 (image 87 × 22)       | As above.                                                                                                                                                                                                                                                                                   |
| `backer-founders-factory.png`     | raster         | `246:639`  | Backer logo 4 - Founders Factory                                                        | slot 128 × 36 (image 58 × 45)       | As above.                                                                                                                                                                                                                                                                                   |
| `backer-km-yachtbuilders.png`     | raster         | `246:641`  | Backer logo 5 - KM Yachtbuilders                                                        | slot 128 × 36 (image 58 × 45)       | As above.                                                                                                                                                                                                                                                                                   |
| `backer-abs.png`                  | raster         | `246:643`  | Backer logo 6 - ABS                                                                     | slot 128 × 36 (image 68 × 53)       | As above.                                                                                                                                                                                                                                                                                   |
| `backer-rina.png`                 | raster         | `246:645`  | Backer logo 7 - RINA                                                                    | slot 128 × 36 (image 50 × 39)       | As above.                                                                                                                                                                                                                                                                                   |
| `backer-dykstra.png`              | raster         | `246:647`  | Backer logo 8 - Dykstra Naval Architects                                                | slot 128 × 36 (image 80 × 63)       | As above.                                                                                                                                                                                                                                                                                   |
| `backer-nvidia-inception.png`     | raster         | `246:649`  | Backer logo 9 - NVIDIA Inception Program                                                | slot 128 × 36 (image 79 × 28)       | As above.                                                                                                                                                                                                                                                                                   |
| `icon-youtube.svg`                | icon           | `183:74`   | YouTube glyph, footer social row                                                        | 23 × 16                             | Solid `#191919`; row at `opacity: 0.8`.                                                                                                                                                                                                                                                     |
| `icon-linkedin-footer.svg`        | icon           | `183:75`   | LinkedIn glyph, footer social row                                                       | 16 × 16                             | Solid `#191919`. Same mark as `icon-linkedin.svg` at a different size - ship one file.                                                                                                                                                                                                      |
| `icon-x.svg`                      | icon           | `183:76`   | X glyph, footer social row                                                              | 18 × 16                             | Solid `#191919`.                                                                                                                                                                                                                                                                            |
| `specs-waves.png`                 | raster         | `182:906`  | Wave wash inside the Specifications overlay                                             | 1544 × 440                          | Same source image as `footer-waves.png` - reuse the file. Render `opacity: 0.32`, `mix-blend-mode: soft-light`, bottom-anchored, centred.                                                                                                                                                   |
| `icon-close.svg`                  | icon           | `182:910`  | "x" close glyph, Specifications overlay                                                 | 24 × 24                             | Two 12 × 12 paths, stroke `1.6px #FFFFFF`.                                                                                                                                                                                                                                                  |

### Not assets - rebuild in HTML/CSS

These read as artwork but are structured UI. Do **not** export them as images:

- **The Specifications overlay** (`182:905` and its state twins). Labelled stat cells,
  rules and headings - all live text on a flat `#191919` panel. Full structure and copy in
  §3.
- **The segment control** (`181:549`) - three text buttons on a blurred pill.
- **The orbit ring** (`181:541`) - catalogued above so it can be fetched if needed, but
  the inline SVG in §3 is the better build: it keeps the 1px stroke crisp at every
  density and lets the mask scale.
- **Figure chips** - radial-gradient scrim plus text.
- **Bullet markers** - an 8px bordered box with a 4px glyph.
- **The FPO badge** (`182:2564`) - a production marker. Do not build or ship it.

### SVG rendering notes

| Asset                      | Spans                         | viewBox       | Rendered    | `preserveAspectRatio` | Container                                                |
| -------------------------- | ----------------------------- | ------------- | ----------- | --------------------- | -------------------------------------------------------- |
| `orbit-ring.svg`           | Neither - fixed 480px centred | `0 0 480 144` | `480 × 144` | `xMidYMid meet`       | Fleet panel, `overflow: hidden`, `position: relative`    |
| `icon-chevron.svg`         | contained                     | `0 0 16 16`   | `16 × 16`   | `xMidYMid meet`       | 40px circle, `overflow: visible` (glyphs overlap by 8px) |
| `icon-close.svg`           | contained                     | `0 0 24 24`   | `24 × 24`   | `xMidYMid meet`       | 40px button, `overflow: hidden`                          |
| `icon-linkedin.svg`        | contained                     | `0 0 16 16`   | `16 × 16`   | `xMidYMid meet`       | Card, absolute overlay                                   |
| `icon-youtube.svg`         | contained                     | `0 0 23 16`   | `23 × 16`   | `xMidYMid meet`       | Footer social row                                        |
| `icon-x.svg`               | contained                     | `0 0 18 16`   | `18 × 16`   | `xMidYMid meet`       | Footer social row                                        |
| `wordmark-clippership.svg` | contained                     | `0 0 157 28`  | `157 × 28`  | `xMidYMid meet`       | Hero title block / footer meta row                       |

**The raster backdrops are the full-bleed risk, not the SVGs.** `hero-sky.png`,
`hero-vessel.png`, `fleet-sky.png`, `fleet-backdrop.png` and `footer-waves.png` are all
substantially larger than their frames and are cropped by a parent with
`overflow: hidden`. Preserve both the overscale and the anchor
(`object-position`) for each - fitting them to their frames is the single most likely way
to lose the composition.

---

## 14. Content - verbatim, in document order

```
[Hero]
clippership                                    (wordmark)
AI compute at the maritime edge.               (NBSP between "the" and "maritime")
Autonomous vessels take AI compute onto the wide-open ocean, where clean energy and cooling are plentiful, and the red tape is thin.
                                               (NBSP between "the" and "wide-open")
Read the white paper

[How it works]
fig.01
fig.02
fig.03
fig.02
fig.05

[The fleet]
the roadmap
One architecture, three scales
Our roadmap starts with maritime edge compute and scales to fleets of 3MW vessels for AI inference
Specifications
October 2026
Mid-2027
This decade

[The fleet - Specifications overlay, state 1]
in the water today
10kW sense
& compute node
Lenght
12 meters
Onboard electrical
power
10kW
Compute
up to 8xH200
Cooling
heat-exchanged
seawater
Connectivity
Starlink Marine

[The fleet - Specifications overlay, state 2]
Mid-2007
250kW sense
& compute node
Lenght
24 meters
Onboard electrical
power
250 kW
Compute
up to 144xH200
Cooling
heat-exchanged
seawater
Connectivity
Bonded Starlink
(gigabit)

[The fleet - Specifications overlay, state 3]
Mid 2007
3MW sense
& compute node
Lenght
70 meters
Onboard electrical
power
3MW
Compute
up to 1600 accelerators
Cooling
heat-exchanged
seawater
Connectivity
multiple Bonded Starlink (gigabit+)

[About]
Clippership
One team, built across industries
Our team honed their trades at                 (NBSP between "their" and "trades")
Tesla
Jet Propulsion Laboratory
Canadian Special Forces
Mercedes-AMG Formula 1 Team
Microsoft
Damen Shipyards Group
Bay Ship and Yacht
CEO
Nico Cymbalist
Ex-Tesla, Mercedes-F1, Caltech
COO
Luca Cymbalist
Ex-Canadian Special Forces
CTO
Kai Matsuka
Ex-Tesla, JPL, Caltech
Our Team
FPO // Image Placeholder                       (production marker - DO NOT SHIP)

[Footer]
(c)2026 Clippership inc.                       (rendered uppercase)
hello@clippership.co                           (rendered as typed, lowercase)
clippership                                    (wordmark)
```

### Copy issues to raise with the client

| Where                       | Drawn as   | Likely intent                                |
| --------------------------- | ---------- | -------------------------------------------- |
| Specs overlay, all states   | `Lenght`   | `Length`                                     |
| Specs overlay, state 2 chip | `Mid-2007` | `Mid-2027`                                   |
| Specs overlay, state 3 chip | `Mid 2007` | `This decade` (matching the segment control) |
| Media strip, tile 4         | `fig.02`   | `fig.04` (duplicate; `fig.04` is skipped)    |

Reproduce all four exactly as drawn and flag them separately - do not silently correct
copy in the build.

---

## 15. Build checklist

- [ ] Content inset is `48px` on every section (12px panel + 36px padding, or a bare 48px gutter).
- [ ] Display line-height is exactly **1.0** on all three Exposure headings - no browser default of 1.2.
- [ ] Exposure ships at weight **450**, not 400 or 500.
- [ ] Every Matter / Exposure string is tracked `-0.04em` (`-0.02em` at 14px and 16px-on-dark); every Overpass Mono string `+0.01em` **and uppercase** - except the footer email.
- [ ] Non-breaking spaces preserved in the hero `h1`, the hero lead, and the trades intro.
- [ ] Both split-opacity leads carry their two colour runs and the scroll reveal.
- [ ] The negative gaps survive: `-12px` hero wordmark, `-8px` drag CTA.
- [ ] The media strip **overflows and clips** - it does not wrap.
- [ ] The orbit ring renders at `opacity: 0.12` with its two-window mask.
- [ ] Backer logos carry `mix-blend-mode: darken` **and** `opacity: 0.6`.
- [ ] Every panel's border is stated: fleet, footer and specs panels have **none**; tiles, cards and the photo carry the flattened `#ECECEC` hairline.
- [ ] Zero `box-shadow` anywhere on the page.
- [ ] The five oversized backdrops keep their overscale and `object-position`.
- [ ] The `FPO // Image Placeholder` badge and `#FF0000` are absent from the build.
- [ ] `prefers-reduced-motion: reduce` collapses the hero sequence, the text reveals and the marquee.
