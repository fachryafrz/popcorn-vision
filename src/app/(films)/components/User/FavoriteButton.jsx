"use client";

import { useAuth } from "@/hooks/auth";
import { QueryData } from "@/lib/fetch";
import { IonIcon } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import { useCookies } from "next-client-cookies";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function FavoriteButton({ film, getAccountStates }) {
  const { user } = useAuth();
  const cookies = useCookies();
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const [isAdded, setIsAdded] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleFavorite = async (favorite) => {
    try {
      setIsLoading(true);

      await QueryData({
        endpoint: `/account/${user.id}/favorite`,
        queryParams: {
          session_id: cookies.get("tmdb.session_id"),
        },
        data: {
          media_type: isTvPage ? "tv" : "movie",
          media_id: film.id,
          favorite: favorite,
        },
      });
    } catch (error) {
      console.error("Error adding to favorite:", error);
      // Handle errors appropriately (e.g., display error message to user)
    } finally {
      setIsLoading(false);
    }

    await getAccountStates({
      setValue: setIsAdded,
      setIsLoading,
      type: "favorite",
    });
  };

  useEffect(() => {
    getAccountStates({
      setValue: setIsAdded,
      setIsLoading,
      type: "favorite",
    });
  }, [getAccountStates]);

  return (
    <button
      onClick={() => handleFavorite(!isAdded)}
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
