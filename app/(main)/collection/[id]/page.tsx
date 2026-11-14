import { use } from "react";
import CollectionDetailClient from "@/components/collection-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = false;

export function generateStaticParams() {
  return [];
}

export default function CollectionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <CollectionDetailClient id={id} />;
}
