---
version: alpha
name: Clippership
description: Editorial maritime-tech system - warm near-black display serif on white, hairline borders, frosted-glass pills, zero shadows.
colors:
  ink: "#291D1D"
  text: "#191919"
  surface: "#FFFFFF"
  surface-muted: "#F6F6F7"
  panel: "#E5E4E6"
  scrim: "#2B2626"
  on-dark: "#FFFFFF"
  text-strong: "#191919FF"
  text-secondary: "#191919A3"
  text-tertiary: "#19191999"
  text-quiet: "#1919197A"
  text-ghost: "#1919193D"
  border-hairline: "#19191914"
  border-rule: "#19191929"
  panel-wash: "#E5E4E652"
  glass-light: "#F6F6F729"
  glass-mid: "#F6F6F7A3"
  glass-white: "#FFFFFF66"
  scrim-chip: "#2B2626CC"
typography:
  display-xl:
    fontFamily: Exposure
    fontSize: 6.75rem
    fontWeight: 450
    lineHeight: 1
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Exposure
    fontSize: 5rem
    fontWeight: 450
    lineHeight: 1
    letterSpacing: -0.04em
  display-md:
    fontFamily: Exposure
    fontSize: 3rem
    fontWeight: 450
    lineHeight: 1
    letterSpacing: -0.04em
  lead:
    fontFamily: Matter
    fontSize: 1.5rem
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: -0.04em
  body:
    fontFamily: Matter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.24
    letterSpacing: -0.04em
  label:
    fontFamily: Matter
    fontSize: 0.875rem
    fontWeight: 600
    lineHeight: 1.143
    letterSpacing: -0.02em
  label-active:
    fontFamily: Matter
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.143
    letterSpacing: -0.02em
  eyebrow:
    fontFamily: Overpass Mono
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.01em
    textTransform: uppercase
  prose:
    fontFamily: Matter
    fontSize: 1.0625rem
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: -0.01em
  caption-mono:
    fontFamily: Overpass Mono
    fontSize: 0.5rem
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.01em
    textTransform: uppercase
rounded:
  xs: 2px
  sm: 4px
  md: 8px
  lg: 12px
  pill: 999px
spacing:
  3xs: 4px
  2xs: 8px
  xs: 12px
  sm: 16px
  smd: 20px
  md: 24px
  lg: 28px
  xlg: 32px
  xl: 36px
  2xl: 48px
  xxl: 56px
  3xl: 64px
  4xl: 96px
  5xl: 100px
  6xl: 148px
motion:
  easing:
    fluid: cubic-bezier(0.32, 0.72, 0, 1)
    out: cubic-bezier(0.22, 1, 0.36, 1)
    inout: cubic-bezier(0.65, 0, 0.35, 1)
  duration:
    fast: 160ms
    base: 360ms
    slow: 640ms
components:
  section-panel:
    background: "{colors.panel-wash}"
    radius: "{rounded.lg}"
    inset: "{spacing.xs}"
    padding: "{spacing.xl}"
  button-solid:
    background: "{colors.surface-muted}"
    color: "{colors.text-strong}"
    border: "{colors.border-hairline}"
    radius: "{rounded.pill}"
    paddingX: "{spacing.lg}"
    paddingY: "{spacing.xs}"
    height: 40px
    font: "{typography.label}"
  button-glass:
    background: "{colors.glass-light}"
    color: "{colors.text-secondary}"
    border: "{colors.border-hairline}"
    radius: "{rounded.pill}"
    backdropBlur: 4px
    height: 40px
    font: "{typography.label}"
  button-icon:
    background: "{colors.surface}"
    color: "{colors.text-strong}"
    radius: "{rounded.pill}"
    size: 40px
    iconSize: 16px
  segment-control:
    background: "{colors.glass-white}"
    radius: "{rounded.pill}"
    backdropBlur: 8px
    height: 40px
    padding: "{spacing.3xs}"
    gap: "{spacing.3xs}"
  segment-item:
    color: "{colors.text-strong}"
    radius: "{rounded.pill}"
    height: 32px
    paddingX: "{spacing.sm}"
    paddingY: "{spacing.2xs}"
    font: "{typography.label}"
  segment-item-active:
    background: "{colors.text}"
    color: "{colors.on-dark}"
    font: "{typography.label-active}"
  card:
    background: "{colors.surface}"
    border: "{colors.border-hairline}"
    ringColor: "{colors.surface}"
    radius: "{rounded.sm}"
    padding: "{spacing.md}"
    gap: "{spacing.lg}"
    iconSize: 16px
  media-tile:
    border: "{colors.border-hairline}"
    ringColor: "{colors.surface}"
    radius: "{rounded.md}"
  media-tile-inline:
    border: "{colors.border-hairline}"
    ringColor: "{colors.surface}"
    radius: "{rounded.sm}"
  figure-chip:
    background: "{colors.scrim-chip}"
    color: "{colors.on-dark}"
    font: "{typography.caption-mono}"
    paddingTop: "{spacing.md}"
    paddingLeft: "{spacing.md}"
  eyebrow:
    color: "{colors.text-strong}"
    font: "{typography.eyebrow}"
  bullet-item:
    color: "{colors.text-tertiary}"
    font: "{typography.body}"
    markerBorder: "{colors.border-hairline}"
    markerSize: 8px
    markerRadius: "{rounded.xs}"
    gap: "{spacing.2xs}"
  footer:
    background: "{colors.panel-wash}"
    radius: "{rounded.lg}"
    color: "{colors.text-strong}"
    font: "{typography.eyebrow}"
    ruleColor: "{colors.border-rule}"
    paddingX: "{spacing.xl}"
---

## Overview

Clippership is an editorial system for a maritime AI-compute company. It reads
like a print spread that happens to be a website: a high-contrast display serif
set enormous and tight, a quiet grotesque for everything else, and monospace
used as an instrument label rather than as code.

Three decisions define it:

1. **Photography is the background, not a block.** Full-bleed painted and
   photographic imagery sits behind whole sections. The chrome that floats over
   it has to stay legible without a solid box, so every control is translucent
   plus blurred rather than opaque.
2. **Hairlines instead of shadows.** There is not a single drop shadow in the
   design. Depth is drawn with a 1px `border-hairline` and a white ring, never
   with a blur under an element.
3. **One warm black, one neutral black.** Display type and the logo use the warm
   `ink` (`#291D1D`); body copy and UI use the neutral `text` (`#191919`). The
   difference is small on purpose and it is what makes the headlines feel
   printed rather than rendered.

Source of truth: Figma node `181:498` (`Index - 2.2`), file
`A9PHMFuLwB4yZHYR2W020Q`. The file publishes **no Figma Variables and no shared
styles**, so every token below was derived by walking the node tree over the
Figma REST API (exact fills, strokes, `style` blocks, `cornerRadius`,
`itemSpacing`, padding). Values are literal, not rounded.

## Colors

The palette is almost monochrome. Colour never carries meaning here; hierarchy
comes from **opacity of a single ink**, which is why the alpha ladder below is a
first-class part of the system rather than an implementation detail.

| Token           | Value     | Role                                                     |
| --------------- | --------- | -------------------------------------------------------- |
| `ink`           | `#291D1D` | Display headings, wordmark, bullet dot. Warm near-black. |
| `text`          | `#191919` | Body, UI, icons, borders. Neutral near-black.            |
| `surface`       | `#FFFFFF` | Page background, cards, round icon buttons.              |
| `surface-muted` | `#F6F6F7` | Solid button fill, radial washes, 3D navigator plate.    |
| `panel`         | `#E5E4E6` | Large section panels and the footer, always at 32%.      |
| `scrim`         | `#2B2626` | Radial scrim behind figure labels on photography.        |

### The alpha ladder

Every grey in the design is `#191919` at one of six opacities. Reproduce it with
`color-mix` or `rgb(25 25 25 / a)`, not with a new hex per step.

| Token             | Alpha | 8-digit     | Used for                                      |
| ----------------- | ----- | ----------- | --------------------------------------------- |
| `text-strong`     | 100%  | `#191919FF` | Eyebrows, button labels, names, footer meta.  |
| `text-secondary`  | 64%   | `#191919A3` | Hero CTA label, card role/credential lines.   |
| `text-tertiary`   | 60%   | `#19191999` | Bullet list entries (company names).          |
| `text-quiet`      | 48%   | `#1919197A` | Hero lead paragraph over bright sky.          |
| `text-ghost`      | 24%   | `#1919193D` | Ghosted run of the fleet lead paragraph.      |
| `border-rule`     | 16%   | `#19191929` | The horizontal rule in the footer meta block. |
| `border-hairline` | 8%    | `#19191914` | Every border in the system.                   |

Translucent surfaces follow the same logic on the light side:
`glass-light` `#F6F6F7` @16%, `glass-mid` `#F6F6F7` @64%,
`glass-white` `#FFFFFF` @40%, `panel-wash` `#E5E4E6` @32%.

### Why so few values

The design puts vivid, uncontrollable photography behind the content. Any real
brand colour would fight it. Holding the entire UI to one ink at varying opacity
means controls read correctly over a blue sky, a grey hangar and a white page
without per-context overrides.

**Not a token:** `#FF0000` @64% appears once on the "FPO // Image Placeholder"
label. It is a production marker, not part of the palette. Do not ship it.

## Typography

Three families, each with one job.

| Family                                   | Role                                 | Stack                                                          |
| ---------------------------------------- | ------------------------------------ | -------------------------------------------------------------- |
| **Exposure** (`Exposure-20`, weight 450) | Display headings only                | `"Exposure", "Exposure-20", Georgia, "Times New Roman", serif` |
| **Matter**                               | Body, leads, buttons, lists          | `"Matter", -apple-system, "Helvetica Neue", Arial, sans-serif` |
| **Overpass Mono** (Bold 700)             | Eyebrows, figure labels, footer meta | `"Overpass Mono", ui-monospace, "SF Mono", Menlo, monospace`   |

### Scale

| Token          | Size             | Weight | Line height    | Tracking           | Appears as                     |
| -------------- | ---------------- | ------ | -------------- | ------------------ | ------------------------------ |
| `display-xl`   | 108px / 6.75rem  | 450    | 1.0 (108px)    | -0.04em            | Hero headline                  |
| `display-lg`   | 80px / 5rem      | 450    | 1.0 (80px)     | -0.04em            | Section headline               |
| `display-md`   | 48px / 3rem      | 450    | 1.0 (48px)     | -0.04em            | Sub-section headline           |
| `lead`         | 24px / 1.5rem    | 500    | 1.18 (28.32px) | -0.04em            | Intro paragraphs, names        |
| `body`         | 16px / 1rem      | 400    | 1.24 (19.84px) | -0.04em            | Lists, credentials             |
| `prose`        | 17px / 1.0625rem | 400    | 1.55 (26.35px) | -0.01em            | White paper long-form text     |
| `label`        | 14px / 0.875rem  | 600    | 1.143 (16px)   | -0.02em            | Buttons, segment items         |
| `label-active` | 14px / 0.875rem  | 500    | 1.143 (16px)   | -0.02em            | Selected segment item          |
| `eyebrow`      | 12px / 0.75rem   | 700    | 1.0 (12px)     | +0.01em, uppercase | Section kickers, roles, footer |
| `caption-mono` | 8px / 0.5rem     | 700    | 1.0 (8px)      | +0.01em, uppercase | `fig.01` overlays              |

### The rules behind the numbers

- **Display line-height is exactly 1.0.** Headlines are meant to stack as a
  solid block with the two lines nearly touching. Do not let a browser default
  of 1.2 creep in.
- **Everything sans is tracked in, everything mono is tracked out.** Matter and
  Exposure run at `-0.04em` (`-0.02em` at 14px, where tight tracking starts to
  hurt button legibility). Overpass Mono runs at `+0.01em` and always uppercase,
  so it reads as a machine-stamped label next to the warm serif.
- **Weight 450 is intentional** on Exposure. It is an optical weight between
  Regular and Medium; rounding to 400 or 500 visibly changes the headline colour.
- **Discrepancy to watch:** two 24px lead paragraphs (hero intro `181:503`,
  fleet intro `181:560`) are set in `ArticulatCF-Regular` at weight 400 with
  identical metrics (28.32px / -0.96px) to the Matter-Medium leads elsewhere.
  Matter is the system family and covers 21 of 23 non-display text nodes. Build
  leads in **Matter Medium 500** and treat ArticulatCF as a stray substitution.

## Layout

- **Canvas 1440.** Page gutter is `12px` on each side, so the content frame is
  **1416px**. This 12px margin is what makes the rounded section panels read as
  inset cards rather than full-bleed bands.
- **Panel inner padding is 36px** (fleet header, footer content). Sections
  without a panel, such as About, use a **48px** gutter instead.
- **Grid gap is 24px.** The media strip, the backer logo row and the bullet
  columns all use it.
- **4px base unit.** Every spacing value in the file is a multiple of 4: 4, 8,
  12, 16, 20, 24, 28, 32, 36, 48, 56, 64, 96, 100, 148 - and the `spacing:` scale
  above carries a step for each, so nothing has to be written as a raw px value.
  The one outlier, `itemSpacing: 10` inside segment buttons, is inert (the label
  is the only child).
- **Sections are hug-height, not fixed.** Vertical rhythm comes from each
  section's internal padding, not from a fixed section height.
- **Negative gaps are deliberate.** The hero title block uses `itemSpacing: -12`
  to tuck the wordmark into the headline's ascender space, and the round CTA
  uses `-8` to overlap its two arrow glyphs. Keep them; they are optical, not
  errors.
- **The media strip overflows on purpose.** The "How it works" row is 2232px
  wide inside a 1440px frame. It is a horizontally scrolling / marquee strip,
  not a grid that failed to wrap.

## Elevation & Depth

There are **zero drop shadows** in this design. Depth is built four other ways,
and substituting a shadow for any of them breaks the look immediately.

1. **Hairline + white ring.** Cards and media tiles carry two strokes: an inner
   `#FFFFFF` ring and a `border-hairline` (`#191919` @8%), both 1px, aligned
   inside. Against white the hairline does the work; against photography the
   white ring separates the tile from the image behind it.
   ```css
   box-shadow:
     inset 0 0 0 1px #fff,
     inset 0 0 0 1px rgb(25 25 25 / 0.08);
   ```
2. **Backdrop blur.** Controls floating over imagery are translucent and
   blurred: `4px` on pill buttons, `8px` on the segment control. This is the
   only "lift" in the system.
3. **Radial washes.** A radial gradient from a colour at partial alpha to the
   same colour at zero, used to calm busy photography under text: the fleet
   panel uses `#F6F6F7` 64% at centre fading to 0%, and figure chips use
   `#2B2626` 80% fading to 0%.
4. **Opacity and blend.** Background imagery (fleet backdrop, footer waves) sits
   at `opacity: 0.64`. Backer logos use `mix-blend-mode: darken` so their white
   plates disappear into the footer panel.

A **noise texture** (grain, radius 8) is applied to the fleet backdrop. Reproduce
it as a tiling noise overlay; it is what keeps the large flat washes from
banding.

## Shapes

| Token  | Value | Applied to                                           |
| ------ | ----- | ---------------------------------------------------- |
| `xs`   | 2px   | 8px bullet markers                                   |
| `sm`   | 4px   | Team cards, inline imagery, backer logo slots        |
| `md`   | 8px   | Media strip tiles                                    |
| `lg`   | 12px  | Section panels, footer wrapper                       |
| `pill` | 999px | All buttons, the segment control, round icon buttons |

The radius rule is **proportional, not fixed**: small chrome gets a small radius,
containers get 12px, and anything interactive is fully round. In Figma the pill
values are authored as half the element height (20 on a 40px button, 32 on a
32px segment item, 40 on the 40px track), which is exactly `999px` in CSS.

## Motion

The Figma file contains **no prototype interactions and no keyframe animation**,
so motion is specified here rather than extracted. Keep it to one curve.

- **Feel: expo-out.** `--ease-fluid: cubic-bezier(0.32, 0.72, 0, 1)` moves fast
  and settles long, with **no overshoot and no bounce**. Springy motion would
  contradict a system built on print restraint and heavy machinery.
- **Durations:** `fast: 160ms` for hover and colour changes, `base: 360ms` for
  anything that moves or resizes, `slow: 640ms` for section reveals and the
  media strip.
- **Where transitions apply**
  - _Buttons:_ background and border-colour on hover at `fast`. Glass buttons
    raise their fill (`glass-light` towards `glass-mid`) and their label from
    `text-secondary` to `text-strong`. No lift, no scale.
  - _Segment control:_ the active black pill slides between items at `base` with
    `--ease-fluid`; the labels cross-fade. Animate the pill's position, do not
    fade two pills.
  - _Cards:_ border-colour from `border-hairline` toward `border-rule` at
    `fast`. The arrow glyph is the only element permitted to translate, by a few
    pixels.
  - _Media tiles:_ the image inside scales gently on hover at `slow` while the
    tile itself stays put, since `clipsContent` is on.
  - _Section reveals:_ fade plus a short upward translate at `slow`.
- Respect `prefers-reduced-motion: reduce` by collapsing every transition to an
  opacity change at `fast`.

## Components

### Section panel

`1416 × auto`, `panel-wash` (`#E5E4E6` @32%), radius `lg` (12px), inset 12px
from the viewport edge, 36px inner padding. Clips its contents so full-bleed
photography and washes stay inside the rounded corner. The footer is the same
component.

### Button (pill CTA)

40px tall, hug width, `20px / 12px` padding, radius `pill`, 1px
`border-hairline`, label in `label` (Matter SemiBold 14). Three fills for three
backdrops:

| Variant       | Fill                 | Label            | Blur | Context                 |
| ------------- | -------------------- | ---------------- | ---- | ----------------------- |
| `solid`       | `surface-muted` 100% | `text-strong`    | none | On a light panel        |
| `glass`       | `glass-light` (16%)  | `text-secondary` | 4px  | Over bright photography |
| `translucent` | `glass-mid` (64%)    | `text-strong`    | 4px  | Over dense photography  |

### Button (round icon)

`40 × 40`, `surface` white, radius `pill`, 16px icon, glyphs overlapped by -8px.
Used as the play / explore affordance on the 3D vessel.

### Segment control

40px track, radius `pill`, `glass-white` (`#FFFFFF` @40%) with an 8px backdrop
blur, 4px inset, 4px gap. Items are 32px tall, radius `pill`, `16px / 8px`
padding. The selected item takes a solid `text` (`#191919`) fill with a white
`label-active` (Matter Medium 14); unselected items are transparent with a
`text-strong` `label`.

### Card

`432 × auto`, `surface` white, radius `sm` (4px), 24px padding, 28px gap between
the identity block and the credential line. Double stroke (white ring +
hairline). A 16px glyph sits top-right, 24px from both edges. Card stacks use a
12px gap, tighter than the 24px grid gap, so a stack reads as one object.

### Media tile

Fixed-size frame, `clipsContent: true`, radius `md` (8px) in the horizontal
strip and `sm` (4px) for inline content imagery, double stroke as above. The
image inside is oversized and offset, so crop with `object-fit: cover` and an
explicit object-position rather than fitting the image to the frame.

### Figure chip

Sits at the top-left corner of a media tile. Radial `scrim-chip` (`#2B2626`
@80% fading to 0%) behind `caption-mono` text in white, offset 24px from the top
and left. Labels are literal figure numbers (`fig.01`, `fig.02`), which is what
makes the photography read as documentation rather than decoration.

### Eyebrow

`eyebrow` type (Overpass Mono Bold 12, uppercase, +0.01em) in `text-strong`,
16px above a display heading (12px in tighter blocks). Names the section in one
or two words before the headline states the idea.

### Bullet item

20px tall row, 8px gap. The marker is an 8px square with radius `xs` and a
`border-hairline` stroke containing a tiny arrow glyph. Label in `body` at
`text-tertiary`. Lists run in two equal columns at 24px column gap, 8px row gap.

### Footer

Panel component with a backer logo row on top (36px side padding, 48px top,
`128 × 36` slots at 24px gap, logos in `mix-blend-mode: darken`), then a
three-part content row: meta block left (copyright, 1px `border-rule` rule,
email, all `eyebrow`), centred 157×28 wordmark, and social icons right at 24px
gap and 80% opacity.

## Do's and Don'ts

**Do**

- Use `ink` (`#291D1D`) for display type and the wordmark, `text` (`#191919`)
  for everything else. The warm/neutral split is the signature.
- Derive every grey from the alpha ladder on `#191919`.
- Draw separation with the 1px hairline and the white ring together.
- Keep display line-height locked at 1.0 and tracking at -0.04em.
- Set every mono label uppercase with positive tracking.
- Let photography run full-bleed behind sections and float translucent, blurred
  chrome over it.
- Keep all interactive shapes fully round and all container shapes at 12px.

**Don't**

- Don't add drop shadows. Not to cards, not to buttons, not to modals. If
  something needs to lift, use backdrop blur and a translucent fill.
- Don't introduce a brand accent colour. The design deliberately has none, and
  the imagery supplies all the colour.
- Don't ship `#FF0000` @64%; that label is a placeholder marker.
- Don't set body copy in Exposure, or headlines in Matter. Exposure is display
  only, at 48px and above.
- Don't round the 450 display weight to 400 or 500.
- Don't normalise the negative gaps (`-12px` on the hero title, `-8px` on the
  round CTA) to zero; they are optical corrections.
- Don't make the media strip wrap into a grid. It is a 2232px overflowing row.
- Don't use opaque white boxes over photography where a glass button belongs.
- Don't add bounce, overshoot or spring. One expo-out curve, everywhere.
