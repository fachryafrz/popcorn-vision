/* eslint-disable @next/next/no-img-element */
import PersonDetails from "@/app/(person)/components/PersonDetails";
import PersonProfile from "@/app/(person)/components/PersonProfile";
import PersonWorks from "@/app/(person)/components/PersonWorks";
import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// Redux Toolkit
import { useSelector, useDispatch } from "react-redux";
import { setPerson } from "@/redux/personSlice";

export default function PersonModal({ person }) {
  const dispatch = useDispatch();

  const episodeForModal = useSelector((state) => state.episode.value);

  const combinedCredits = person.combined_credits;
  const movieCredits = person.movie_credits;
  const tvCredits = person.tv_credits;
  const images = person.images;

  const [films, setFilms] = useState();

  const handleCloseModal = () => {
    document.getElementById(`personModal`).close();
    if (episodeForModal) {
      document.getElementById(`episodeModal`).showModal();
    }
    setTimeout(() => {
      // Redux Toolkit
      dispatch(setPerson(null));
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
      className={`modal modal-bottom place-items-center backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur-sm overflow-y-auto`}
    >
      <div className={`pt-16 p-4 relative w-full max-w-7xl`}>
        <div className={`pointer-events-none absolute inset-0`}>
          <button
            onClick={handleCloseModal}
            className={`grid place-content-center aspect-square sticky top-0 ml-auto z-50 p-4 mr-4 pointer-events-auto`}
          >
            <IonIcon icon={close} className={`text-3xl`} />
          </button>
        </div>

        <div
          className={`modal-box max-w-none w-full p-4 max-h-none grid grid-cols-12 gap-4 rounded-[2rem]`}
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
