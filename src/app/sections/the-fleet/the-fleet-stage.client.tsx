"use client";

import Image from "next/image";
import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { FLEET_BLOT, FLEET_SEA } from "./assets";
import styles from "./the-fleet.module.css";
import {
  createWatercolor,
  DEFAULT_PARAMS,
  layoutFor,
  type Watercolor,
  type WatercolorParams,
  type WatercolorShape,
} from "./watercolor-gl";

/**
 * Entry sequence of the fleet panel:
 *  - `ssr`: server render and no-JS. Everything visible, static CSS backdrop.
 *  - `armed`: JS is up and WebGL is available. Backdrop and content are held
 *    back until the panel is on screen.
 *  - `revealing`: the watercolour front grows out from the vessel, then the
 *    content follows in a stagger (delays in the-fleet.module.css). Stays set
 *    after it finishes.
 *  - `static`: reduced motion, no WebGL or a failed texture load. The CSS
 *    backdrop is shown and the content simply fades in.
 */
type Phase = "ssr" | "armed" | "revealing" | "static";

/**
 * Outline of the ink per roadmap scale (index-aligned with ROADMAP). The first
 * is the drawn blot untouched; the bigger vessels grow it and swell it into
 * their own lobes, so each scale reads as its own painting.
 */
const SHAPES: WatercolorShape[] = [
  { scale: 1, lobes: 0, fray: 0, seed: 0 },
  { scale: 1.06, lobes: 90, fray: 18, seed: 7.9 },
  { scale: 1.14, lobes: 130, fray: 22, seed: 13.4 },
];

/** How much of the panel must be on screen before the reveal starts. */
const REVEAL_AT = 0.35;
/** Painted sea is drawn at 64% (Figma 181:538). */
const SEA_OPACITY = 0.64;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
/* Out and back in a single tween: 0 -> 1 -> 0, eased at both ends. */
const dip = (t: number) => Math.sin(Math.PI * easeInOut(t));

type Tween = {
  from: number;
  to: number;
  dur: number;
  t0: number;
  ease: (t: number) => number;
  set: (v: number) => void;
  done: () => void;
  /** Tweens sharing a key replace each other. */
  key?: string;
};

const FleetStageContext = createContext<{ morphTo: (index: number) => void }>({
  morphTo: () => {},
});

/** Lets the roadmap ask the backdrop to morph to a scale's shape. */
export const useFleetStage = () => useContext(FleetStageContext);

const noop = () => () => {};

/** The tweak widget shows on localhost, and anywhere with `?tweak` in the URL. */
const useTweakable = () =>
  useSyncExternalStore(
    noop,
    () =>
      window.location.hostname === "localhost" ||
      new URLSearchParams(window.location.search).has("tweak"),
    () => false,
  );

const REDUCED = "(prefers-reduced-motion: reduce)";
const useReducedMotion = () =>
  useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCED);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );

export function TheFleetStage({ children }: { children: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("ssr");
  const reduced = useReducedMotion();
  const tweakable = useTweakable();
  const [tweakOpen, setTweakOpen] = useState(false);
  const [params, setParams] = useState<WatercolorParams>(DEFAULT_PARAMS);

  /* Everything the render loop reads lives in refs, so a slider drag or a tween
     never re-renders React. */
  const engine = useRef<Watercolor | null>(null);
  const paramsRef = useRef(params);
  const progress = useRef(0);
  const shape = useRef({ from: SHAPES[0], to: SHAPES[0], mix: 0 });
  const tweens = useRef<Tween[]>([]);
  const visible = useRef(false);
  const kick = useRef<() => void>(() => {});
  const reveal = useRef<() => void>(() => {});

  useEffect(() => {
    paramsRef.current = params;
    kick.current();
  }, [params]);

  const tween = useCallback(
    (
      from: number,
      to: number,
      dur: number,
      ease: (t: number) => number,
      set: (v: number) => void,
      key?: string,
    ) =>
      new Promise<void>((done) => {
        if (key) {
          tweens.current = tweens.current.filter((tw) => tw.key !== key);
        }
        tweens.current.push({
          key,
          from,
          to,
          dur,
          ease,
          set,
          done,
          t0: performance.now(),
        });
        kick.current();
      }),
    [],
  );

  useEffect(() => {
    const panel = panelRef.current;
    const canvas = canvasRef.current;
    if (!panel || !canvas || reduced) return;

    let disposed = false;
    const abort = new AbortController();
    let frame = 0;
    let revealed = false;
    let ready = false;
    let inView = false;
    const desktop = window.matchMedia("(min-width: 62rem)");

    const resize = () => {
      const gl = engine.current;
      if (!gl) return;
      const box = panel.getBoundingClientRect();
      const viewer = panel.querySelector("[data-fleet-viewer]");
      const v = viewer?.getBoundingClientRect();
      const origin: [number, number] = v
        ? [
            (v.left + v.width / 2 - box.left) / box.width,
            (v.top + v.height / 2 - box.top) / box.height,
          ]
        : [0.5, 0.5];
      gl.resize(
        layoutFor(
          box.width,
          box.height,
          desktop.matches,
          {
            sea: [FLEET_SEA.width, FLEET_SEA.height],
            blot: [FLEET_BLOT.width, FLEET_BLOT.height],
          },
          origin,
        ),
        Math.min(window.devicePixelRatio || 1, 1.5),
      );
      kick.current();
    };

    const loop = (now: number) => {
      frame = 0;
      const list = tweens.current;
      for (let k = list.length - 1; k >= 0; k--) {
        const tw = list[k];
        const p = Math.min(1, (now - tw.t0) / tw.dur);
        tw.set(tw.from + (tw.to - tw.from) * tw.ease(p));
        if (p >= 1) {
          list.splice(k, 1);
          tw.done();
        }
      }
      engine.current?.render({
        progress: progress.current,
        ...shape.current,
        params: paramsRef.current,
      });
      /* No idle motion: keep drawing only while something is animating. */
      if (visible.current && list.length) {
        frame = requestAnimationFrame(loop);
      }
    };
    kick.current = () => {
      if (!frame && engine.current) frame = requestAnimationFrame(loop);
    };

    reveal.current = () => {
      progress.current = 0;
      tween(
        0,
        1,
        paramsRef.current.revealMs,
        easeOut,
        (v) => (progress.current = v),
        "reveal",
      );
    };

    const tryReveal = () => {
      if (revealed || !ready || !inView) return;
      revealed = true;
      setPhase("revealing");
      reveal.current();
    };

    setPhase("armed");

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        inView = entry.intersectionRatio >= REVEAL_AT;
        tryReveal();
        kick.current();
      },
      { threshold: [0, REVEAL_AT] },
    );
    observer.observe(panel);
    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        approach.disconnect();
        start();
      },
      { rootMargin: "100% 0px" },
    );
    approach.observe(panel);
    const resizer = new ResizeObserver(resize);
    resizer.observe(panel);
    desktop.addEventListener("change", resize);

    /* Start the engine only once the panel is within a viewport of the screen,
       so its image loads and GPU setup never compete with the hero. */
    const start = () =>
      createWatercolor(
        canvas,
        { sea: FLEET_SEA.src, blot: FLEET_BLOT.src },
        SEA_OPACITY,
        abort.signal,
      )
        .then((gl) => {
          if (disposed) return gl.dispose();
          engine.current = gl;
          ready = true;
          resize();
          tryReveal();
        })
        .catch(() => {
          if (!disposed) setPhase("static");
        });

    return () => {
      disposed = true;
      abort.abort();
      if (frame) cancelAnimationFrame(frame);
      kick.current = () => {};
      observer.disconnect();
      approach.disconnect();
      resizer.disconnect();
      desktop.removeEventListener("change", resize);
      engine.current?.dispose();
      engine.current = null;
      tweens.current = [];
    };
  }, [tween, reduced]);

  /* Scale change: the outline morphs in place from this scale's shape to the
     next. A click that lands mid-morph is queued and plays once the current
     one lands, so the ink never jumps. */
  const pending = useRef<WatercolorShape | null>(null);
  const morphTo = useCallback(
    (index: number) => {
      const run = (target: WatercolorShape) => {
        const cur = shape.current;
        if (!engine.current) {
          shape.current = { from: target, to: target, mix: 0 };
          return;
        }
        if (cur.mix > 0) {
          pending.current = target === cur.to ? null : target;
          return;
        }
        if (cur.from === target) return;
        shape.current = { from: cur.from, to: target, mix: 0 };
        const { switchMs, bleed } = paramsRef.current;
        const setMix = (v: number) => (shape.current.mix = v);
        const setDip = (v: number) => (progress.current = 1 - v * bleed);
        const revealing = tweens.current.some((tw) => tw.key === "reveal");
        tween(0, 1, switchMs, easeInOut, setMix, "morph").then(() => {
          shape.current = { from: target, to: target, mix: 0 };
          const next = pending.current;
          pending.current = null;
          if (next) run(next);
        });
        if (bleed > 0 && !revealing) {
          tween(0, 1, switchMs, dip, setDip, "dip");
        }
      };
      run(SHAPES[index]);
    },
    [tween],
  );

  const replay = () => {
    setPhase("armed");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setPhase("revealing");
        reveal.current();
      }),
    );
  };

  const set = <K extends keyof WatercolorParams>(
    key: K,
    value: WatercolorParams[K],
  ) => setParams((p) => ({ ...p, [key]: value }));

  return (
    <FleetStageContext.Provider value={{ morphTo }}>
      <div
        ref={panelRef}
        data-figma-id="181:535"
        data-phase={reduced ? "static" : phase}
        style={{ "--enter-step": `${params.staggerMs}ms` } as CSSProperties}
        className={`${styles.stage} bg-panel-wash relative min-h-[720px] overflow-hidden rounded-lg lg:h-[776px] lg:min-h-0`}
      >
        <div
          aria-hidden
          data-figma-id="181:536"
          style={
            { "--fleet-blot": `url("${FLEET_BLOT.src}")` } as CSSProperties
          }
          className="pointer-events-none absolute inset-0"
        >
          {/* Static backdrop: the SSR / no-WebGL frame, and exactly what the
              shader settles on once revealed. */}
          <div className={`${styles.backdrop} ${styles.staticSea}`}>
            <div data-figma-id="181:538" className={styles.sea}>
              <Image
                src={FLEET_SEA}
                alt=""
                fill
                sizes="112vw"
                className="object-cover opacity-64"
              />
            </div>
          </div>
          <canvas
            ref={canvasRef}
            className={`${styles.canvas} absolute inset-0 size-full`}
          />
          <div className={`${styles.backdrop} ${styles.washLayer}`}>
            <div
              data-figma-id="181:539"
              className={`fleet-wash ${styles.wash} absolute inset-0`}
            />
          </div>
        </div>
        <div
          aria-hidden
          className={`noise-grain ${styles.grain} pointer-events-none absolute inset-0`}
        />

        {children}

        {tweakable ? (
          <div className="text-eyebrow absolute right-3 bottom-3 z-30 flex flex-col items-end gap-2 font-mono max-lg:top-3 max-lg:bottom-auto max-lg:flex-col-reverse">
            {tweakOpen ? (
              <div className="bg-surface text-text-strong max-h-[70vh] w-60 overflow-y-auto rounded-md p-3 shadow-[0_8px_30px_rgb(0_0_0/0.12)]">
                {(
                  [
                    ["noise", "Reveal fray", 0, 2, 0.01],
                    ["speck", "Specks", 0, 1, 0.01],
                    ["rim", "Rim darkening", 0, 0.4, 0.01],
                    ["size", "Mask size", 0.3, 1.4, 0.01],
                    ["morph", "Shape change", 0, 1.5, 0.01],
                    ["bleed", "Bleed on switch", 0, 0.6, 0.01],
                    ["revealMs", "Reveal ms", 400, 4000, 50],
                    ["switchMs", "Switch ms", 300, 3000, 50],
                    ["staggerMs", "Content stagger ms", 0, 400, 10],
                  ] as const
                ).map(([key, label, min, max, step]) => (
                  <label key={key} className="mb-2.5 block">
                    <span className="flex justify-between">
                      {label}
                      <span className="opacity-60">{params[key]}</span>
                    </span>
                    <input
                      type="range"
                      min={min}
                      max={max}
                      step={step}
                      value={params[key]}
                      onChange={(e) => set(key, parseFloat(e.target.value))}
                      className="mt-1 w-full"
                    />
                  </label>
                ))}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={replay}
                    className="border-border-hairline rounded-sm border px-2 py-1"
                  >
                    replay reveal
                  </button>
                  <button
                    type="button"
                    onClick={() => setParams(DEFAULT_PARAMS)}
                    className="border-border-hairline rounded-sm border px-2 py-1"
                  >
                    reset
                  </button>
                </div>
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => setTweakOpen((o) => !o)}
              aria-expanded={tweakOpen}
              className="bg-surface text-text-strong rounded-md px-3 py-2 opacity-85"
            >
              tweak
            </button>
          </div>
        ) : null}
      </div>
    </FleetStageContext.Provider>
  );
}
