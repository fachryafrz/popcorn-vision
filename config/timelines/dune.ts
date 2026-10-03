import { TimelineUniverse } from "@/types/timeline";

const BASE_X = 100;
const STEP_X = 240;
const MAIN_Y = 300;
const PREQUEL_Y = -140;

export const duneTimeline: TimelineUniverse = {
  id: "dune",
  name: "Dune Universe",
  shortName: "Dune",
  description:
    "Denis Villeneuve's saga and Dune: Prophecy in chronological order, spanning thousands of years across Arrakis and the Imperium.",
  accentColor: "#F59E0B",
  category: "scifi",
  defaultFilterId: "all",
  filters: [
    {
      id: "all",
      label: "All Lore",
      description: "Prophecy and Villeneuve's Dune Saga",
    },
  ],
  nodes: [
    {
      id: "dune-prophecy",
      type: "mediaNode",
      position: { x: BASE_X, y: PREQUEL_Y },
      data: {
        id: "dune-prophecy",
        tmdbId: 90228,
        mediaType: "tv",
        title: "Dune: Prophecy",
        releaseYear: "2024",
        chronologicalYear: "10,148 BG",
        posterPath: "/oWVohNsxkxA3u92EzRo8fTuXIS0.jpg",
        rating: 7.5,
        phase: "Sisterhood",
        canonType: "spinoff",
        branchName: "Origins of Bene Gesserit",
      },
    },
    {
      id: "dune-part-one",
      type: "mediaNode",
      position: { x: BASE_X + STEP_X, y: MAIN_Y },
      data: {
        id: "dune-part-one",
        tmdbId: 438631,
        mediaType: "movie",
        title: "Dune: Part One",
        releaseYear: "2021",
        chronologicalYear: "10,191 AG",
        posterPath: "/v1tRXZ4JtD2Iv6fjkPvT4GiwslV.jpg",
        rating: 7.9,
        phase: "Paul's Journey",
        canonType: "sacred",
        branchName: "Fall of House Atreides",
        isAnchor: true,
      },
    },
    {
      id: "dune-part-two",
      type: "mediaNode",
      position: { x: BASE_X + STEP_X * 2, y: MAIN_Y },
      data: {
        id: "dune-part-two",
        tmdbId: 693134,
        mediaType: "movie",
        title: "Dune: Part Two",
        releaseYear: "2024",
        chronologicalYear: "10,192 AG",
        posterPath: "/6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
        rating: 8.2,
        phase: "Paul's Journey",
        canonType: "sacred",
        branchName: "Rise of Muad'Dib",
        isAnchor: true,
      },
    },
    {
      id: "dune-messiah",
      type: "mediaNode",
      position: { x: BASE_X + STEP_X * 3, y: MAIN_Y },
      data: {
        id: "dune-messiah",
        tmdbId: 1170608,
        mediaType: "movie",
        title: "Dune: Part Three",
        releaseYear: "2026",
        chronologicalYear: "10,204 AG",
        posterPath: "/d43fvHQsIMa4kpyhKXw0haEJIvI.jpg",
        rating: 8.0,
        phase: "Holy War",
        canonType: "sacred",
        branchName: "Emperor Paul Atreides",
        isAnchor: true,
      },
    },
  ],
  edges: [
    {
      id: "e-dune-1",
      source: "dune-prophecy",
      target: "dune-part-one",
      sourceHandle: "bottom",
      targetHandle: "target-top",
      branchVariant: "secondary",
      label: "10,000 YEARS PRIOR",
    },
    { id: "e-dune-2", source: "dune-part-one", target: "dune-part-two" },
    { id: "e-dune-3", source: "dune-part-two", target: "dune-messiah" },
  ],
};
