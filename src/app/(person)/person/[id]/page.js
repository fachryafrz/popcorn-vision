import React from "react";
import PersonProfile from "../../../../components/Person/Profile";
import PersonDetails from "../../../../components/Person/Details";
import PersonWorks from "../../../../components/Person/Works";
import { axios } from "@/lib/axios";
import { siteConfig } from "@/config/site";

async function getPerson({ id, path }) {
  const res = await axios.get(`/person/${id}${path}`, {
    params: {
      language: "en",
      append_to_response: `combined_credits,movie_credits,tv_credits,images`,
    },
  });

  return res;
}

export async function generateMetadata({ params }) {
  const { id } = params;

  const [person, images] = await Promise.all([
    getPerson({ id }),
    getPerson({ id, path: "/images" }),
  ]);

  let profiles;

  let path =
    images.profiles.length > 0
      ? images.profiles[0].file_path
      : film.backdrop_path || film.poster_path;
  if (path) {
    profiles = {
      images: `https://image.tmdb.org/t/p/w500${path}`,
    };
  }

  return {
    title: `${person.name}`,
    description: person.biography,
    openGraph: {
      title: `${person.name} - ${siteConfig.name}`,
      description: person.biography,
      url: `${siteConfig.url}/${`person`}/${person.id}`,
      siteName: siteConfig.name,
      ...profiles,
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function Person({ params }) {
  const { id } = params;

  const [person] = await Promise.all([getPerson({ id })]);
  const {
    combined_credits: combinedCredits,
    movie_credits: movieCredits,
    tv_credits: tvCredits,
    images,
  } = person;

  // const combinedCredits = await getPerson({
  //   id,
  //   path: "/combined_credits",
  // });
  // const movieCredits = await getPerson({ id, path: "/movie_credits" });
  // const tvCredits = await getPerson({ id, path: "/tv_credits" });
  // const images = await getPerson({ id, path: "/images" });

  return (
    <div
      className={`mx-auto grid max-h-none w-full max-w-7xl grid-cols-12 gap-4 rounded-b-none rounded-t-[2rem] p-4`}
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
          <PersonWorks
            person={person}
            movieCredits={movieCredits}
            tvCredits={tvCredits}
          />
        </section>
      )}
    </div>
  );
}
