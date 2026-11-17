import { Suspense, use } from "react";
import MediaDetailClient from "@/components/media-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = false;

export function generateStaticParams() {
  return [];
}

export default function TvDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return (
    <Suspense>
      <MediaDetailClient mediaType="tv" id={id} />
    </Suspense>
  );
}
