import { use } from "react";
import CollectionDetailClient from "@/components/collection-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CollectionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <CollectionDetailClient id={id} />;
}
