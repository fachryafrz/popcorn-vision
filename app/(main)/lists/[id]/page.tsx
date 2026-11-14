import { use } from "react";
import ListDetailClient from "@/components/custom-lists/list-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = false;

export function generateStaticParams() {
  return [];
}

export default function CustomListDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <ListDetailClient id={id} />;
}
