/* eslint-disable @next/next/no-img-element */
import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// Zustand
import PersonProfile from "../Person/Profile";
import PersonDetails from "../Person/Details";
import PersonWorks from "../Person/Works";
import useSWR from "swr";
import { fetchData } from "@/lib/fetch";

export default function PersonModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const personParams = searchParams.get("person");

  const getPersonModal = async () => {
    const res = await fetchData({
      endpoint: `/person/${personParams}`,
      queryParams: {
        language: "en",
        append_to_response: `combined_credits,movie_credits,tv_credits,images`,
      },
    });

    return res;
  };

  const { data: person } = useSWR(`/person/${personParams}`, getPersonModal, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const combinedCredits = person?.combined_credits;
  const movieCredits = person?.movie_credits;
  const tvCredits = person?.tv_credits;
  const images = person?.images;

  const [films, setFilms] = useState();

  const handleCloseModal = () => {
    document.getElementById(`personModal`).close();

    router.back();
  };

  useEffect(() => {
    if (!person) return;

    document.getElementById(`personModal`).showModal();
  }, [person]);

  useEffect(() => {
    if (movieCredits && tvCredits) {
      setFilms({
        cast: [...movieCredits.cast, ...tvCredits.cast],
        crew: [...movieCredits.crew, ...tvCredits.crew],
      });
    }
  }, [movieCredits, tvCredits, person]);

  return (
    <dialog
      id={`personModal`}
      className={`modal modal-bottom place-items-center overflow-y-auto backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur-sm`}
    >
      {person && (
        <div className={`relative w-full max-w-7xl p-4 pt-16`}>
          <div className={`pointer-events-none absolute inset-0`}>
            <button
              onClick={handleCloseModal}
              className={`pointer-events-auto sticky top-0 z-50 ml-auto mr-4 grid aspect-square place-content-center p-4`}
            >
              <IonIcon icon={close} className={`text-3xl`} />
            </button>
          </div>

          <div
            className={`modal-box grid max-h-none w-full max-w-none grid-cols-12 gap-4 rounded-[2rem] p-4`}
            style={{ overflowY: `unset` }}
          >
            {/* Person Profile */}
            <section className={`col-span-12 md:col-span-4 lg:col-span-3`}>
              <PersonProfile
                person={person}
                combinedCredits={combinedCredits}
                isModal={true}
              />
            </section>

            {/* Person Details */}
            <section className={`col-span-12 md:col-span-8 lg:col-span-9`}>
              <PersonDetails
                person={person}
                images={images}
                movieCredits={movieCredits}
                tvCredits={tvCredits}
                isModal={true}
              />
            </section>

            {/* Person Works */}
            {films?.cast.length > 0 && (
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
        </div>
      )}
    </dialog>
  );
}
