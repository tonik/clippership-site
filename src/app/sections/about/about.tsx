import Image from "next/image";

import teamPhoto from "@/app/(home)/assets/about-team.png";
import { IconBulletArrow, IconLinkedin } from "@/components/icons";

const NBSP = " ";

/** Inner measure of the trades block - 659px in Figma. A hand-set width, not a
 *  column multiple, so it only binds once the 12-column grid is in play. */
const TRADES_MEASURE = "lg:max-w-[41.1875rem]";

/** Rows read left to right across the two columns, so DOM order is the reading
 *  order. The last entry has no right-hand partner and spans the full measure. */
const TRADES = [
  "Tesla",
  "Jet Propulsion Laboratory",
  "Canadian Special Forces",
  "Mercedes-AMG Formula 1 Team",
  "Microsoft",
  "Damen Shipyards Group",
  "Bay Ship and Yacht",
];

const TEAM = [
  {
    role: "CEO",
    name: "Nico Cymbalist",
    credentials: "Ex-Tesla, Mercedes-F1, Caltech",
  },
  {
    role: "COO",
    name: "Luca Cymbalist",
    credentials: "Ex-Canadian Special Forces",
  },
  { role: "CTO", name: "Kai Matsuka", credentials: "Ex-Tesla, JPL, Caltech" },
];

/**
 * A bare white two-column grid on the 48px gutter: the left block spans columns
 * 1-4 and the right block columns 6-12, which leaves column 5 deliberately empty
 * and produces the wide trough between them.
 */
export function About() {
  return (
    <section
      id="about"
      data-section="about"
      data-figma-id="182:2323"
      className="bg-surface flex w-full flex-col gap-12 px-6 py-12 md:gap-16 md:px-8 lg:grid lg:grid-cols-12 lg:gap-x-6 lg:gap-y-25 lg:px-12 lg:pt-12 lg:pb-24"
    >
      <div className="flex flex-col gap-3 lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:pb-16">
        <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
          Clippership
        </p>
        <h2 className="text-display-md font-display text-ink">
          One team, built across industries
        </h2>
      </div>

      <div
        className={`flex flex-col gap-4 lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:pt-6 ${TRADES_MEASURE}`}
      >
        <p className="text-lead text-text-strong font-sans">
          {`Our team honed their${NBSP}trades at`}
        </p>
        <ul className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2 md:gap-y-2">
          {TRADES.map((trade) => (
            <li
              key={trade}
              className="flex h-5 items-center gap-2 md:last:col-span-2"
            >
              <span
                aria-hidden
                className="border-border-hairline text-text-tertiary flex size-2 shrink-0 items-center justify-center overflow-hidden rounded-xs border"
              >
                <IconBulletArrow width={4} height={4} />
              </span>
              <span className="text-body text-text-tertiary min-w-0 font-sans break-words">
                {trade}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:items-end">
        {TEAM.map((member) => (
          <article
            key={member.name}
            className="border-border-flat hover:border-border-rule bg-surface ease-fluid relative flex w-full flex-col gap-7 rounded-sm border p-6 transition-colors duration-160"
          >
            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-eyebrow text-text-strong font-mono uppercase opacity-60">
                {member.role}
              </p>
              <p className="text-lead text-text-strong font-sans break-words">
                {member.name}
              </p>
            </div>
            <p className="text-body text-text-secondary font-sans break-words">
              {member.credentials}
            </p>
            <IconLinkedin
              width={16}
              height={16}
              className="text-text-strong absolute top-6 right-6 h-4 w-4 opacity-60"
            />
          </article>
        ))}
      </div>

      <figure
        data-figma-id="182:2559"
        className="border-border-flat relative aspect-774/520 w-full overflow-hidden rounded-sm border lg:col-span-7 lg:col-start-6 lg:row-start-2"
      >
        {/* The plate (182:2560) is 1114 x 740 behind a 774 x 520 window, offset
            -170 / -31. Kept as percentages of the window - 1114/774 = 143.93%,
            -170/774 = -21.96%, -31/520 = -5.96% - so the crop is identical at
            every width instead of only at 1440. */}
        <Image
          src={teamPhoto}
          alt="The Clippership team"
          data-figma-id="182:2560"
          sizes="(min-width: 992px) 58vw, 100vw"
          className="absolute top-[-5.96%] left-[-21.96%] h-auto w-[143.93%] max-w-none"
        />
        <figcaption className="text-caption-mono text-text-strong absolute top-0 left-0 pt-6 pr-16 pb-8 pl-6 font-mono uppercase opacity-60">
          Our Team
        </figcaption>
      </figure>
    </section>
  );
}
