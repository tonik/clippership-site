import { HeroStage } from "./hero-stage.client";
import { HERO_INTRO_SCRIPT } from "./intro-script";

export function Hero() {
  return (
    <section
      id="hero"
      data-section="hero"
      data-figma-id="181:499"
      className="bg-surface w-full overflow-hidden px-3"
    >
      {/* A plain inline script (not next/script): it has to run while the
          HTML parses, ahead of the first paint of the stage below it. */}
      <script>{HERO_INTRO_SCRIPT}</script>
      <HeroStage />
    </section>
  );
}
