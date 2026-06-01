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
  const data = await getMediaDetails("movie", id);
  if (!data || !data.details) {
    return {
      title: `Movie Not Found | ${siteConfig.name}`,
    };
  }
  const movie = data.details;
  const releaseYear = movie.release_date ? ` (${new Date(movie.release_date).getFullYear()})` : "";
  return {
    title: `${movie.title}${releaseYear} - Watch Free on ${siteConfig.name}`,
    description: movie.overview || `Watch ${movie.title} online in high definition on ${siteConfig.name}.`,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: movie.backdrop_path ? [`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`] : [],
    },
  };
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;
  const mediaData = await getMediaDetails("movie", id);

  if (!mediaData || !mediaData.details) {
    notFound();
  }

  return <MediaDetailClient mediaType="movie" initialData={mediaData} />;
}
