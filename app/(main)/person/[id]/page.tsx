import { use } from "react";
import PersonDetailClient from "@/components/person-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PersonDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <PersonDetailClient id={id} />;
}
