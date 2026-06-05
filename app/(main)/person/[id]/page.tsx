import { Metadata } from "next";
import { getPersonDetails, getPersonCredits } from "@/lib/tmdb-actions";
import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import PersonDetailClient from "@/components/person-detail-client";

// Page props interface
interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const person = await getPersonDetails(id);
  if (!person) {
    return {
      title: `Person Not Found | ${siteConfig.name}`,
    };
  }
  return {
    title: `${person.name} - Filmography & Biography | ${siteConfig.name}`,
    description:
      person.biography ||
      `Explore movies and TV shows of ${person.name} on ${siteConfig.name}.`,
    openGraph: {
      title: person.name,
      description: person.biography,
      images: person.profile_path
        ? [`https://image.tmdb.org/t/p/h632${person.profile_path}`]
        : [],
    },
  };
}

export default async function PersonDetailPage({ params }: PageProps) {
  const { id } = await params;
  const person = await getPersonDetails(id);
  const credits = await getPersonCredits(id);

  if (!person) {
    notFound();
  }

  return <PersonDetailClient person={person} credits={credits} />;
}
