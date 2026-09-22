import Image from "next/image";
import wordmark from "@/app/(home)/assets/wordmark-clippership-footer.svg";
import waves from "@/app/(home)/assets/footer-waves.png";
import backerY50 from "@/app/(home)/assets/backer-y50.png";
import backerJc from "@/app/(home)/assets/backer-jc.png";
import backerLongJourney from "@/app/(home)/assets/backer-long-journey.png";
import backerFoundersFactory from "@/app/(home)/assets/backer-founders-factory.png";
import backerKmYachtbuilders from "@/app/(home)/assets/backer-km-yachtbuilders.png";
import backerAbs from "@/app/(home)/assets/backer-abs.png";
import backerRina from "@/app/(home)/assets/backer-rina.png";
import backerDykstra from "@/app/(home)/assets/backer-dykstra.png";
import backerNvidiaInception from "@/app/(home)/assets/backer-nvidia-inception.png";
import { IconLinkedin, IconX, IconYoutube } from "@/components/icons";

/** Nine equal slots across the top of the panel. Each asset is the exported
 *  128 x 36 Figma slot frame, so the logo already sits clipped and centred in
 *  its plate; the plate itself is erased by `mix-blend-darken`.
 *
 *  NOTE: do NOT add `opacity-60` here. Figma's `opacity: 0.6` on the inner rect
 *  (246:634 etc.) is already BAKED INTO the exported PNG - the render endpoint
 *  applies a node's own opacity before it writes the file. Re-declaring it in
 *  CSS multiplies it out to 0.6 x 0.6 = 0.36 and ghosts the whole row. */
const BACKERS = [
  { name: "Y50", logo: backerY50, figmaId: "246:633" },
  { name: "JC", logo: backerJc, figmaId: "246:635" },
  { name: "Long Journey", logo: backerLongJourney, figmaId: "246:637" },
  {
    name: "Founders Factory",
    logo: backerFoundersFactory,
    figmaId: "246:639",
  },
  {
    name: "KM Yachtbuilders",
    logo: backerKmYachtbuilders,
    figmaId: "246:641",
  },
  { name: "ABS", logo: backerAbs, figmaId: "246:643" },
  { name: "RINA", logo: backerRina, figmaId: "246:645" },
  { name: "Dykstra Naval Architects", logo: backerDykstra, figmaId: "246:647" },
  {
    name: "NVIDIA Inception Program",
    logo: backerNvidiaInception,
    figmaId: "246:649",
  },
];

const SOCIAL = [
  {
    label: "Clippership on YouTube",
    href: "https://www.youtube.com/@clippership",
    Icon: IconYoutube,
    width: 23,
    height: 16,
    size: "h-4 w-[23px]",
  },
  {
    label: "Clippership on LinkedIn",
    href: "https://www.linkedin.com/company/clippership",
    Icon: IconLinkedin,
    width: 17,
    height: 16,
    size: "h-4 w-[17px]",
  },
  {
    label: "Clippership on X",
    href: "https://x.com/clippership",
    Icon: IconX,
    width: 18,
    height: 16,
    size: "h-4 w-[18px]",
  },
];

/**
 * The same section panel as The Fleet, over a painted wave band at 64%: a row of
 * nine backer logo slots across the top, then a meta row with copyright, rule and
 * email left, the wordmark centred as an overlay so it holds the page's centre
 * line regardless of how wide the outer blocks get, and social icons right.
 */
export function Footer() {
  return (
    <footer
      data-section="footer"
      data-figma-id="182:2746"
      className="bg-surface w-full px-3 pb-3"
    >
      <div
        data-figma-id="182:2961"
        className="bg-panel-wash relative overflow-hidden rounded-lg lg:h-[240px]"
      >
        {/* 1416 x 478 band in a 240px panel: at lg it keeps Figma's -59px top
            anchor so the crests land behind the meta row. Below lg the panel is
            far taller than 240px, so the band covers it instead - that keeps the
            same light-sky-over-backers / waves-under-the-meta reading rather
            than scaling one slice of the image over the whole panel.

            On mobile (<md) the panel grows even taller (3-per-row backer wrap),
            so the band is drawn at 140% height and top-cropped: this keeps the
            darkest wave crest from creeping up into the third logo row while
            still landing under the meta column below.

            No `opacity-64` here for the same reason as the backer slots: the
            band was rendered straight from 183:93, so Figma's `opacity: 0.64`
            is already baked into the PNG. */}
        <Image
          src={waves}
          alt=""
          aria-hidden
          data-figma-id="183:93"
          priority={false}
          sizes="100vw"
          className="pointer-events-none absolute inset-0 h-[140%] w-full object-cover md:h-full lg:top-[-59px] lg:bottom-auto lg:h-[478px]"
        />

        <ul className="relative flex flex-wrap items-center gap-6 px-6 pt-8 md:px-9 md:pt-12">
          {BACKERS.map(({ name, logo, figmaId }) => (
            <li
              key={name}
              data-figma-id={figmaId}
              className="flex h-9 grow-0 basis-[calc((100%-48px)/3)] items-center justify-center overflow-hidden rounded-sm md:basis-[calc((100%-96px)/5)] lg:grow lg:basis-0"
            >
              <Image
                src={logo}
                alt={name}
                sizes="128px"
                className="h-full w-full object-contain mix-blend-darken"
              />
            </li>
          ))}
        </ul>

        <div className="relative mt-8 flex flex-col items-center gap-6 px-6 pb-8 md:mt-12 md:flex-row md:justify-between md:px-0 md:py-12 lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0">
          <Image
            src={wordmark}
            alt="Clippership"
            width={157}
            height={28}
            className="order-first h-7 w-[157px] md:absolute md:bottom-12 md:left-1/2 md:order-none md:-translate-x-1/2 lg:bottom-[54px]"
          />

          <div className="flex flex-col items-center gap-2 md:items-start md:px-9">
            <p className="text-eyebrow text-text-strong font-mono uppercase opacity-80">
              (c)2026 Clippership inc.
            </p>
            <span
              aria-hidden
              className="bg-border-rule h-px w-full self-stretch"
            />
            <a
              href="mailto:hello@clippership.co"
              className="text-eyebrow text-text-strong ease-fluid font-mono opacity-80 transition-opacity duration-160 hover:opacity-100"
            >
              hello@clippership.co
            </a>
          </div>

          <ul className="text-text-strong flex items-center gap-6 md:px-9">
            {SOCIAL.map(({ label, href, Icon, width, height, size }) => (
              <li key={label}>
                <a
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="ease-fluid block opacity-80 transition-opacity duration-160 hover:opacity-100"
                >
                  <Icon width={width} height={height} className={size} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
