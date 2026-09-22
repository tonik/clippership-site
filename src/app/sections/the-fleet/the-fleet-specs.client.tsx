"use client";

import Image from "next/image";
import {
  type CSSProperties,
  Fragment,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { IconClose } from "@/components/icons";
import type { RoadmapStat, RoadmapState } from "./roadmap";
import styles from "./the-fleet.module.css";

function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, index) => (
        <Fragment key={line}>
          {index > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </>
  );
}

function StatCell({ stat }: { stat: RoadmapStat }) {
  return (
    <div className="flex min-h-[80px] w-full min-w-0 flex-col justify-between gap-4 lg:min-h-[140px] lg:w-48 lg:shrink-0">
      <p className="text-stat-label font-server-mono text-specs-label uppercase">
        <Lines lines={stat.label} />
      </p>
      <p className="text-stat text-on-dark font-sans">
        <Lines lines={stat.value} />
      </p>
    </div>
  );
}

/**
 * The Specifications overlay: a dark panel covering the right-hand two thirds of
 * the fleet panel (912 x 752, inset 12px on top / right / bottom), built inside
 * the fleet section rather than as a separate page section. Two columns split by
 * a full-height rule at 456px: the vessel and a single length stat on the left, a
 * display heading and a 2 x 2 stat grid on the right. Every rule is 1px white at
 * 8% - they are the panel's only structure and are trivially lost.
 */
export function TheFleetSpecs({
  state,
  open,
  onClose,
  onExited,
}: {
  state: RoadmapState;
  /** false plays the close wipe; the parent unmounts on `onExited`. */
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}) {
  const headingId = useId();
  const render = state.render;
  const panelRef = useRef<HTMLDivElement>(null);
  /* Mounts in the closed pose and flips on the next frame, so the open wipe has
     a start state to transition from. */
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!open) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setShown(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [open]);

  /* Unmount after the close wipe. The timeout covers reduced motion, where the
     transform transition is suppressed and no transitionend fires for it. */
  useEffect(() => {
    if (open) return;
    const panel = panelRef.current;
    const done = () => onExited();
    const onEnd = (event: TransitionEvent) => {
      if (event.target === panel && event.propertyName === "transform") done();
    };
    panel?.addEventListener("transitionend", onEnd);
    const timer = window.setTimeout(done, 600);
    return () => {
      panel?.removeEventListener("transitionend", onEnd);
      window.clearTimeout(timer);
    };
  }, [open, onExited]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const item = (i: number) => ({ style: { "--i": i } as CSSProperties });

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close specifications"
          onClick={onClose}
          className="absolute inset-0 z-10 cursor-default"
        />
      ) : null}
      <div
        ref={panelRef}
        role="dialog"
        aria-labelledby={headingId}
        data-shown={open && shown}
        className={`${styles.specs} bg-specs-panel absolute inset-0 z-20 overflow-hidden rounded-none md:inset-3 md:rounded-sm lg:left-auto lg:w-[912px]`}
      >
        <div className={`${styles.specsInner} absolute inset-0`}>
          {/* TODO: real photo for the-fleet specs - specs-waves.png (182:906),
              bottom-anchored, opacity 0.32, mix-blend-mode: soft-light. */}

          <span
            {...item(0)}
            className={`${styles.specsItem} text-eyebrow text-specs-chip bg-specs-chip-wash absolute top-6 left-6 z-10 rounded-xs px-2 py-1.5 font-mono uppercase`}
          >
            {state.chip}
          </span>

          <div
            {...item(0)}
            className={`${styles.specsItem} absolute top-6 right-6 z-10`}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close specifications"
              className="border-specs-rule rounded-pill text-on-dark hover:bg-specs-rule ease-fluid grid size-10 cursor-pointer place-items-center border transition-colors duration-160"
            >
              <IconClose width={24} height={24} className="size-6" />
            </button>
          </div>

          <div className="relative grid h-full grid-cols-1 overflow-y-auto lg:grid-cols-2 lg:overflow-visible">
            <div className="relative min-h-[200px] px-6 pt-20 pb-6 lg:p-0">
              {/* Per-state render and box (400 @ 24/186, 420 @ 21/182, 444 @ 6/154
                  in the Detail frame). Below lg the drawn size keeps its ratio to
                  the 400px plate, capped at 62vw like the panel viewer. */}
              <Image
                key={render.specsFigmaId}
                src={render.src}
                alt=""
                aria-hidden
                width={render.specs.size}
                height={render.specs.size}
                sizes={`${render.specs.size}px`}
                data-figma-id={render.specsFigmaId}
                style={
                  {
                    "--specs-size": `${render.specs.size}px`,
                    "--specs-vw": `${(render.specs.size / 400) * 62}vw`,
                    "--specs-left": `${render.specs.left}px`,
                    "--specs-top": `${render.specs.top}px`,
                  } as CSSProperties
                }
                className={`${styles.specsVessel} mx-auto aspect-square h-auto w-[min(var(--specs-size),var(--specs-vw))] max-w-none lg:absolute lg:top-[var(--specs-top)] lg:left-[var(--specs-left)] lg:mx-0 lg:size-[var(--specs-size)]`}
              />
              <div
                {...item(5)}
                className={`${styles.specsItem} flex flex-col gap-2 lg:absolute lg:bottom-6 lg:left-6 lg:w-[408px]`}
              >
                <p className="text-stat-label font-server-mono text-specs-label uppercase">
                  {state.lengthLabel}
                </p>
                <p className="text-stat text-on-dark font-sans">
                  {state.lengthValue}
                </p>
              </div>
            </div>

            <div className="border-specs-rule flex flex-col gap-6 px-6 pt-12 pb-8 lg:border-l lg:pt-48">
              <h3
                id={headingId}
                {...item(1)}
                className={`${styles.specsItem} text-display-md font-display text-on-dark`}
              >
                <Lines lines={state.heading} />
              </h3>

              <div className="bg-specs-rule -mx-6 h-px" />

              <div
                {...item(2)}
                className={`${styles.specsItem} flex flex-col gap-6 md:flex-row`}
              >
                {state.stats.slice(0, 2).map((stat) => (
                  <StatCell key={stat.label.join(" ")} stat={stat} />
                ))}
              </div>

              <div className="bg-specs-rule -mx-6 h-px" />

              <div
                {...item(3)}
                className={`${styles.specsItem} flex flex-col gap-6 md:flex-row`}
              >
                {state.stats.slice(2).map((stat) => (
                  <StatCell key={stat.label.join(" ")} stat={stat} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
