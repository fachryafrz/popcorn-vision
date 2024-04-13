/* eslint-disable @next/next/no-img-element */
import PersonDetails from "@/app/(person)/components/PersonDetails";
import PersonProfile from "@/app/(person)/components/PersonProfile";
import PersonWorks from "@/app/(person)/components/PersonWorks";
import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// Zustand
import { usePersonModal } from "@/zustand/personModal";
import { useEpisodeModal } from "@/zustand/episodeModal";

export default function PersonModal({ person }) {
  const router = useRouter();
  const pathname = usePathname();

  const { episode: episodeForModal } = useEpisodeModal((state) => state);
  const { setPersonModal } = usePersonModal((state) => state);

  const combinedCredits = person.combined_credits;
  const movieCredits = person.movie_credits;
  const tvCredits = person.tv_credits;
  const images = person.images;

  const [films, setFilms] = useState();

  const handleCloseModal = () => {
    document.getElementById(`personModal`).close();
    router.push(pathname, { scroll: false });

    if (episodeForModal) {
      document.getElementById(`episodeModal`).showModal();
    }
    setTimeout(() => {
      // Zustand
      setPersonModal(null);
    }, 100);

    // router.back();
  };

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
    </dialog>
  );
}
