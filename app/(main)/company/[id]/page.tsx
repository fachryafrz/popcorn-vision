import { use } from "react";
import CompanyDetailClient from "@/components/company-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CompanyDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return <CompanyDetailClient id={id} />;
}
