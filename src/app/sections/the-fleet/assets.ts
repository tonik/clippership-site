/**
 * Raster fills for the fleet panel, mirrored from Figma into `(home)/assets`.
 * Local (same-origin) on purpose: the painted sea and the blot are uploaded as
 * WebGL textures by the watercolour stage, and a cross-origin image would taint
 * the canvas.
 */
import blot from "@/app/(home)/assets/fleet-blot.png";
import sea from "@/app/(home)/assets/fleet-sea.png";
import vessel from "@/app/(home)/assets/vessel-october-2026.png";

/** Painted sea, Figma 181:538 - natural 1024 x 687, drawn at opacity 0.64. */
export const FLEET_SEA = sea;

/**
 * Watercolour blot, Figma 181:537 - natural 3426 x 2748. Despite the spec
 * calling it "fleet-sky", it is not a visible layer: it is the alpha mask over
 * the whole BG group, and it is what gives the panel its torn painted edge.
 */
export const FLEET_BLOT = blot;

/**
 * Grey 3D vessel render, Figma 181:540 - transparent PNG, square, drawn at
 * 400 x 400. Reused by the Specifications overlay (247:1082).
 */
export const VESSEL_RENDER = vessel;
