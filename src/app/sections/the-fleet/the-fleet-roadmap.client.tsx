"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { IconChevron } from "@/components/icons";
import { ROADMAP } from "./roadmap";
import styles from "./the-fleet.module.css";
import { TheFleetSpecs } from "./the-fleet-specs.client";
import { useFleetStage } from "./the-fleet-stage.client";
import {
  type FleetVesselsHandle,
  TheFleetVessels,
} from "./the-fleet-vessels.client";

/** Drawn geometry of the first segment, so the pill is already in the right place
 *  on the server render and only gets refined once the labels have measured. */
const INITIAL_PILL = { x: 4, w: 120 };
const KEY_STEP = Math.PI / 12;

export function TheFleetRoadmap() {
  const [active, setActive] = useState(0);
  const [specsOpen, setSpecsOpen] = useState(false);
  /* Kept mounted through the close wipe; unmounted once it has played out. */
  const [specsMounted, setSpecsMounted] = useState(false);
  const { morphTo } = useFleetStage();
  const [pill, setPill] = useState(INITIAL_PILL);
  const trackRef = useRef<HTMLDivElement>(null);
  const vesselsRef = useRef<FleetVesselsHandle>(null);
  const dragX = useRef<number | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragX.current = e.clientX;
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current;
    dragX.current = e.clientX;
    vesselsRef.current?.drag(dx, e.currentTarget.clientWidth);
  };
  const onPointerUp = () => {
    if (dragX.current === null) return;
    dragX.current = null;
    vesselsRef.current?.release();
  };
  const onHandleKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    vesselsRef.current?.nudge(e.key === "ArrowLeft" ? -KEY_STEP : KEY_STEP);
  };

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const item = track.querySelectorAll<HTMLElement>("[data-segment]")[active];
    if (!item) return;
    setPill({ x: item.offsetLeft, w: item.offsetWidth });
  }, [active]);

  const closeSpecs = useCallback(() => setSpecsOpen(false), []);
  const specsExited = useCallback(() => setSpecsMounted(false), []);
  const openSpecs = () => {
    setSpecsMounted(true);
    setSpecsOpen(true);
  };
  const select = (index: number) => {
    if (index === active) return;
    setActive(index);
    morphTo(index);
  };

  return (
    <>
      <div className="relative z-10 flex h-full flex-col gap-10 p-6 md:p-9 lg:grid lg:grid-cols-[minmax(0,660px)_minmax(0,1fr)_minmax(0,384px)] lg:grid-rows-[auto_1fr_auto] lg:gap-0">
        <header
          data-figma-id="181:556"
          style={{ "--enter": 0 } as CSSProperties}
          className={`${styles.enter} relative z-10 flex flex-col gap-4 lg:col-start-1 lg:row-start-1`}
        >
          <p
            data-figma-id="181:557"
            className="text-eyebrow text-text-strong font-mono uppercase opacity-60"
          >
            the roadmap
          </p>
          <h2
            data-figma-id="181:558"
            className="text-display-lg font-display text-ink"
          >
            One architecture, three scales
          </h2>
        </header>

        {/* The 3D navigator. A true overlay on desktop: three layers all centred
            on the panel's centre point. Below lg it sits in flow, so it reserves
            the bleed of the largest render (532 on a 400 box = 16.5% per side)
            and the column does not jump when the scale changes. */}
        <div className="pointer-events-none relative grid place-items-center py-[calc(min(400px,62vw)*0.165)] lg:absolute lg:inset-0 lg:py-0">
          <div
            data-fleet-viewer
            style={{ "--enter": 1 } as CSSProperties}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            className={`${styles.enter} ${styles.enterVessel} pointer-events-auto relative grid size-[min(400px,62vw)] cursor-grab touch-pan-y place-items-center select-none active:cursor-grabbing lg:size-[min(400px,27.78vw)]`}
          >
            <TheFleetVessels active={active} ref={vesselsRef} />
            {[...new Set(ROADMAP.map((state) => state.ring))].map((ring) => (
              <Image
                key={ring.src}
                src={ring}
                alt=""
                aria-hidden
                width={480}
                height={93}
                data-active={ring === ROADMAP[active].ring}
                className={`${styles.swapRing} pointer-events-none absolute top-1/2 left-1/2 h-auto w-[120%] max-w-none -translate-x-1/2 -translate-y-1/2`}
              />
            ))}
            <button
              type="button"
              aria-label="Drag to rotate the vessel, or use the arrow keys"
              onKeyDown={onHandleKey}
              data-figma-id="181:546"
              className="bg-surface rounded-pill text-text-strong pointer-events-auto absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center -space-x-2 active:cursor-grabbing"
            >
              {/* Figma 181:547 / 181:548 stack two 16px `fi:arrow-up` glyphs with
                  gap -8. The glyph's ink is NOT centred in its box (apex y 3.33,
                  arms y 8), so rotating it throws the ink to the outer edge of each
                  box - that is what opens the 8px gap and makes the pair read as a
                  horizontal drag cue rather than a closed diamond. */}
              <IconChevron
                width={16}
                height={16}
                className="size-4 -rotate-90"
              />
              <IconChevron
                width={16}
                height={16}
                className="size-4 rotate-90"
              />
            </button>
          </div>
        </div>

        <div
          data-figma-id="181:559"
          className={`${styles.textColumn} relative z-10 flex flex-col gap-12 lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:self-center`}
        >
          <p
            data-figma-id="181:560"
            style={{ "--enter": 2 } as CSSProperties}
            className={`${styles.enter} text-lead text-text-strong font-sans`}
          >
            Our roadmap starts with maritime edge compute{" "}
            <span className="text-text-ghost">
              and scales to fleets of 3MW vessels for AI inference
            </span>
          </p>
          <div
            style={{ "--enter": 3 } as CSSProperties}
            className={styles.enter}
          >
            <button
              type="button"
              onClick={openSpecs}
              aria-expanded={specsOpen}
              data-figma-id="181:561"
              className="bg-surface-muted border-border-hairline hover:border-border-rule rounded-pill text-label text-text-strong ease-fluid inline-flex h-10 w-fit cursor-pointer items-center border px-5 py-3 font-sans transition-colors duration-160"
            >
              Specifications
            </button>
          </div>
        </div>

        <div
          style={{ "--enter": 4 } as CSSProperties}
          className={`${styles.enter} relative z-10 md:max-lg:self-center lg:col-span-3 lg:col-start-1 lg:row-start-3 lg:justify-self-center`}
        >
          <div
            ref={trackRef}
            role="group"
            aria-label="Roadmap scale"
            data-figma-id="181:549"
            className="bg-glass-white rounded-pill relative flex h-10 w-fit max-w-full items-center gap-1 overflow-x-auto p-1 backdrop-blur-[8px]"
          >
            <span
              aria-hidden
              style={
                {
                  "--pill-x": `${pill.x}px`,
                  "--pill-w": `${pill.w}px`,
                } as CSSProperties
              }
              className="bg-text-strong rounded-pill ease-fluid absolute top-1 left-0 h-8 w-[var(--pill-w)] translate-x-[var(--pill-x)] transition-transform duration-360"
            />
            {ROADMAP.map((state, index) => {
              const selected = index === active;
              return (
                <button
                  key={state.segment}
                  data-segment
                  data-figma-id={state.figmaId}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => select(index)}
                  style={{ "--segment-w": state.segmentWidth } as CSSProperties}
                  className={
                    selected
                      ? "rounded-pill text-label-active text-on-dark ease-fluid relative z-10 h-8 shrink-0 cursor-pointer px-3 py-2 font-sans whitespace-nowrap transition-opacity duration-160 md:min-w-[var(--segment-w)] md:px-4"
                      : "rounded-pill text-label text-text-strong ease-fluid relative z-10 h-8 shrink-0 cursor-pointer px-3 py-2 font-sans whitespace-nowrap opacity-64 transition-opacity duration-160 hover:opacity-100 md:min-w-[var(--segment-w)] md:px-4"
                  }
                >
                  {state.segment}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {specsMounted ? (
        <TheFleetSpecs
          state={ROADMAP[active]}
          open={specsOpen}
          onClose={closeSpecs}
          onExited={specsExited}
        />
      ) : null}
    </>
  );
}
