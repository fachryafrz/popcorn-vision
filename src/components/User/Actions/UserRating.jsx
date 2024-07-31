"use client";

import { IonIcon } from "@ionic/react";
import axios from "axios";
import { star, starHalf, starOutline } from "ionicons/icons";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function UserRating({ film, getAccountStates, rating }) {
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const [isAdded, setIsAdded] = useState();
  const [hoverRating, setHoverRating] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleRating = async (value) => {
    try {
      setIsLoading(true);

      await axios
        .post(`/api/account/rating`, {
          type: !isTvPage ? "movie" : "tv",
          id: film.id,
          rating: value,
        })
        .then(({ data: { rated } }) => {
          setIsLoading(false);
          setIsAdded(rated);
          setHoverRating(rated);
        });
    } catch (error) {
      console.error("Error adding rating:", error);
      // Handle errors appropriately (e.g., display error message to user)
    }
  };

  const handleDeleteRating = async () => {
    try {
      setIsLoading(true);

      await axios
        .delete(`/api/account/rating`, {
          params: {
            id: film.id,
            type: !isTvPage ? `movie` : `tv`,
          },
        })
        .then(({ data: { rated } }) => {
          setIsLoading(false);
          setIsAdded(rated);
          setHoverRating(rated);
        });
    } catch (error) {
      console.error("Error deleting rating:", error);
      // Handle errors appropriately (e.g., display error message to user)
    }
  };

  useEffect(() => {
    setIsAdded(rating);
    setHoverRating(rating);
  }, [rating]);

  return (
    <>
      <div className={`flex items-center gap-2`}>
        <span className={`mb-2 block text-sm font-medium`}>Your rating</span>

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

      {isAdded?.value > 0 && (
        <button
          onClick={async () => await handleDeleteRating()}
          className={`text-sm font-medium italic text-primary-blue transition-all`}
        >
          Clear rating
        </button>
      )}
    </>
  );
}
