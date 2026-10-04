import { use } from "react";
import MediaDetailClient from "@/components/media-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function TvDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <MediaDetailClient mediaType="tv" id={id} />;
}
