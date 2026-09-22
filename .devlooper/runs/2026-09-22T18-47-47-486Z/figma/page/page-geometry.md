# Figma geometry — exact per-section values (auto-layout, borders, effects, fonts)

Pulled directly from the Figma node tree, so these values are exact where the reference
image can only approximate. Build each LAYOUT container as the stated flexbox; only
elements listed under OVERLAYS are absolutely positioned; copy the exact STYLING
(borders, shadows, fonts) — those are values you cannot eyeball.
Each section lists its desktop geometry and, where the designer supplied a mobile/tablet
mock, that section at those breakpoints too — build responsively to all of them.

## Section `hero`

### desktop

Section frame: 1440×1280

LAYOUT — build these containers as flexbox (exact, from Figma auto-layout):
- Text (FRAME) [181:502]: flex column, gap 24, padding 0 48 0 0, sizing fixed/hug
- CTA (FRAME) [181:708]: flex row, gap 24, padding 12 20 12 20, align center, sizing hug/fixed
- Title (FRAME) [181:505]: flex column, gap -12, justify center, align center, sizing fixed/hug

STYLING — exact values (match these; placement follows from layout + the screenshot):
- Frame 1 (FRAME) [181:500]: border radius 0 0 12 12 (tl tr br bl)
- Design-Modification 1 (RECTANGLE) [181:671]: background: image fill, object-fit cover
- vessel-new 1 (RECTANGLE) [247:655]: background: image fill, object-fit cover
- "Autonomous vessels take AI compute onto " [181:503]: ArticulatCF-Regular 24/400 lh 28 ls -0.96 color rgba(25,25,25,0.48)
- CTA (FRAME) [181:708]: border 1px rgba(25,25,25,0.08) radius 20; backdrop-blur 4
- "Read the white paper" [181:709]: Matter-SemiBold 14/600 lh 16 ls -0.28 color rgba(25,25,25,0.64)
- Logo (RECTANGLE) [235:422]: background: image fill, object-fit cover
- "AI compute at the maritime edge." [181:507]: Exposure-20 108/450 lh 108 ls -4.32 align center color #291d1d

(3 of 12 elements use auto-layout. This is a RESPONSIVE build: use flexbox/flow; absolute-position ONLY the overlays above. Where a region has no auto-layout, infer the flow from the screenshot — never pin by coordinates.)

## Section `how-it-works`

### desktop

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

## Section `the-fleet`

### desktop

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

## Section `about`

### desktop

Section frame: 1440×948

LAYOUT — build these containers as flexbox (exact, from Figma auto-layout):
- Header (FRAME) [182:2343]: flex column, gap 12, padding 0 0 64 0, sizing fixed/hug
- Header (FRAME) [247:670]: flex column, gap 16, padding 24 0 0 0, sizing fixed/hug
- Text (FRAME) [247:707]: flex column, gap 8, sizing fill/hug
- Line (FRAME) [247:679]: flex row, gap 24, sizing fill/hug
- Bullet (FRAME) [247:718]: flex row, gap 8, justify center, align center, sizing fill/hug
- Bullet (FRAME) [247:723]: flex row, gap 8, justify center, align center, sizing fill/hug
- Line (FRAME) [247:757]: flex row, gap 24, sizing fill/hug
- Bullet (FRAME) [247:758]: flex row, gap 8, justify center, align center, sizing fill/hug
- Bullet (FRAME) [247:763]: flex row, gap 8, justify center, align center, sizing fill/hug
- Line (FRAME) [247:769]: flex row, gap 24, sizing fill/hug
- Bullet (FRAME) [247:770]: flex row, gap 8, justify center, align center, sizing fill/hug
- Bullet (FRAME) [247:775]: flex row, gap 8, justify center, align center, sizing fill/hug
- Line (FRAME) [247:781]: flex row, gap 24, sizing fill/hug
- Bullet (FRAME) [247:782]: flex row, gap 8, justify center, align center, sizing fill/hug
- Frame 4 (FRAME) [182:2561]: flex row, gap 4, padding 24 64 32 24, justify center, align center, sizing hug/hug
- CTA (FRAME) [182:2564]: flex row, gap 24, padding 12 20 12 20, align center, sizing hug/fixed
- Frame 14 (FRAME) [182:1898]: flex column, gap 12, align flex-end, sizing fixed/hug
- Card (FRAME) [182:1880]: flex column, gap 28, padding 24 24 24 24, sizing fixed/hug
- Text (FRAME) [182:1881]: flex column, gap 8, sizing fill/hug
- Top (FRAME) [182:1882]: flex row, gap 4, align center, sizing fill/hug
- Text (FRAME) [182:1886]: flex row, gap 4, align center, sizing fill/hug
- Card (FRAME) [182:1889]: flex column, gap 28, padding 24 24 24 24, sizing fixed/hug
- Text (FRAME) [182:1890]: flex column, gap 8, sizing fill/hug
- Top (FRAME) [182:1891]: flex row, gap 4, align center, sizing fill/hug
- Text (FRAME) [182:1895]: flex row, gap 4, align center, sizing fill/hug
- Card (FRAME) [182:1899]: flex column, gap 28, padding 24 24 24 24, sizing fixed/hug
- Text (FRAME) [182:1900]: flex column, gap 8, sizing fill/hug
- Top (FRAME) [182:1901]: flex row, gap 4, align center, sizing fill/hug
- Text (FRAME) [182:1905]: flex row, gap 4, align center, sizing fill/hug

STYLING — exact values (match these; placement follows from layout + the screenshot):
- "Clippership" [182:2344]: OverpassMono-Bold 12/700 lh 12 ls 0.12 UPPERCASE color #191919; opacity 0.6
- "One team, built across industries" [182:2345]: Exposure-20 48/450 lh 48 ls -1.92 color #291d1d
- "Our team honed their trades at" [247:673]: Matter-Medium 24/500 lh 28 ls -0.96 color #191919
- Bullet (FRAME) [247:719]: border 1px rgba(25,25,25,0.08) radius 2
- "Tesla" [247:675]: Matter-Regular 16/400 lh 20 ls -0.64 color rgba(25,25,25,0.60)
- Bullet (FRAME) [247:799]: border 1px rgba(25,25,25,0.08) radius 2
- "Jet Propulsion Laboratory" [247:677]: Matter-Regular 16/400 lh 20 ls -0.64 color rgba(25,25,25,0.60)
- Bullet (FRAME) [247:807]: border 1px rgba(25,25,25,0.08) radius 2
- "Canadian Special Forces" [247:762]: Matter-Regular 16/400 lh 20 ls -0.64 color rgba(25,25,25,0.60)
- Bullet (FRAME) [247:810]: border 1px rgba(25,25,25,0.08) radius 2
- "Mercedes-AMG Formula 1 Team" [247:767]: Matter-Regular 16/400 lh 20 ls -0.64 color rgba(25,25,25,0.60)
- Bullet (FRAME) [247:818]: border 1px rgba(25,25,25,0.08) radius 2
- "Microsoft" [247:774]: Matter-Regular 16/400 lh 20 ls -0.64 color rgba(25,25,25,0.60)
- Bullet (FRAME) [247:815]: border 1px rgba(25,25,25,0.08) radius 2
- "Damen Shipyards Group" [247:779]: Matter-Regular 16/400 lh 20 ls -0.64 color rgba(25,25,25,0.60)
- Bullet (FRAME) [247:823]: border 1px rgba(25,25,25,0.08) radius 2
- "Bay Ship and Yacht" [247:786]: Matter-Regular 16/400 lh 20 ls -0.64 color rgba(25,25,25,0.60)
- Image (FRAME) [182:2559]: border 1px rgba(255,255,255,1.00) radius 4
- IMG_1542.jpeg 1 (RECTANGLE) [182:2560]: background: image fill, object-fit cover
- "Our Team" [182:2562]: OverpassMono-Bold 8/700 lh 8 ls 0.08 UPPERCASE color #191919; opacity 0.6
- CTA (FRAME) [182:2564]: border 1px rgba(25,25,25,0.08) radius 20; backdrop-blur 4
- "FPO // Image Placeholder" [182:2565]: Matter-SemiBold 14/600 lh 16 ls -0.28 color rgba(255,0,0,0.64)
- Card (FRAME) [182:1880]: border 1px rgba(255,255,255,1.00) radius 4
- "CEO" [182:1885]: OverpassMono-Bold 12/700 lh 12 ls 0.12 UPPERCASE color #191919; opacity 0.6
- "Nico Cymbalist" [182:1883]: Matter-Medium 24/500 lh 28 ls -0.96 color #191919
- "Ex-Tesla, Mercedes-F1, Caltech" [182:1887]: Matter-Regular 16/400 lh 20 ls -0.64 color rgba(25,25,25,0.64)
- Card (FRAME) [182:1889]: border 1px rgba(255,255,255,1.00) radius 4
- "COO" [182:1894]: OverpassMono-Bold 12/700 lh 12 ls 0.12 UPPERCASE color #191919; opacity 0.6
- "Luca Cymbalist" [182:1892]: Matter-Medium 24/500 lh 28 ls -0.96 color #191919
- "Ex-Canadian Special Forces" [182:1896]: Matter-Regular 16/400 lh 20 ls -0.64 color rgba(25,25,25,0.64)
- Card (FRAME) [182:1899]: border 1px rgba(255,255,255,1.00) radius 4
- "CTO" [182:1904]: OverpassMono-Bold 12/700 lh 12 ls 0.12 UPPERCASE color #191919; opacity 0.6
- "Kai Matsuka" [182:1902]: Matter-Medium 24/500 lh 28 ls -0.96 color #191919
- "Ex-Tesla, JPL, Caltech" [182:1906]: Matter-Regular 16/400 lh 20 ls -0.64 color rgba(25,25,25,0.64)

(29 of 59 elements use auto-layout. This is a RESPONSIVE build: use flexbox/flow; absolute-position ONLY the overlays above. Where a region has no auto-layout, infer the flow from the screenshot — never pin by coordinates.)

## Section `footer`

### desktop

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