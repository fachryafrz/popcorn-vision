/* eslint-disable @next/next/no-img-element */
import { fetchData, getPerson } from "@/app/api/route";
import FilmSlider from "@/app/components/FilmSlider";
import { slugify } from "@/app/lib/slugify";
import PersonDetails from "@/app/person/[id]/components/PersonDetails";
import PersonProfile from "@/app/person/[id]/components/PersonProfile";
import PersonWorks from "@/app/person/[id]/components/PersonWorks";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import {
  briefcaseOutline,
  calendarOutline,
  chevronBack,
  chevronForward,
  close,
  filmOutline,
  locationOutline,
} from "ionicons/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

export default function PersonModal({
  person,
  setPersonModal,
  loading,
  episode,
}) {
  const [combinedCredits, setCombinedCredits] = useState(
    person.combined_credits
  );
  const [movieCredits, setMovieCredits] = useState(person.movie_credits);
  const [tvCredits, setTVCredits] = useState(person.tv_credits);
  const [images, setImages] = useState(person.images);
  const [films, setFilms] = useState();

  const router = useRouter();

  const handleCloseModal = () => {
    document.getElementById(`personModal`).close();
    if (episode) {
      document.getElementById(`episodeModal`).showModal();
    }
    setTimeout(() => {
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
      className={`modal modal-bottom place-items-center backdrop:bg-black backdrop:bg-opacity-75 backdrop:backdrop-blur-sm overflow-y-auto`}
    >
      <div className={`pt-16 px-4 sm:pt-24 relative w-full max-w-7xl`}>
        <div className={`pointer-events-none absolute inset-0`}>
          <button
            onClick={handleCloseModal}
            className={`grid place-content-center aspect-square sticky top-0 ml-auto z-50 p-4 mr-4 pointer-events-auto`}
          >
            <IonIcon icon={close} className={`text-3xl`} />
          </button>
        </div>

        <div
          className={`modal-box max-w-none w-full p-4 max-h-none grid grid-cols-12 gap-4 rounded-t-[2rem] rounded-b-none`}
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
              <PersonWorks person={person} movieCredits={movieCredits} tvCredits={tvCredits} />
            </section>
          )}
        </div>
      </div>
    </dialog>
  );
}
