import ActivityFeed from "@/components/activity-feed";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Activity Feed - Popcorn Vision",
  description: "See what movies and shows your friends are watching, rating, and reviewing.",
};

export default function FeedPage() {
  return (
    <main className="min-h-screen pt-24 pb-12 bg-background">
      <ActivityFeed />
    </main>
  );
}
