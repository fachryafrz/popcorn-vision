import { Metadata } from "next";
import { TimelinesHub } from "@/components/timelines/timelines-hub";

export const metadata: Metadata = {
  title: "Franchise Timelines & Universe Maps - Popcorn Vision",
  description:
    "Explore major film and TV franchises in chronological watch order. Star Wars, Marvel, Middle-earth, and more with interactive eras and watch progress tracking.",
};

export default function TimelinesPage() {
  return <TimelinesHub />;
}
