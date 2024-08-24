"use client";

import { useAuth } from "@/hooks/auth";
import { IonIcon } from "@ionic/react";
import axios from "axios";
import { star, starOutline } from "ionicons/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

export default function FavoriteButton({ film, favorite }) {
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
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorite = useCallback(
    async (value) => {
      try {
        setIsLoading(true);

        const {
          data: { favorite },
        } = await axios.post(`/api/account/favorite`, {
          user_id: user.id,
          media_type: !isTvPage ? "movie" : "tv",
          media_id: film.id,
          favorite: value,
        });

        setIsLoading(false);
        setIsAdded(favorite);

        if (!current.get("approved") || !current.get("denied")) {
          current.delete("favorite");
          router.replace(`${pathname}?${current.toString()}`, {
            scroll: false,
          });
        }
      } catch (error) {
        console.error("Error adding to favorite:", error);
        setIsLoading(false);
        // Handle errors appropriately (e.g., display error message to user)
      }
    },
    [current, film, isTvPage, pathname, router, searchParams, user],
  );

  useEffect(() => {
    setIsAdded(favorite);
  }, [favorite]);

  useEffect(() => {
    if (searchParams.get("favorite")) {
      handleFavorite(searchParams.get("favorite"));
    }
  }, [handleFavorite, searchParams]);

  return (
    <button
      onClick={() => {
        if (user) {
          handleFavorite(!isAdded);
        } else {
          router.replace(`${pathname}?favorite=true`, { scroll: false });
          document.getElementById("loginAlert").showModal();
        }
      }}
      className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm`}
    >
      {isLoading ? (
        <span class="loading loading-spinner w-[20px]"></span>
      ) : (
        <IonIcon
          icon={!isAdded ? starOutline : star}
          className={`text-xl ${isAdded ? `!text-yellow-500` : ``}`}
        />
      )}
      <span>Favorite</span>
    </button>
  );
}
