import type { StaticImageData } from "next/image";
import orbitRing from "@/app/(home)/assets/orbit-ring.svg";
import orbitRingWide from "@/app/(home)/assets/orbit-ring-wide.svg";
import vesselMid2027 from "@/app/(home)/assets/vessel-mid-2027.png";
import vesselThisDecade from "@/app/(home)/assets/vessel-this-decade.png";
import { VESSEL_RENDER } from "./assets";

/**
 * The three roadmap scales. The segment control selects between them and the
 * Specifications overlay renders the selected one.
 *
 * Copy is verbatim from the design (Figma 182:782 / 247:877 / 247:975), including
 * four known defects that are drawn that way and are flagged to the client rather
 * than silently corrected here:
 *   - "Lenght" is misspelled in all three states (should be "Length").
 *   - The state 2 chip reads "Mid-2007" where the segment control says "Mid-2027".
 *   - The state 3 chip reads "Mid 2007" where the segment control says "This decade".
 * Multi-line values are explicit line separators in the source, not wraps.
 */
export type RoadmapStat = {
  label: string[];
  value: string[];
};

/**
 * The vessel drawn for one state. Each scale has its own render at its own size,
 * so the geometry is stored as fractions of the 400px viewer box (panel) and as
 * the drawn px box inside the 912 x 752 Detail frame (Specifications overlay).
 */
export type RoadmapRender = {
  src: StaticImageData | string;
  alt: string;
  /** Figma node on the panel (181:540 / 247:1078 / 247:1059). */
  figmaId: string;
  /** Drawn size / 400 (400 / 420 / 532). */
  scale: number;
  /** Centre offset below the panel centre, as a fraction of the 400px box. */
  offsetY: number;
  /** Figma node in the Specifications overlay (247:1082 / 247:1080 / 247:1075). */
  specsFigmaId: string;
  /** Drawn box inside the Detail frame, px: size, left, top. */
  specs: { size: number; left: number; top: number };
};

export type RoadmapState = {
  segment: string;
  /** Figma node of this state's segment button, so the loop can measure the track. */
  figmaId: string;
  /**
   * Drawn width of this state's segment item (Figma: 120 / 124 / 124 inside a
   * 384 x 40 track). Applied as a min-width from the tablet frame up, so the track
   * reaches its drawn measure instead of collapsing to whatever the label hugs.
   */
  segmentWidth: string;
  render: RoadmapRender;
  /**
   * Orbit ring for this state. States 2 and 3 carry a larger vessel, so Figma
   * widens the ring's cut-out from 294px to 356px (arcs 93px -> 62px long).
   */
  ring: StaticImageData;
  chip: string;
  heading: string[];
  lengthLabel: string;
  lengthValue: string;
  stats: RoadmapStat[];
};

export const ROADMAP: RoadmapState[] = [
  {
    segment: "October 2026",
    figmaId: "181:550",
    segmentWidth: "7.5rem" /* 120px */,
    render: {
      src: VESSEL_RENDER,
      alt: "Clippership 10kW vessel, grey 3D render",
      figmaId: "181:540",
      scale: 1,
      offsetY: 0,
      specsFigmaId: "247:1082",
      specs: { size: 400, left: 24, top: 186 },
    },
    ring: orbitRing,
    chip: "in the water today",
    heading: ["10kW sense", "& compute node"],
    lengthLabel: "Lenght",
    lengthValue: "12 meters",
    stats: [
      { label: ["Onboard electrical", "power"], value: ["10kW"] },
      { label: ["Compute"], value: ["up to 8xH200"] },
      { label: ["Cooling"], value: ["heat-exchanged", "seawater"] },
      { label: ["Connectivity"], value: ["Starlink Marine"] },
    ],
  },
  {
    segment: "Mid-2027",
    figmaId: "181:552",
    segmentWidth: "7.75rem" /* 124px */,
    render: {
      src: vesselMid2027,
      alt: "Clippership 250kW vessel, grey 3D render",
      figmaId: "247:1078",
      scale: 420 / 400,
      offsetY: 34 / 400,
      specsFigmaId: "247:1080",
      specs: { size: 420, left: 21, top: 182 },
    },
    ring: orbitRingWide,
    chip: "Mid-2007",
    heading: ["250kW sense", "& compute node"],
    lengthLabel: "Lenght",
    lengthValue: "24 meters",
    stats: [
      { label: ["Onboard electrical", "power"], value: ["250 kW"] },
      { label: ["Compute"], value: ["up to 144xH200"] },
      { label: ["Cooling"], value: ["heat-exchanged", "seawater"] },
      { label: ["Connectivity"], value: ["Bonded Starlink", "(gigabit)"] },
    ],
  },
  {
    segment: "This decade",
    figmaId: "181:554",
    segmentWidth: "7.75rem" /* 124px */,
    render: {
      src: vesselThisDecade,
      alt: "Clippership 3MW vessel, grey 3D render",
      figmaId: "247:1059",
      scale: 532 / 400,
      offsetY: 0,
      specsFigmaId: "247:1075",
      specs: { size: 444, left: 6, top: 154 },
    },
    ring: orbitRingWide,
    chip: "Mid 2007",
    heading: ["3MW sense", "& compute node"],
    lengthLabel: "Lenght",
    lengthValue: "70 meters",
    stats: [
      { label: ["Onboard electrical", "power"], value: ["3MW"] },
      { label: ["Compute"], value: ["up to 1600 accelerators"] },
      { label: ["Cooling"], value: ["heat-exchanged", "seawater"] },
      {
        label: ["Connectivity"],
        value: ["multiple Bonded Starlink (gigabit+)"],
      },
    ],
  },
];
