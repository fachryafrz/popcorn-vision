import { Metadata } from "next";
import { getMediaDetails } from "@/lib/tmdb-actions";
import { siteConfig } from "@/config/site";
import MediaDetailClient from "@/components/media-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getMediaDetails("movie", id);
  if (!data || !data.details) {
    return { title: `Movie Not Found | ${siteConfig.name}` };
  }
  const movie = data.details;
  const releaseYear = movie.release_date
    ? ` (${new Date(movie.release_date).getFullYear()})`
    : "";
  return {
    title: `${movie.title}${releaseYear} | ${siteConfig.name}`,
    description:
      movie.overview ||
      `Explore ${movie.title} on ${siteConfig.name}.`,
    openGraph: {
      title: movie.title,
      description: movie.overview,
      images: movie.backdrop_path
        ? [`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`]
        : [],
    },
  };
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;
  const initialData = await getMediaDetails("movie", id);
  return <MediaDetailClient mediaType="movie" id={id} initialData={initialData} />;
}

