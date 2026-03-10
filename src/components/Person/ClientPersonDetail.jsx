"use client";

import React from "react";
import useSWR from "swr";
import PersonProfile from "@/components/Person/Profile";
import PersonDetails from "@/components/Person/Details";
import PersonWorks from "@/components/Person/Works";
import { axios } from "@/lib/axios";

export default function ClientPersonDetail({ id }) {
  const { data: person, error, isLoading } = useSWR(
    `/api/person/${id}?language=en&append_to_response=combined_credits,movie_credits,tv_credits,images`,
    (url) => axios.get(url).then((res) => res.data),
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return (
        <div className={`mx-auto grid max-h-none w-full max-w-7xl grid-cols-12 gap-4 rounded-b-none rounded-t-[2rem] p-4 min-h-screen items-center justify-center`}>
            <span className="col-span-12 flex justify-center loading loading-spinner loading-lg text-primary"></span>
        </div>
    );
  }

  if (error || !person) {
    return <div className="p-8 text-center text-red-500">Failed to load person details.</div>;
  }

  const {
    combined_credits: combinedCredits,
    movie_credits: movieCredits,
    tv_credits: tvCredits,
    images,
  } = person;

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
      {combinedCredits?.cast?.length > 0 && (
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
