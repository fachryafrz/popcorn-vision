/* eslint-disable @next/next/no-img-element */
import { IonIcon } from "@ionic/react";
import { close } from "ionicons/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// Zustand
import PersonProfile from "../Person/Profile";
import PersonDetails from "../Person/Details";
import PersonWorks from "../Person/Works";
import useSWR from "swr";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";

export default function PersonModal() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = new URLSearchParams(Array.from(searchParams.entries()));
  const personParams = searchParams.get("person");

  const getPersonModal = async (url) => {
    const res = await axios
      .get(url, {
        params: {
          language: "en",
          append_to_response: `combined_credits,movie_credits,tv_credits,images`,
        },
      })
      .then(({ data }) => data);

    return res;
  };

  const { data: person } = useSWR(
    `/api/person/${personParams}`,
    getPersonModal,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const combinedCredits = person?.combined_credits;
  const movieCredits = person?.movie_credits;
  const tvCredits = person?.tv_credits;
  const images = person?.images;

  const [films, setFilms] = useState();

  const handleClose = () => {
    current.delete("person");

    router.replace(`${pathname}?${current.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!personParams) {
      document.getElementById(`personModal`).close();
    } else {
      document.getElementById(`personModal`).showModal();
    }
  }, [personParams]);

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
      {!person && <PersonModalSkeleton />}

      {person && (
        <div className={`relative w-full max-w-7xl md:p-4 md:pt-0`}>
          <div className={`pointer-events-none sticky top-0 z-50 md:-mr-4`}>
            <button
              onClick={handleClose}
              className={`pointer-events-auto sticky top-0 z-50 ml-auto grid aspect-square place-content-center p-4`}
            >
              <IonIcon
                icon={close}
                style={{
                  fontSize: 30,
                }}
              />
            </button>
          </div>

          <div
            className={`modal-box grid max-h-none w-full max-w-none grid-cols-12 gap-4 rounded-t-3xl p-4 md:rounded-3xl`}
            style={{ overflowY: `unset` }}
          >
            {/* Person Profile */}
            <section className={`col-span-12 md:col-span-4 lg:col-span-3`}>
              <PersonProfile
                person={person}
                images={images}
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

function PersonModalSkeleton() {
  const loadingClass = `animate-pulse bg-gray-400 bg-opacity-20 rounded`;

  return (
    <div className={`relative w-full max-w-7xl md:p-4 md:pt-0`}>
      <div className={`pointer-events-none sticky top-0 z-50 md:-mr-4`}>
        <button
          className={`pointer-events-auto sticky top-0 z-50 ml-auto grid aspect-square place-content-center p-4`}
        >
          <IonIcon
            icon={close}
            style={{
              fontSize: 30,
            }}
          />
        </button>
      </div>

      <div
        className={`modal-box grid max-h-none w-full max-w-none grid-cols-12 gap-4 rounded-t-3xl p-4 md:rounded-3xl`}
        style={{ overflowY: `unset` }}
      >
        {/* Person Profile */}
        <section className={`col-span-12 md:col-span-4 lg:col-span-3`}>
          <div
            className={`sticky top-4 overflow-hidden rounded-2xl bg-secondary bg-opacity-10 sm:flex sm:items-center md:block`}
          >
            {/* Profile Picture */}
            <figure
              className={`${loadingClass} aspect-poster rounded-none bg-base-100 sm:flex-[2]`}
              style={{
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
            ></figure>

            {/* Person Info */}
            <div className={`flex flex-1 flex-col gap-4 p-4 pb-6`}>
              {/* Name */}
              <div
                className={`${loadingClass} mx-auto h-9 w-full max-w-[200px]`}
              ></div>

              {/* Info */}
              <div className={`flex flex-col gap-1`}>
                <div className={`${loadingClass} h-6 w-full max-w-[70%]`}></div>
                <div className={`${loadingClass} h-6 w-full max-w-[75%]`}></div>
                <div className={`${loadingClass} h-6 w-full max-w-[30%]`}></div>
                <div className={`${loadingClass} h-6 w-full max-w-[40%]`}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Person Details */}
        <section className={`col-span-12 md:col-span-8 lg:col-span-9`}>
          <div className={`sticky top-4 flex flex-col gap-4`}>
            <section className={`flex items-end gap-1`}>
              <Swiper
                spaceBetween={8}
                className={`relative w-full !pt-[2.5rem]`}
                wrapperClass={`rounded-xl`}
                allowSlideNext={false}
                allowSlidePrev={false}
                allowTouchMove={false}
              >
                {[...Array(5)].map((_, index) => {
                  return (
                    <SwiperSlide
                      key={index}
                      className={`max-w-[calc(100%/2.5)] transition-all sm:max-w-[calc(100%/3.5)] lg:max-w-[calc(100%/4.5)]`}
                    >
                      <figure
                        className={`${loadingClass} aspect-poster rounded-xl`}
                      ></figure>
                    </SwiperSlide>
                  );
                })}

                <div className="absolute left-0 right-0 top-0 z-20 flex max-w-7xl items-end justify-between xl:max-w-none">
                  <div className="flex items-end gap-2">
                    <div className={`${loadingClass} h-[32px] w-[80px]`}></div>
                  </div>
                </div>
              </Swiper>
            </section>

            <section className={`flex flex-wrap gap-12`}>
              <div className={`${loadingClass} h-[56px] w-[76px]`}></div>
              <div className={`${loadingClass} h-[56px] w-[76px]`}></div>
              <div className={`${loadingClass} h-[56px] w-[76px]`}></div>
            </section>

            <section
              className={`flex flex-col gap-2 border-t border-t-white border-opacity-10 pt-2`}
            >
              <div className={`${loadingClass} h-[32px] w-[110px]`}></div>

              <div className={`space-y-6`}>
                <div className={`flex flex-col gap-1`}>
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className={`${loadingClass} h-5 w-full rounded-md`}
                    ></div>
                  ))}
                  <div
                    className={`${loadingClass} h-5 w-[80%] rounded-md`}
                  ></div>
                </div>

                <div className={`flex flex-col gap-1`}>
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className={`${loadingClass} h-5 w-full rounded-md`}
                    ></div>
                  ))}
                  <div
                    className={`${loadingClass} h-5 w-[50%] rounded-md`}
                  ></div>
                </div>

                <div className={`flex flex-col gap-1`}>
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className={`${loadingClass} h-5 w-full rounded-md`}
                    ></div>
                  ))}
                  <div
                    className={`${loadingClass} h-5 w-[30%] rounded-md`}
                  ></div>
                </div>
              </div>
            </section>
          </div>
        </section>

        {/* Person Works */}
        <section
          className={`col-span-12 border-t border-t-white border-opacity-10 pt-4`}
        >
          <div className={`flex gap-4`}>
            <div className={`${loadingClass} h-[32px] w-[84px]`}></div>
            <div className={`${loadingClass} h-[32px] w-[84px]`}></div>
          </div>

          <Swiper
            spaceBetween={8}
            breakpoints={{
              640: {
                // slidesPerView: 3,
                slidesPerGroup: 3,
              },
              768: {
                // slidesPerView: 4,
                slidesPerGroup: 4,
              },
              1024: {
                // slidesPerView: 5,
                slidesPerGroup: 5,
              },
            }}
            allowSlideNext={false}
            allowSlidePrev={false}
            allowTouchMove={false}
            className={`relative !pb-[2rem] !pt-[1rem] before:pointer-events-none before:absolute before:inset-0 before:z-10 before:hidden before:max-w-[1rem] before:bg-gradient-to-r before:from-base-100 after:pointer-events-none after:absolute after:right-0 after:top-0 after:z-10 after:hidden after:!h-full after:!w-[1rem] after:bg-gradient-to-l after:from-base-100 xl:before:hidden xl:after:hidden`}
          >
            {[...Array(7)].map((_, index) => {
              return (
                <SwiperSlide
                  key={index}
                  className={`max-w-[calc(100%/2.5)] overflow-hidden transition-all sm:max-w-[calc(100%/3.5)] md:max-w-[calc(100%/4.5)] lg:max-w-[calc(100%/5.5)]`}
                >
                  <article>
                    <figure
                      className={`${loadingClass} relative aspect-poster overflow-hidden rounded-lg`}
                    ></figure>

                    <div className="mt-2 space-y-1">
                      <div className={`${loadingClass} h-[24px] w-[50%]`}></div>

                      <div className={`${loadingClass} h-[18px] w-[30%]`}></div>
                    </div>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
      </div>
    </div>
  );
}
