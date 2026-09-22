import { TheFleetRoadmap } from "./the-fleet-roadmap.client";
import { TheFleetStage } from "./the-fleet-stage.client";

/**
 * A section panel carrying full-bleed painted imagery: headline top-left, a 3D
 * vessel viewer centred in the panel, a lead + CTA right, and a segment control
 * along the bottom. The panel has no stroke - its edge is the fill against white.
 * The painted backdrop and its watercolour entry live in TheFleetStage.
 */
export function TheFleet() {
  return (
    <section
      id="the-fleet"
      data-section="the-fleet"
      data-figma-id="181:534"
      className="bg-surface w-full p-3"
    >
      <TheFleetStage>
        <TheFleetRoadmap />
      </TheFleetStage>
    </section>
  );
}
