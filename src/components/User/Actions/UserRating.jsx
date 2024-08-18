"use client";

import { IonIcon } from "@ionic/react";
import axios from "axios";
import { star, starHalf, starOutline } from "ionicons/icons";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function UserRating({
  film,
  rating,
  url,
  season,
  episode,
  title,
}) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const [isAdded, setIsAdded] = useState();
  const [hoverRating, setHoverRating] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const handleRating = async (value) => {
    try {
      setIsLoading(true);

      const {
        data: { rated },
      } = await axios.post(url, {
        type: !isTvPage ? "movie" : "tv",
        id: film.id,
        rating: value,
        season_number: season,
        episode_number: episode,
      });

      setIsLoading(false);
      setIsAdded(rated);
      setHoverRating(rated);
    } catch (error) {
      console.error("Error adding rating:", error);
      // Handle errors appropriately (e.g., display error message to user)
    }
  };

  const handleDeleteRating = async () => {
    try {
      setIsLoading(true);

      const {
        data: { rated },
      } = await axios.delete(url, {
        params: {
          id: film.id,
          type: !isTvPage ? `movie` : `tv`,
          season_number: season,
          episode_number: episode,
        },
      });

      setIsLoading(false);
      setIsAdded(rated);
      setHoverRating(rated);
    } catch (error) {
      console.error("Error deleting rating:", error);
      // Handle errors appropriately (e.g., display error message to user)
    }
  };

  useEffect(() => {
    setIsAdded(rating);
    setHoverRating(rating);
    setIsLoading(false);
  }, [rating]);

  return (
    <>
      <div className={`mb-2 flex items-center gap-2`}>
        <span className={`block text-sm font-medium italic`}>{title}</span>

        {isAdded?.value > 0 && (
          <button
            onClick={async () => await handleDeleteRating()}
            className={`block text-sm font-medium italic text-primary-blue transition-all`}
          >
            Clear rating
          </button>
        )}

        {isLoading && <span class="loading loading-spinner loading-xs"></span>}
      </div>

      <div
        className={`flex gap-1 text-lg text-primary-yellow sm:text-2xl xs:text-xl`}
        onMouseLeave={() => setHoverRating({ value: isAdded?.value })}
      >
        {[...Array(10)].map((_, index) => {
          const starValue = index + 1;
          return (
            <button
              key={index}
              onClick={async () => {
                setHoverRating({ value: starValue }); // Setel hoverRating kembali ke 0
                await handleRating(starValue);
              }}
            >
              <IonIcon
                icon={
                  hoverRating?.value >= starValue
                    ? star
                    : hoverRating?.value >= starValue - 0.5
                      ? starHalf
                      : starOutline
                }
                onMouseEnter={() => setHoverRating({ value: starValue })}
              />
            </button>
          );
        })}
      </div>
    </>
  );
}
