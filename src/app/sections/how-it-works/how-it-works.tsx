import Image, { type StaticImageData } from "next/image";
import type { CSSProperties } from "react";

import photo01 from "@/app/(home)/assets/how-it-works-01.jpg";
import photo02 from "@/app/(home)/assets/how-it-works-02.jpg";
import photo03 from "@/app/(home)/assets/how-it-works-03.jpg";
import photo04 from "@/app/(home)/assets/how-it-works-04.jpg";
import photo05 from "@/app/(home)/assets/how-it-works-05.jpg";

import styles from "./how-it-works.module.css";

/**
 * A single horizontally overflowing strip of five photographs. No heading, no
 * eyebrow, no body copy: the figure chips are the only text.
 *
 * Tile widths in order are 546 / 320 / 404 / 320 / 546, all 404 tall, which makes
 * one run 2232px wide inside a 1416px frame. It overflows and is clipped on
 * purpose. Do not let it wrap into a grid.
 *
 * Per spec §6.3 the strip is a continuously scrolling marquee, not a grid that
 * failed to wrap: the run is duplicated and the track translates by exactly one
 * run, pausing on hover. The 24px inter-tile gap is a right margin on each tile
 * (not `gap` on the track) so that one run is exactly 50% of the track - see the
 * CSS module for why that matters.
 *
 * The chips read fig.01, fig.02, fig.03, fig.02, fig.05 - tile 4 repeats fig.02
 * and fig.04 is skipped. That is how it is drawn; reproduced verbatim and raised
 * as a copy fix rather than silently corrected.
 *
 * Each photo is a Figma rect that is LARGER than its tile and sits at a negative
 * offset, so only part of it shows (the spec lists those offsets as
 * `object-position: -13px 0` and so on). Rather than hard-code px offsets that
 * only hold at 404px tall, every crop is expressed as a percentage of the tile
 * box - rect-size / tile-size and offset / tile-size - so it survives the tile
 * shrinking to `62vw` on mobile.
 */
type Tile = {
  chip: string;
  label: string;
  photo: StaticImageData;
  ratio: string;
  /** Rect box and offset, both as a percentage of the tile box. */
  crop: { w: string; h: string; x: string; y: string };
  /** Figma ids: the Image frame, its rect fill and the chip frame. */
  ids: { frame: string; image: string; chip: string };
};

const TILES: Tile[] = [
  {
    chip: "fig.01",
    label: "Vessel at sea below the Golden Gate Bridge",
    photo: photo01,
    ratio: "aspect-546/404",
    // rect 729x423 at (-13, 0) inside a 546x404 tile
    crop: { w: "133.516%", h: "104.703%", x: "-2.381%", y: "0%" },
    ids: { frame: "181:726", image: "247:662", chip: "181:751" },
  },
  {
    chip: "fig.02",
    label: "Operator at a laptop on deck, branded sail behind",
    photo: photo02,
    ratio: "aspect-320/404",
    // rect 408x544 at (-44, -70) inside a 320x404 tile
    crop: { w: "127.5%", h: "134.653%", x: "-13.75%", y: "-17.327%" },
    ids: { frame: "181:765", image: "235:614", chip: "181:769" },
  },
  {
    chip: "fig.03",
    label: "Hull section under construction in a hangar",
    photo: photo03,
    ratio: "aspect-404/404",
    // rect 538x404 at (4, 0) inside a 404x404 tile
    crop: { w: "133.168%", h: "100%", x: "0.99%", y: "0%" },
    ids: { frame: "235:616", image: "235:629", chip: "235:618" },
  },
  {
    chip: "fig.02",
    label: "Vessel on a travel-lift at a marina dock",
    photo: photo04,
    ratio: "aspect-320/404",
    // rect 492x656 at (-79, -101) inside a 320x404 tile
    crop: { w: "153.75%", h: "162.376%", x: "-24.688%", y: "-25%" },
    ids: { frame: "235:622", image: "235:627", chip: "235:624" },
  },
  {
    chip: "fig.05",
    label: "Vessel under sail in open ocean, monochrome",
    photo: photo05,
    ratio: "aspect-546/404",
    // rect 837x1116 at (-291, -363) inside a 546x404 tile
    crop: { w: "153.297%", h: "276.238%", x: "-53.297%", y: "-89.851%" },
    ids: { frame: "247:657", image: "247:658", chip: "247:659" },
  },
];

/** One run of the five tiles. Rendered twice; the second run is decorative. */
function TileRun({
  className = "",
  decorative = false,
  figmaId,
}: {
  className?: string;
  decorative?: boolean;
  figmaId?: string;
}) {
  return (
    <div
      aria-hidden={decorative || undefined}
      data-figma-id={figmaId}
      className={`flex items-center ${className}`}
    >
      {TILES.map(({ chip, label, photo, ratio, crop, ids }, index) => (
        <figure
          key={`${chip}-${index}`}
          data-figma-id={decorative ? undefined : ids.frame}
          style={{ "--enter": index } as CSSProperties}
          className={`${styles.enter} border-border-flat relative mr-6 h-[min(404px,62vw)] shrink-0 snap-start overflow-hidden rounded-md border max-md:last:mr-0 md:mr-6 md:h-[404px] md:snap-align-none ${ratio}`}
        >
          <div
            data-figma-id={decorative ? undefined : ids.image}
            className={styles.crop}
            style={
              {
                "--crop-w": crop.w,
                "--crop-h": crop.h,
                "--crop-x": crop.x,
                "--crop-y": crop.y,
              } as CSSProperties
            }
          >
            <Image
              src={photo}
              alt=""
              fill
              sizes="(min-width: 768px) 546px, 62vw"
              className="object-cover"
            />
          </div>
          <figcaption
            data-figma-id={decorative ? undefined : ids.chip}
            className="chip-scrim text-caption-mono text-on-dark pointer-events-none absolute top-0 left-0 flex items-center justify-center pt-6 pr-8 pb-8 pl-6 font-mono uppercase opacity-64"
          >
            <span className="sr-only">{label}, </span>
            {chip}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      data-section="how-it-works"
      data-figma-id="181:508"
      className={`${styles.marquee} bg-surface w-full snap-x snap-mandatory scroll-p-3 scrollbar-none overflow-x-auto p-3 md:snap-none md:overflow-hidden`}
    >
      <div className={`${styles.track} flex w-max items-center`}>
        <TileRun figmaId="181:764" />
        {/* The seamless second run. Decorative: the first run carries the labels. */}
        <TileRun decorative className="hidden md:flex" />
      </div>
    </section>
  );
}
