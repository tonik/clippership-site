---
name: build-a-section
description: Build or change a page section in this repo, following its conventions.
---

# Build a section

1. **Read the conventions first**: `docs/styling.md` (tokens, type, motion) and `docs/architecture.md`
   (sections, server vs client).
2. **Look for an existing component** in `src/components/` that is close to what you need and copy it as
   the starting point. Consistency comes from reuse, not from writing every section from scratch.
3. **Build it as a server component.** If part of it needs state or handlers, extract just that part
   into a small `'use client'` child.
4. **Style with tokens.** Colour and type from the tokens in `globals.css`; arbitrary values only for
   layout. No inline styles, no pasted SVG.
5. **Place it** in the page's section stack in the order the design shows.
6. **Verify**: `npm run lint` and `npm run typecheck` must both pass, and `npm run build` must succeed.
