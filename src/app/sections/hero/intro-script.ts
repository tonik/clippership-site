/**
 * Entry sequence. Rendered as an inline <script> just ahead of the hero stage,
 * so it runs while the HTML parses - before first paint and before hydration.
 * The hero is held back from the very first frame instead of flashing in and
 * then hiding. Order once the plates are in: the painting fades in and
 * settles, then the hero content, then the slider below. Reduced motion never gets the attribute and paints as drawn. The rest
 * of the sequence is driven by HeroStage and hero.module.css.
 */
export const HERO_INTRO_SCRIPT = `if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="pending"`;
