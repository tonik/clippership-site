"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ROADMAP } from "./roadmap";
import styles from "./the-fleet.module.css";
import { useReducedMotion } from "./the-fleet-stage.client";
import type { VesselViewer } from "./vessel-viewer";

export type FleetVesselsHandle = {
  /** Horizontal drag in CSS px, relative to the viewer box width. */
  drag: (dx: number, boxWidth: number) => void;
  release: () => void;
  nudge: (radians: number) => void;
};

const FILL = 0.86;
const BOW_ON = -Math.PI / 2;
const REST_YAW = BOW_ON - Math.PI / 9;
const LOAD_MARGIN = "400px";

export function TheFleetVessels({
  active,
  ref,
}: {
  active: number;
  ref: Ref<FleetVesselsHandle>;
}) {
  const canvases = useRef<(HTMLCanvasElement | null)[]>([]);
  const viewers = useRef<(VesselViewer | null)[]>([]);
  const [ready, setReady] = useState(() => ROADMAP.map(() => false));
  const reduced = useReducedMotion();
  const activeRef = useRef(active);
  const reducedRef = useRef(reduced);
  const ensureRef = useRef<(index: number) => void>(() => {});

  useImperativeHandle(ref, () => ({
    drag: (dx, boxWidth) =>
      viewers.current[activeRef.current]?.drag((dx / boxWidth) * Math.PI),
    release: () => viewers.current[activeRef.current]?.release(),
    nudge: (radians) => viewers.current[activeRef.current]?.nudge(radians),
  }));

  useEffect(() => {
    const box = canvases.current[0]?.parentElement?.parentElement;
    if (!box) return;
    let disposed = false;
    let visible = false;
    let engine: typeof import("./vessel-viewer") | null = null;

    const ensure = (index: number) => {
      const canvas = canvases.current[index];
      if (!engine || !canvas || viewers.current[index]) return;
      const viewer = engine.createVesselViewer({
        canvas,
        url: ROADMAP[index].render.model,
        fill: FILL,
        restYaw: REST_YAW,
        introYaw: BOW_ON,
        onReady: () => {
          setReady((r) => r.map((v, i) => v || i === index));
          const next = ROADMAP.findIndex((_, i) => !viewers.current[i]);
          if (next !== -1) ensure(next);
        },
        onError: () => {},
      });
      viewer.setReducedMotion(reducedRef.current);
      viewer.setActive(index === activeRef.current);
      viewer.setVisible(visible);
      viewers.current[index] = viewer;
    };
    ensureRef.current = ensure;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        viewers.current.forEach((v) => v?.setVisible(visible));
        if (!visible || engine) return;
        import("./vessel-viewer").then((mod) => {
          if (disposed) return;
          engine = mod;
          ensure(activeRef.current);
        });
      },
      { rootMargin: LOAD_MARGIN },
    );
    observer.observe(box);

    return () => {
      disposed = true;
      observer.disconnect();
      viewers.current.forEach((v) => v?.dispose());
      viewers.current = [];
      ensureRef.current = () => {};
    };
  }, []);

  useEffect(() => {
    activeRef.current = active;
    ensureRef.current(active);
    viewers.current.forEach((v, i) => v?.setActive(i === active));
  }, [active]);

  useEffect(() => {
    reducedRef.current = reduced;
    viewers.current.forEach((v) => v?.setReducedMotion(reduced));
  }, [reduced]);

  return ROADMAP.map(({ render }, index) => (
    <div
      key={render.figmaId}
      data-figma-id={render.figmaId}
      data-active={index === active}
      data-ready={ready[index]}
      aria-hidden={index !== active}
      style={
        {
          "--vessel-size": `${render.scale * 100}%`,
          "--vessel-dy": `${render.offsetY * 100}%`,
        } as CSSProperties
      }
      className={`${styles.swap} ${styles.vessel} pointer-events-none absolute top-[calc(50%+var(--vessel-dy))] left-1/2 aspect-square w-[var(--vessel-size)] -translate-x-1/2 -translate-y-1/2`}
    >
      <Image
        src={render.src}
        alt={index === active ? render.alt : ""}
        width={532}
        height={532}
        sizes="(min-width: 992px) 532px, 83vw"
        className={`${styles.vesselPoster} size-full`}
      />
      <canvas
        ref={(el) => {
          canvases.current[index] = el;
        }}
        className={`${styles.vesselCanvas} absolute top-0 left-1/2 h-full w-[200%] -translate-x-1/2`}
      />
    </div>
  ));
}
