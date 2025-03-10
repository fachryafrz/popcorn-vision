"use client";

import { userStore } from "@/zustand/userStore";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import { trashOutline } from "ionicons/icons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";

export default function UserRating({ swrKey, rating, url, title, name }) {
  const { user } = userStore();
  const { mutate } = useSWRConfig();

  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const [ratingState, setRatingState] = useState(rating);
  const [hoverState, setHoverState] = useState(rating);
  const [isLoading, setIsLoading] = useState(true);

  const handleRating = async (value) => {
    try {
      setIsLoading(true);

      const {
        data: { rated },
      } = await axios.post(url, { rating: value });

      setIsLoading(false);
      setRatingState(rated);
      setHoverState(rated);

      mutate(swrKey);
    } catch (error) {
      console.error("Error adding rating:", error);
      setIsLoading(false);
      // Handle errors appropriately (e.g., display error message to user)
    }
  };

  const handleDeleteRating = async () => {
    try {
      setIsLoading(true);

      const {
        data: { rated },
      } = await axios.delete(url);

      setIsLoading(false);
      setRatingState(rated);
      setHoverState(rated);

      mutate(swrKey);
    } catch (error) {
      console.error("Error deleting rating:", error);
      // Handle errors appropriately (e.g., display error message to user)
    }
  };

  useEffect(() => {
    setIsLoading(false);
    setRatingState(rating);
    setHoverState(rating);
  }, [rating]);

  return (
    <>
      <div>
        <div className={`mb-2 flex items-center gap-2`}>
          <span aria-hidden className={`block text-sm font-medium`}>
            {title}
          </span>
        </div>
      </div>

      <div
        className={`flex gap-1 text-lg text-primary-yellow sm:text-2xl xs:text-xl`}
      >
        <div className={`flex items-center gap-2`}>
          <div className="rating rating-half">
            <input
              type="radio"
              // name={
              //   !episode && !season
              //     ? `rating-${film.id}`
              //     : `rating-season-${season}-episode-${episode}`
              // }
              name={name}
              checked={!ratingState?.value}
              className="rating-hidden sr-only"
            />
            {[...Array(10)].map((_, index) => {
              const starValue = index + 1;

              return (
                <input
                  key={starValue}
                  type="radio"
                  // name={
                  //   !episode && !season
                  //     ? `rating-${film.id}`
                  //     : `rating-season-${season}-episode-${episode}`
                  // }
                  name={name}
                  onMouseEnter={() => setHoverState({ value: starValue })}
                  onMouseLeave={() =>
                    setHoverState({ value: ratingState?.value })
                  }
                  onClick={() => {
                    if (!user)
                      document.getElementById("loginAlert").showModal();

                    setHoverState({ value: starValue }); // Setel hoverRating kembali ke 0
                    handleRating(starValue);
                  }}
                  checked={hoverState?.value === starValue}
                  className={`mask ${(index % 2) + 1 === 1 ? `mask-half-1` : `mask-half-2`} mask-star-2 !translate-y-0 bg-primary-yellow`}
                />
              );
            })}
          </div>

          {!isLoading && ratingState?.value > 0 && (
            <button
              onClick={async () => await handleDeleteRating()}
              className={`flex aspect-square font-medium italic text-primary-red transition-all`}
            >
              <IonIcon
                icon={trashOutline}
                style={{
                  fontSize: 24,
                }}
              />
            </button>
          )}

          {isLoading && (
            <span className="loading loading-spinner text-white"></span>
          )}
        </div>
      </div>
    </>
  );
}
