import type { Metadata } from "next";
import { About } from "@/app/sections/about";
import { Footer } from "@/app/sections/footer";
import { Hero } from "@/app/sections/hero";
import { HowItWorks } from "@/app/sections/how-it-works";
import { TheFleet } from "@/app/sections/the-fleet";

export const metadata: Metadata = {
  title: "Clippership - AI compute at the maritime edge",
  description:
    "Clippership builds autonomous sail freighters that carry AI compute onto the wide-open ocean, where clean energy and cooling are plentiful. One architecture, three scales, from a 10kW node to 3MW vessels.",
  openGraph: {
    type: "website",
    siteName: "Clippership",
    url: "https://clippership.co",
    title: "Clippership - AI compute at the maritime edge",
    description:
      "Autonomous sail freighters carrying AI compute onto the wide-open ocean. One architecture, three scales, from a 10kW node to 3MW vessels.",
  },
};

export default function HomePage() {
  return (
    <main className="bg-surface flex w-full flex-col">
      <Hero />
      <HowItWorks />
      <TheFleet />
      <About />
      <Footer />
    </main>
  );
}
