import axios from "axios";
import React from "react";
import PersonProfile from "./components/PersonProfile";
import PersonDetails from "./components/PersonDetails";
import PersonWorks from "./components/PersonWorks";
import { getPerson } from "@/app/api/route";

export async function generateMetadata({ params }) {
  const { id } = params;

  const person = await getPerson({ id });
  const images = await getPerson({ id, path: "/images" });

  let profiles;

  let path =
    images.profiles.length > 0
      ? images.profiles[0].file_path
      : film.backdrop_path || film.poster_path;
  if (path) {
    profiles = {
      images: `${process.env.NEXT_PUBLIC_API_IMAGE_500}${path}`,
    };
  }

  return {
    title: `${person.name}`,
    description: person.biography,
    alternates: {
      canonical: `/${`person`}/${person.id}`,
    },
    openGraph: {
      title: `${person.name} - Popcorn Vision`,
      description: person.biography,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${`person`}/${person.id}`,
      siteName: process.env.NEXT_PUBLIC_APP_NAME,
      ...profiles,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${person.name} - Popcorn Vision`,
      description: person.biography,
      creator: "@fachryafrz",
      ...profiles,
    },
  };
}

export default async function Person({ params }) {
  const { id } = params;

  const person = await getPerson({ id });
  const combinedCredits = await getPerson({
    id,
    path: "/combined_credits",
  });
  const movieCredits = await getPerson({ id, path: "/movie_credits" });
  const tvCredits = await getPerson({ id, path: "/tv_credits" });
  const images = await getPerson({ id, path: "/images" });

  return (
    <div
      className={`max-w-7xl mx-auto w-full p-4 max-h-none grid grid-cols-12 gap-4 rounded-t-[2rem] rounded-b-none`}
      style={{ overflowY: `unset` }}
    >
      {/* Person Profile */}
      <section className={`col-span-12 md:col-span-4 lg:col-span-3`}>
        <PersonProfile person={person} combinedCredits={combinedCredits} />
      </section>

      {/* Person Details */}
      <section className={`col-span-12 md:col-span-8 lg:col-span-9`}>
        <PersonDetails
          person={person}
          images={images}
          movieCredits={movieCredits}
          tvCredits={tvCredits}
        />
      </section>

      {/* Person Works */}
      {combinedCredits.cast.length > 0 && (
        <section
          className={`col-span-12 border-t border-t-white border-opacity-10 pt-4`}
        >
          <PersonWorks movieCredits={movieCredits} tvCredits={tvCredits} />
        </section>
      )}
    </div>
  );
}
