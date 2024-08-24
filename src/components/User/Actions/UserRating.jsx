"use client";

import { useAuth } from "@/hooks/auth";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import { star, starHalf, starOutline } from "ionicons/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

export default function UserRating({
  film,
  rating,
  url,
  season,
  episode,
  title,
}) {
  const { user } = useAuth();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isTvPage = pathname.startsWith("/tv");
  const current = useMemo(
    () => new URLSearchParams(Array.from(searchParams.entries())),
    [searchParams],
  );

  const [isAdded, setIsAdded] = useState();
  const [hoverRating, setHoverRating] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const handleRating = useCallback(
    async (value) => {
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

        if (!searchParams.get("approved") || !searchParams.get("denied")) {
          current.delete("rating");
          router.replace(`${pathname}?${current.toString()}`, {
            scroll: false,
          });
        }
      } catch (error) {
        console.error("Error adding rating:", error);
        setIsLoading(false);
        // Handle errors appropriately (e.g., display error message to user)
      }
    },
    [
      episode,
      film,
      isTvPage,
      pathname,
      router,
      searchParams,
      current,
      season,
      url,
    ],
  );

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

  useEffect(() => {
    if (searchParams.get("rating")) {
      const value = parseInt(searchParams.get("rating"));

      handleRating(value);
    }
  }, [handleRating, searchParams]);

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
                if (user) {
                  setHoverRating({ value: starValue }); // Setel hoverRating kembali ke 0
                  handleRating(starValue);
                } else {
                  if (
                    !searchParams.get("season") &&
                    !searchParams.get("episode")
                  ) {
                    current.set("rating", starValue);

                    router.replace(`${pathname}?${current.toString()}`, {
                      scroll: false,
                    });
                  }
                  document.getElementById("loginAlert").showModal();
                }
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
