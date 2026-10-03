import { TimelineUniverse } from "@/types/timeline";
import { mcuTimeline } from "./mcu";
import { starWarsTimeline } from "./star-wars";
import { monsterverseTimeline } from "./monsterverse";
import { dcuTimeline } from "./dcu";
import { duneTimeline } from "./dune";

export const TIMELINE_UNIVERSES: TimelineUniverse[] = [
  mcuTimeline,
  starWarsTimeline,
  monsterverseTimeline,
  dcuTimeline,
  duneTimeline,
];

export function getTimelineUniverse(id: string): TimelineUniverse | undefined {
  return TIMELINE_UNIVERSES.find((u) => u.id.toLowerCase() === id.toLowerCase());
}

export const DEFAULT_TIMELINE_ID = "mcu";

