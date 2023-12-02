import axios from "axios";
import React from "react";
import PersonProfile from "./components/PersonProfile";
import PersonDetails from "./components/PersonDetails";
import PersonWorks from "./components/PersonWorks";

async function getPerson({ id, path }) {
  const { data } = await axios.get(
    `${process.env.API_URL}/person/${id}${path}`,
    {
      params: {
        api_key: process.env.API_KEY,
        language: "en",
      },
    }
  );

  return data;
}

export async function generateMetadata({ params }) {
  const { id } = params;

  const person = await getPerson({ id: id });

  return {
    title: `${person.name}`,
  };
}

export default async function Person({ params }) {
  const { id } = params;

  const person = await getPerson({ id: id });
  const combinedCredits = await getPerson({
    id: id,
    path: "/combined_credits",
  });
  const movieCredits = await getPerson({ id: id, path: "/movie_credits" });
  const tvCredits = await getPerson({ id: id, path: "/tv_credits" });
  const images = await getPerson({ id: id, path: "/images" });

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
