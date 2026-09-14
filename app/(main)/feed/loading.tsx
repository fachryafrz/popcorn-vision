import { FeedSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <main className="min-h-screen pt-24 pb-12 bg-background">
      <FeedSkeleton />
    </main>
  );
}
