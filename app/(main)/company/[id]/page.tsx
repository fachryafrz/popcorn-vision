import { Suspense, use } from "react";
import CompanyDetailClient from "@/components/company-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = false;

export function generateStaticParams() {
  return [];
}

export default function CompanyDetailPage({ params }: PageProps) {
  const { id } = use(params);
  return (
    <Suspense>
      <CompanyDetailClient id={id} />
    </Suspense>
  );
}
