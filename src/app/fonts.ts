import { Inter, Newsreader, Overpass_Mono } from "next/font/google";

/**
 * Clippership runs three families, each with one job (DESIGN.md to Typography):
 *
 *   Exposure       display headings only, optical weight 450
 *   Matter         body, leads, buttons, lists
 *   Overpass Mono  eyebrows, figure labels, footer meta - always uppercase, +0.01em
 *
 * Exposure and Matter are licensed faces. Until their WOFF2s are dropped into
 * `src/assets/fonts/` (and wired up here with `next/font/local`, alongside their
 * licence note), the token stacks in `globals.css` name them first and fall back
 * to the closest self-hosted web faces below - never to a bare system stack.
 *
 *   Exposure to Newsreader  warm editorial serif, variable weight so 450 is real
 *   Matter   to Inter       neutral grotesque at matching weights (400/500/600)
 *
 * Overpass Mono is the real face, straight from Google Fonts.
 */
export const displayFace = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display-face",
  style: ["normal"],
});

export const sansFace = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans-face",
});

export const monoFace = Overpass_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-face",
});

export const fontVariables = [
  displayFace.variable,
  sansFace.variable,
  monoFace.variable,
].join(" ");
