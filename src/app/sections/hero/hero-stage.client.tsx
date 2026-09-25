"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef } from "react";
import sky from "@/app/(home)/assets/hero-sky.png";
import vessel from "@/app/(home)/assets/hero-vessel.png";
import wordmark from "@/app/(home)/assets/wordmark-clippership.svg";
import styles from "./hero.module.css";

/* U+00A0. Written as an escape, not as a literal character: a bare NBSP in the
   source is invisible and survives neither a formatter nor a copy/paste, which
   is how the headline lost its forced break ("AI compute at the / maritime
   edge." instead of Figma's "AI compute at / the maritime edge."). */
const NBSP = "\u00A0";

/**
 * Figma draws both rasters at their natural size inside the 1416 x 1280 stage
 * rather than fitting them to it - see the note at the top of hero.module.css.
 * Sizes are a percentage of the stage height, the shift a percentage of the
 * plate itself, so one set of numbers holds at every desktop width.
 */
const SKY_PLATE = {
  "--plate-top": "-5.6%",
  "--plate-height": "125.5%",
  "--plate-ratio": "2279 / 1607",
  "--plate-shift": "-50%",
} as CSSProperties;

const VESSEL_PLATE = {
  "--plate-top": "0%",
  "--plate-height": "124.1%",
  "--plate-ratio": "2252 / 1588",
  "--plate-shift": "-43.8%",
} as CSSProperties;

/**
 * The hero is a scroll-driven sequence (Figma 181:690 state A to 181:699 state B).
 * One progress value `p` (0 at rest, 1 when the stage has scrolled its own height)
 * drives every property: the vessel rises (a share of the stage height, see
 * hero.module.css), the headline rises 100px while
 * fading to 60% and blurring to 8px, and the lead + CTA resolve from ghosted to
 * full contrast. `p` is written onto the stage as `--hero-p` and the interpolation
 * itself lives in CSS, so nothing re-renders while scrolling.
 *
 * Under `prefers-reduced-motion: reduce` the listener is never attached, which
 * leaves the stage in state A exactly as drawn.
 */
/** Entry: how long to wait for the plates at most, and when the sequence
 *  (last slider tile included) has landed. */
const READY_TIMEOUT_MS = 2500;
const SEQUENCE_MS = 3200;

export function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);

  /* Entry sequence. The inline script in hero.tsx has already set
     html[data-intro="pending"], which holds the plates and the content back.
     Once both plates have decoded (and the fonts are in), the painting fades
     in and settles, then the hero content and the slider below follow in the
     stagger set in hero.module.css and how-it-works.module.css. */
  useEffect(() => {
    const root = document.documentElement;
    const stage = stageRef.current;
    if (!stage || root.dataset.intro !== "pending") return;

    let cancelled = false;
    let timer = 0;
    const images = [...stage.querySelectorAll("img")];
    const loaded = Promise.all([
      ...images.map((img) => img.decode().catch(() => {})),
      document.fonts.ready,
    ]);
    const timeout = new Promise((r) => setTimeout(r, READY_TIMEOUT_MS));

    Promise.race([loaded, timeout]).then(() => {
      if (cancelled) return;
      root.dataset.intro = "play";
      timer = window.setTimeout(() => {
        root.dataset.intro = "done";
      }, SEQUENCE_MS);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* Smoothing: `target` follows the scroll position exactly, `current`
       chases it with an exponential ease that is frame-rate independent. A
       mouse wheel scrolls in ~100px steps; written straight through, each step
       was a visible jump of the vessel and the blurred headline. Chasing it
       turns the steps into one continuous glide, and the loop parks itself as
       soon as it has caught up, so nothing runs while the page is still. */
    const SMOOTHING_MS = 180;
    let top = 0;
    let span = 1;
    let target = 0;
    let current = -1;
    let last = 0;
    let frame = 0;

    /* Geometry is read on resize only - never per frame - so scrolling does
       not force a layout. */
    const measure = () => {
      const rect = stage.getBoundingClientRect();
      top = rect.top + window.scrollY;
      span = rect.height || 1;
    };
    const progress = () =>
      Math.min(1, Math.max(0, (window.scrollY - top) / span));

    const tick = (now: number) => {
      const dt = last ? Math.min(64, now - last) : 16;
      last = now;
      current += (target - current) * (1 - Math.exp(-dt / SMOOTHING_MS));
      if (Math.abs(target - current) < 0.0005) current = target;
      stage.style.setProperty("--hero-p", current.toFixed(4));
      frame = current === target ? 0 : requestAnimationFrame(tick);
      if (!frame) last = 0;
    };
    const schedule = () => {
      target = progress();
      if (!frame && current !== target) frame = requestAnimationFrame(tick);
    };

    measure();
    target = current = progress();
    stage.style.setProperty("--hero-p", current.toFixed(4));

    const resizer = new ResizeObserver(() => {
      measure();
      schedule();
    });
    resizer.observe(stage);
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizer.disconnect();
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return (
    /* 620px min-height is the spec's `< 768` floor (Section 1, Responsive); it
       had been raised to 680px only to make room for the bottom-parked lead. */
    <div
      ref={stageRef}
      data-figma-id="181:500"
      className="relative flex aspect-3/4 min-h-[38.75rem] w-full flex-col overflow-hidden rounded-b-lg md:aspect-9/8 lg:aspect-auto lg:h-[1280px] lg:min-h-0"
    >
      {/* Both plates fade in and settle from slightly large. */}
      <div
        aria-hidden
        className={`${styles.settle} pointer-events-none absolute inset-0`}
      >
        <div
          aria-hidden
          data-figma-id="181:671"
          style={SKY_PLATE}
          className={`${styles.plate} pointer-events-none`}
        >
          <Image
            src={sky}
            alt=""
            fill
            priority
            sizes="(min-width: 992px) 160vw, 240vw"
            className="object-cover object-center"
          />
        </div>

        {/* The vessel plate carries the parallax rise, so the scroll transform sits
          on a wrapper and the plate keeps its own `translate` for the crop. */}
        <div
          aria-hidden
          className={`${styles.vesselRise} hero-vessel-rise pointer-events-none absolute inset-0 will-change-transform`}
        >
          <div
            data-figma-id="247:655"
            style={VESSEL_PLATE}
            className={`${styles.plate} ${styles.vesselPlate}`}
          >
            <Image
              src={vessel}
              alt=""
              fill
              priority
              sizes="(min-width: 992px) 160vw, 240vw"
              className="object-cover object-bottom"
            />
          </div>
        </div>
      </div>

      {/* `px-3` below the tablet frame, not `px-6`: the display face now sets at
          its corrected mass (see hero.module.css), which widens "AI compute at
          the" from ~308px to 338px at the 44px mobile size. A 24px inset leaves
          a 318px measure, so the line would have reflowed onto a third line and
          orphaned "edge."; a 12px inset leaves 342px and keeps the two balanced
          lines the mobile composition already had. */}
      <div
        data-figma-id="181:505"
        className={`${styles.title} hero-title-recede relative z-10 mt-18 flex w-[min(1002px,100%)] flex-col items-center justify-center self-center px-3 will-change-transform md:mt-[11.5vw] md:px-6 lg:mt-[var(--space-6xl)] lg:px-0`}
      >
        {/* Width is `1.4537em` of the display size (157/108), not a locked
            157px - see the "Wordmark scale" note in hero.module.css. */}
        <Image
          src={wordmark}
          alt="Clippership"
          width={157}
          height={28}
          priority
          data-figma-id="235:422"
          style={{ "--enter": 0 } as CSSProperties}
          className={`${styles.wordmark} ${styles.enter}`}
        />
        {/* `w-full` (not shrink-to-fit): in Figma the h1 text node is stretched to
            the full 1002px of the Title frame and centred inside it. Under
            `items-center` the heading was hugging its longest line instead, which
            at the current fallback face is 787px - the measured "108px right /
            217px narrower" delta is exactly that hug, (1002-787)/2 = 108. Centred
            text renders identically either way; only the box changes. */}
        <h1
          data-figma-id="181:507"
          style={{ "--enter": 1 } as CSSProperties}
          className={`${styles.headline} ${styles.enter} text-display-xl font-display text-ink w-full text-center`}
        >
          {"AI compute at"}
          {/* Figma sets the headline on two lines, breaking after "at" (the design
              does it with a NBSP; an explicit break is stronger and survives a
              change of face). It holds from the tablet frame up, where both lines
              fit: at 768 they measure 320px and 420px inside a 696px column.
              Below md the break is dropped and an ordinary space lets the line
              fall after "the" - "AI compute at the" / "maritime edge." - which is
              two balanced lines at 390 instead of orphaning "edge." on a third. */}
          <br className="hidden md:inline" /> {"the maritime edge."}
        </h1>
      </div>

      {/* TODO: real photo for hero - hero-vessel-front.png (247:680), the masts-only
          plate that passes in front of the headline as the sequence plays. It sits
          here in z-order, above the title and below the lead. */}

      {/* Below the desktop frame the lead follows the title in normal flow, 64px
          under it (spec Section 1, Responsive: 768-1023 `align-self: center;
          margin-top: 64px`, < 768 `width: calc(100% - 48px)`). That band is the
          quiet sky the 48% run was drawn against; parking the block at the foot
          of the stage instead dropped it onto the hull and the dark water, where
          the quiet run fell to ~1.3:1. At lg it returns to the drawn 96px below
          the title block, in the right gutter. */}
      <div
        data-figma-id="181:502"
        className="hero-lead-rise relative z-10 mt-16 flex w-[calc(100%-48px)] flex-col gap-6 self-center will-change-transform md:w-[min(431px,72vw)] lg:mt-[var(--space-4xl)] lg:mr-9 lg:w-[431px] lg:self-end lg:pr-12"
      >
        <p
          data-figma-id="181:503"
          style={{ "--enter": 2 } as CSSProperties}
          className={`${styles.enter} text-lead text-text-strong font-sans`}
        >
          Autonomous vessels{" "}
          <span className="hero-lead-ghost">
            {`take AI compute onto the${NBSP}wide-open ocean, where clean energy and cooling are plentiful, and the red tape is thin.`}
          </span>
        </p>
        <div style={{ "--enter": 3 } as CSSProperties} className={styles.enter}>
          <a
            href="/white-paper"
            data-figma-id="181:708"
            className="hero-cta border-border-hairline rounded-pill text-label inline-flex h-10 w-fit shrink-0 items-center border px-5 py-3 font-sans backdrop-blur-[4px]"
          >
            {/* The label is its own node in Figma (181:709, 134 x 16 inside the
              174 x 40 pill). Without a span the measurement matched that text
              node against the whole pill, which reported it as 46px wider,
              24px taller and 20px off to the left - i.e. the pill's padding. */}
            <span data-figma-id="181:709">Read the white paper</span>
          </a>
        </div>
      </div>
    </div>
  );
}
