"use client";

import { useAuth } from "@/hooks/auth";
import { QueryData } from "@/lib/fetch";
import { IonIcon } from "@ionic/react";
import { bookmark, bookmarkOutline } from "ionicons/icons";
import { useCookies } from "next-client-cookies";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function WatchlistButton({ film, getAccountStates }) {
  const { user } = useAuth();
  const cookies = useCookies();
  const pathname = usePathname();
  const isTvPage = pathname.startsWith("/tv");

  const [isAdded, setIsAdded] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleWatchlist = async (watchlist) => {
    try {
      setIsLoading(true);

      await QueryData({
        endpoint: `/account/${user.id}/watchlist`,
        queryParams: {
          session_id: cookies.get("tmdb.session_id"),
        },
        data: {
          media_type: isTvPage ? "tv" : "movie",
          media_id: film.id,
          watchlist: watchlist,
        },
      });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      // Handle errors appropriately (e.g., display error message to user)
    } finally {
      setIsLoading(false);
    }

    await getAccountStates({
      setValue: setIsAdded,
      setIsLoading,
      type: "watchlist",
    });
  };

  useEffect(() => {
    getAccountStates({
      setValue: setIsAdded,
      setIsLoading,
      type: "watchlist",
    });
  }, [getAccountStates]);

  return (
    <button
      onClick={() => handleWatchlist(!isAdded)}
      className={`btn btn-ghost flex items-center gap-2 rounded-full bg-white bg-opacity-5 text-sm backdrop-blur-sm`}
    >
      {isLoading ? (
        <span class="loading loading-spinner w-[20px]"></span>
      ) : (
        <IonIcon
          icon={!isAdded ? bookmarkOutline : bookmark}
          className={`text-xl`}
        />
      )}
      {/* <span>{!isAdded ? "Add to Watchlist" : "Remove from Watchlist"}</span> */}
      <span>Watchlist</span>
    </button>
  );
}