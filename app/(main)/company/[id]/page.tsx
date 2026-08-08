import { Metadata } from "next";
import { getCompanyDetails } from "@/lib/tmdb-actions";
import { siteConfig } from "@/config/site";
import CompanyDetailClient from "@/components/company-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const company = await getCompanyDetails(id);
  if (!company) {
    return {
      title: `Company Not Found | ${siteConfig.name}`,
    };
  }
  return {
    title: `${company.name} - Movies & TV Shows | ${siteConfig.name}`,
    description:
      company.description ||
      `Explore movies and TV shows produced by ${company.name} on ${siteConfig.name}.`,
    openGraph: {
      title: company.name,
      description: company.description,
      images: company.logo_path
        ? [`https://image.tmdb.org/t/p/w500${company.logo_path}`]
        : [],
    },
  };
}

export default async function CompanyDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <CompanyDetailClient id={id} />;
}
