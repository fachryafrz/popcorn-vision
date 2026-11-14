import { use } from "react";
import MediaDetailClient from "@/components/media-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = false;

export function generateStaticParams() {
  return [];
}

export default function MovieDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <MediaDetailClient mediaType="movie" id={id} />;
}
