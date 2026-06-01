import { Metadata } from "next";
import { getMediaDetails } from "@/lib/tmdb-actions";
import { notFound } from "next/navigation";
import MediaDetailClient from "@/components/media-detail-client";
import { siteConfig } from "@/config/site";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getMediaDetails("tv", id);
  if (!data || !data.details) {
    return {
      title: `TV Show Not Found | ${siteConfig.name}`,
    };
  }
  const show = data.details;
  const releaseYear = show.first_air_date ? ` (${new Date(show.first_air_date).getFullYear()})` : "";
  return {
    title: `${show.name}${releaseYear} - Watch Free on ${siteConfig.name}`,
    description: show.overview || `Watch ${show.name} online in high definition on ${siteConfig.name}.`,
    openGraph: {
      title: show.name,
      description: show.overview,
      images: show.backdrop_path ? [`https://image.tmdb.org/t/p/w780${show.backdrop_path}`] : [],
    },
  };
}

export default async function TvDetailPage({ params }: PageProps) {
  const { id } = await params;
  const mediaData = await getMediaDetails("tv", id);

  if (!mediaData || !mediaData.details) {
    notFound();
  }

  return <MediaDetailClient mediaType="tv" initialData={mediaData} />;
}
