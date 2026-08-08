import HomeClient from "@/components/home-client";
import { Suspense } from "react";

export const metadata = {
  title: "PopcornVision — Watch Movies & TV Shows Free",
  description:
    "Discover, track, and watch movies and TV shows for free on PopcornVision.",
};

export default function Page() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  );
}
